# workspace-audit: report structure drift and bloat in the Classroom Tools repo.
# Read-only. It never moves, renames, or deletes anything.
#
#   powershell -File ".claude/skills/workspace-audit/scripts/audit.ps1"            (capped lists)
#   powershell -File ".claude/skills/workspace-audit/scripts/audit.ps1" -Detail    (every finding)
#
# Exit 0 = no drift. Exit 1 = drift findings present. Bloat and info never fail the run.
# Keep this file ASCII-only: Windows PowerShell 5.1 reads a BOM-less script as ANSI.

param(
    [switch]$Detail,
    [int]$Max = 10
)

$ErrorActionPreference = 'Continue'
$root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..\..\..')).Path
Push-Location -LiteralPath $root

# ---------------------------------------------------------------- config ----
# Edit these when the rules in CLAUDE.md change, or to accept a known exception.

$TypeRoots     = @('worksheets', 'tests-quizzes', 'notes-packages', 'lesson-plans')
$MaterialRoots = $TypeRoots + @('prompts', 'steam', 'public/materials')
$ContextRoots  = $TypeRoots + @('prompts', 'research', 'templates', 'scripts', 'steam')

# Subject folder -> filename prefix
$PrefixMap = @{
    'grade-6-science' = 'sci6';  'grade-7-science' = 'sci7'
    'grade-8-social'  = 'soc8';  'grade-9-social'  = 'soc9'
    'math-9'          = 'math9'; 'esports'         = 'esports'
    'phys-ed-56'      = 'pew56'; 'phys-ed-79'      = 'pew79'
}

# Files allowed at the repo root
$RootFiles = @('CLAUDE.md', 'README.md', '_status.md', '_status-archive.md', '_meta-context.md',
    '_site-context.md', '_pedagogy-reference.md', '.gitignore', 'astro.config.mjs', 'netlify.toml',
    'package.json', 'package-lock.json', 'tailwind.config.mjs', 'tsconfig.json')

# Files read at the start of every conversation, with line budgets
$AlwaysRead      = [ordered]@{ 'CLAUDE.md' = 175; '_status.md' = 130; '_meta-context.md' = 260 }
$AlwaysReadBytes = 40000     # combined budget for the three files above
$ContextMaxLines = 500       # any other context file
$LargeFileBytes  = 2MB
$StatusStaleDays = 14

# Docs whose backticked paths are checked. _status-archive.md is history, so it is skipped.
$RefDocsRoot = @('CLAUDE.md', '_status.md', '_meta-context.md', '_site-context.md', '_pedagogy-reference.md')

# Names that are exempt from the -v[N] naming rule
$NameAllow = @('evidence-design-principles.md')

$ScriptExt    = @('.py', '.pl', '.gs', '.sh', '.ps1')
# Renders that stay beside their source: posters are print-only, and tests and question banks
# must not be deployed to the student-facing site.
$RenderStaysPattern = '-poster-|-test-v\d|-question-bank-'
$TextExt      = @('.md', '.html', '.tex', '.txt', '.json', '.css', '.svg')
$ImageExt     = @('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp')
$ByproductExt = @('.aux', '.log', '.out', '.gz', '.toc', '.fls', '.fdb_latexmk')
$SkipDirs     = @('.git', 'node_modules', 'dist', '.astro')

# --------------------------------------------------------------- helpers ----

$findings = New-Object System.Collections.Generic.List[object]
function Add-Finding([string]$Level, [string]$Code, [string]$Path, [string]$Note) {
    $findings.Add([pscustomobject]@{ Level = $Level; Code = $Code; Path = $Path; Note = $Note })
}
function Get-Leaf([string]$p) { return ($p -split '/')[-1] }
function Get-Ext([string]$p) { return [System.IO.Path]::GetExtension($p).ToLower() }
function Test-Under([string]$p, [string[]]$roots) {
    foreach ($r in $roots) { if ($p.StartsWith($r + '/')) { return $true } }
    return $false
}
function Read-Text([string]$p) {
    try { return [System.IO.File]::ReadAllText((Join-Path $root $p)) } catch { return '' }
}
# Text files are compared with line endings normalised, so a CRLF/LF difference is not a divergence.
function Get-Hash([string]$p) {
    try {
        if ($TextExt -notcontains (Get-Ext $p)) { return (Get-FileHash -LiteralPath (Join-Path $root $p) -Algorithm SHA256).Hash }
        $bytes = [System.Text.Encoding]::UTF8.GetBytes(((Read-Text $p) -replace "`r`n", "`n"))
        $sha = [System.Security.Cryptography.SHA256]::Create()
        try { return [System.BitConverter]::ToString($sha.ComputeHash($bytes)) } finally { $sha.Dispose() }
    } catch { return 'unreadable:' + $p }
}
# Context files, templates, and other structural files that do not carry a version number
function Test-Exempt([string]$p) {
    $leaf = Get-Leaf $p
    if ($leaf.StartsWith('_')) { return $true }
    if ($leaf -match '-context\.[a-z]+$') { return $true }
    if ($leaf -match '-template\.[a-z]+$') { return $true }
    if ($NameAllow -contains $leaf) { return $true }
    return $false
}

# ------------------------------------------------------------- inventory ----

$tracked   = @(& git -c core.quotepath=off ls-files)
$untracked = @(& git -c core.quotepath=off ls-files --others --exclude-standard)
$ignored   = @(& git -c core.quotepath=off ls-files --others --ignored --exclude-standard)
$files     = @($tracked + $untracked | Where-Object { $_ } | Sort-Object -Unique)
$materials = @($files | Where-Object { Test-Under $_ $MaterialRoots })

$diskDirs  = New-Object System.Collections.Generic.List[object]
$diskNames = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
foreach ($top in Get-ChildItem -LiteralPath $root -Force) {
    if ($SkipDirs -contains $top.Name) { continue }
    [void]$diskNames.Add($top.Name)
    if ($top.PSIsContainer) {
        $diskDirs.Add($top)
        foreach ($item in Get-ChildItem -LiteralPath $top.FullName -Recurse -Force -ErrorAction SilentlyContinue) {
            if ($item.FullName -match '\\node_modules(\\|$)') { continue }
            [void]$diskNames.Add($item.Name)
            if ($item.PSIsContainer) { $diskDirs.Add($item) }
        }
    }
}

# ---------------------------------------------------------- naming drift ----

$namePattern = '^[a-z0-9]+(-[a-z0-9]+)*-v\d+\.[a-z0-9]+$'
foreach ($f in $materials) {
    $leaf = Get-Leaf $f
    $ext  = Get-Ext $f
    if ($ScriptExt -contains $ext) {
        Add-Finding 'DRIFT' 'SCRIPT_IN_MATERIALS' $f 'scripts belong in scripts/'
        continue
    }
    if (Test-Exempt $f) { continue }
    if ($ImageExt -contains $ext) { continue }
    if ($leaf -cnotmatch $namePattern) {
        Add-Finding 'DRIFT' 'NAME_PATTERN' $f 'expected [subject]-[unit]-[type]-v[N].ext, lowercase, version last'
        continue
    }
    $seg = $f -split '/'
    $expected = $null
    if ($seg[0] -eq 'steam' -and $seg.Count -gt 2 -and $seg[1] -match '^grade-(\d)$') { $expected = 'steam' + $Matches[1] }
    elseif ($seg[0] -eq 'public' -and $seg.Count -gt 3 -and $PrefixMap.ContainsKey($seg[2].ToLower())) { $expected = $PrefixMap[$seg[2].ToLower()] }
    elseif ($TypeRoots -contains $seg[0] -and $seg.Count -gt 2 -and $PrefixMap.ContainsKey($seg[1].ToLower())) { $expected = $PrefixMap[$seg[1].ToLower()] }
    if ($expected -and (($leaf -split '-')[0] -ne $expected)) {
        Add-Finding 'DRIFT' 'PREFIX_MISMATCH' $f ("folder expects prefix '" + $expected + "-'")
    }
}
foreach ($f in @($files | Where-Object { $_.StartsWith('research/') })) {
    if (-not (Test-Exempt $f) -and (Get-Leaf $f) -cnotmatch '^[a-z0-9]+(-[a-z0-9]+)*-research\.md$') {
        Add-Finding 'DRIFT' 'NAME_PATTERN' $f 'expected [topic]-research.md'
    }
}
foreach ($f in @($files | Where-Object { $_.StartsWith('templates/') })) {
    if (-not (Test-Exempt $f)) { Add-Finding 'DRIFT' 'NAME_PATTERN' $f 'expected [type]-template.md' }
}

$badDirs = @{}
foreach ($f in @($files | Where-Object { (Test-Under $_ ($ContextRoots + @('_courses', 'public'))) })) {
    $seg = $f -split '/'
    for ($i = 0; $i -lt $seg.Count - 1; $i++) {
        if ($seg[$i] -cmatch '[A-Z ]') { $badDirs[($seg[0..$i] -join '/')] = $true }
    }
}
foreach ($d in ($badDirs.Keys | Sort-Object)) {
    Add-Finding 'DRIFT' 'DIR_CASE' ($d + '/') 'folder names are lowercase-with-hyphens'
}

# ------------------------------------------------------- placement drift ----

foreach ($f in $materials) {
    $seg = $f -split '/'
    if ($TypeRoots -contains $seg[0] -and $seg.Count -lt 4 -and -not (Test-Exempt $f) -and ($ScriptExt -notcontains (Get-Ext $f))) {
        Add-Finding 'DRIFT' 'NO_UNIT_FOLDER' $f 'expected [type]/[subject]/[unit]/filename'
    }
    if ($f.StartsWith('public/materials/') -and (@('.md', '.tex') -contains (Get-Ext $f))) {
        Add-Finding 'DRIFT' 'SOURCE_IN_PUBLIC' $f 'public/materials/ holds renders only'
    }
}

$publicNames = @{}
foreach ($f in @($materials | Where-Object { $_.StartsWith('public/materials/') })) { $publicNames[(Get-Leaf $f).ToLower()] = $true }
$renders = @($materials | Where-Object {
        -not $_.StartsWith('public/') -and (@('.html', '.pdf') -contains (Get-Ext $_)) -and ((Get-Leaf $_) -notmatch $RenderStaysPattern) -and -not (Test-Exempt $_)
    })
foreach ($g in ($renders | Group-Object { ($_ -split '/')[0..1] -join '/' } | Sort-Object Name)) {
    $inPublic = @($g.Group | Where-Object { $publicNames.ContainsKey((Get-Leaf $_).ToLower()) }).Count
    Add-Finding 'DRIFT' 'RENDER_BESIDE_SOURCE' ($g.Name + '/') ('{0} HTML/PDF renders beside sources; {1} also exist in public/materials, {2} do not' -f $g.Count, $inPublic, ($g.Count - $inPublic))
}

foreach ($e in Get-ChildItem -LiteralPath $root -Force) {
    if ($SkipDirs -contains $e.Name) { continue }
    if ($e.PSIsContainer) { continue }
    if ($RootFiles -contains $e.Name) { continue }
    if ($ignored -contains $e.Name) { continue }
    Add-Finding 'DRIFT' 'ROOT_STRAY' $e.Name 'not a root-level file; move into a type folder or _courses/'
}

# --------------------------------------------------------- stale context ----

foreach ($r in $ContextRoots) {
    if ((Test-Path -LiteralPath (Join-Path $root $r)) -and -not (Test-Path -LiteralPath (Join-Path $root ($r + '/_context.md')))) {
        Add-Finding 'DRIFT' 'MISSING_CONTEXT' ($r + '/') 'no _context.md'
    }
}
$courseDirs = @()
if (Test-Path -LiteralPath (Join-Path $root '_courses')) {
    $courseDirs = @(Get-ChildItem -LiteralPath (Join-Path $root '_courses') -Directory)
    foreach ($c in $courseDirs) {
        if (@(Get-ChildItem -LiteralPath $c.FullName -Force).Count -eq 0) { continue }   # reported as EMPTY_DIR
        if (-not (Test-Path -LiteralPath (Join-Path $c.FullName '_context.md'))) {
            Add-Finding 'DRIFT' 'MISSING_CONTEXT' ('_courses/' + $c.Name + '/') 'no _context.md'
        }
    }
}
$courseNames = @($courseDirs | ForEach-Object { $_.Name.ToLower() })
$subjects = @($materials | Where-Object { $TypeRoots -contains ($_ -split '/')[0] -and ($_ -split '/').Count -ge 3 } |
        ForEach-Object { ($_ -split '/')[1] } | Sort-Object -Unique)
foreach ($s in $subjects) {
    if ($courseNames -notcontains $s.ToLower()) {
        Add-Finding 'DRIFT' 'MISSING_CONTEXT' ('_courses/' + $s + '/') 'subject has materials but no course context'
    }
}

$refDocs = @($RefDocsRoot | Where-Object { $files -contains $_ })
$refDocs += @($files | Where-Object {
        $leaf = Get-Leaf $_
        ($leaf -eq '_context.md' -or $leaf -like '*-context.md') -and -not $_.StartsWith('public/') -and -not $_.StartsWith('.claude/')
    })
$refExt = '\.(md|html|pdf|tex|py|pl|gs|astro|mjs|json|ts|toml|yml|css|svg|png|docx)$'
foreach ($doc in ($refDocs | Sort-Object -Unique)) {
    $text = Read-Text $doc
    if (-not $text) { continue }
    $docDir = Split-Path -Parent (Join-Path $root $doc)
    $seen = @{}
    foreach ($m in [regex]::Matches($text, '`([^`\r\n]+)`')) {
        $c = $m.Groups[1].Value.Trim()
        if ($seen.ContainsKey($c)) { continue }
        $seen[$c] = $true
        if ($c -match '[\[\]\*<>{}|$=,;()\s\\~:]') { continue }       # placeholders, globs, commands, URLs, Windows paths
        if ($c.StartsWith('/') -or $c.Contains('..')) { continue }    # site routes, elided paths
        if ($c.StartsWith('.') -and -not $c.Contains('/')) { continue } # bare extensions such as .py
        if (-not ($c.EndsWith('/') -or $c -match $refExt)) { continue }
        $found = $false
        foreach ($base in @($root, $docDir, (Join-Path $root 'public'), (Join-Path $root 'src'))) {
            if (Test-Path -LiteralPath (Join-Path $base $c)) { $found = $true; break }
        }
        if (-not $found -and -not $c.Contains('/') -and $diskNames.Contains($c)) { $found = $true }
        if (-not $found) {
            $line = ($text.Substring(0, $m.Index) -split "`n").Count
            # A full path is a claim about where something lives. A bare filename is usually a
            # planned material or a naming example, so it is reported as info only.
            if ($c.Contains('/')) { Add-Finding 'DRIFT' 'BROKEN_REF' ($doc + ':' + $line) ('`' + $c + '` not found') }
            else { Add-Finding 'INFO' 'UNBUILT_REF' ($doc + ':' + $line) ('`' + $c + '` does not exist anywhere') }
        }
    }
}

if ($files -contains '_status.md') {
    $st = Read-Text '_status.md'
    if ($st -match 'Last updated:\s*(\d{4}-\d{2}-\d{2})') {
        $statusDate = [datetime]::ParseExact($Matches[1], 'yyyy-MM-dd', $null)
        $lastCommit = (& git log -1 --format=%cs -- $MaterialRoots '_courses' 'src') | Select-Object -First 1
        if ($lastCommit) {
            $gap = ([datetime]::ParseExact($lastCommit, 'yyyy-MM-dd', $null) - $statusDate).Days
            if ($gap -gt $StatusStaleDays) {
                Add-Finding 'DRIFT' 'STALE_STATUS' '_status.md' ('last updated {0}; materials last committed {1} ({2} days later)' -f $Matches[1], $lastCommit, $gap)
            }
        }
    }
}

# ----------------------------------------------------------------- bloat ----

# Superseded versions: same folder, same name, lower -v[N]
$siteText = (@($tracked | Where-Object { $_.StartsWith('src/') -or $_.StartsWith('scripts/') }) | ForEach-Object { Read-Text $_ }) -join "`n"
$versioned = @($materials | Where-Object { (Get-Leaf $_) -match '-v(\d+)\.[a-z0-9]+$' })
foreach ($g in ($versioned | Group-Object { $_ -replace '-v\d+(\.[a-z0-9]+)$', '$1' } | Where-Object { $_.Count -gt 1 } | Sort-Object Name)) {
    $byVer = @($g.Group | Sort-Object { [int](([regex]::Match($_, '-v(\d+)\.[a-z0-9]+$')).Groups[1].Value) })
    $newest = Get-Leaf $byVer[-1]
    foreach ($old in $byVer[0..($byVer.Count - 2)]) {
        $stem = [System.IO.Path]::GetFileNameWithoutExtension((Get-Leaf $old))
        $note = 'newest is ' + $newest
        if ($siteText.Contains($stem)) { $note += '; STILL REFERENCED in src/ or scripts/' }
        Add-Finding 'BLOAT' 'SUPERSEDED_VERSION' $old $note
    }
}

# Same filename in more than one place
$copyGroups = @($materials | Where-Object { -not (Test-Exempt $_) } | Group-Object { (Get-Leaf $_).ToLower() } | Where-Object { $_.Count -gt 1 } | Sort-Object Name)
foreach ($g in $copyGroups) {
    $hashes = @($g.Group | ForEach-Object { Get-Hash $_ } | Sort-Object -Unique)
    $where = ($g.Group | ForEach-Object { Split-Path -Parent $_ } | ForEach-Object { $_ -replace '\\', '/' }) -join '  |  '
    if ($hashes.Count -gt 1) { Add-Finding 'DRIFT' 'DIVERGED_COPY' $g.Group[0] ('copies differ: ' + $where) }
    else { Add-Finding 'BLOAT' 'IDENTICAL_COPY' $g.Group[0] ('identical in: ' + $where) }
}

foreach ($f in $ignored) {
    if ($f -match '(^|/)node_modules/' -or $f.StartsWith('dist/') -or $f.StartsWith('.astro/')) { continue }
    if ($ByproductExt -contains (Get-Ext $f)) { Add-Finding 'BLOAT' 'BYPRODUCT' $f 'build byproduct, already gitignored; safe to delete' }
}

foreach ($d in $diskDirs) {
    if (@(Get-ChildItem -LiteralPath $d.FullName -Force -ErrorAction SilentlyContinue).Count -eq 0) {
        Add-Finding 'BLOAT' 'EMPTY_DIR' ($d.FullName.Substring($root.Length + 1) -replace '\\', '/') 'empty folder'
    }
}

foreach ($f in $tracked) {
    $fi = Get-Item -LiteralPath (Join-Path $root $f) -ErrorAction SilentlyContinue
    if ($fi -and $fi.Length -gt $LargeFileBytes) {
        Add-Finding 'BLOAT' 'LARGE_FILE' $f ('{0:N1} MB tracked in git' -f ($fi.Length / 1MB))
    }
}

$sizeRows = @()
$totalBytes = 0
foreach ($name in $AlwaysRead.Keys) {
    $p = Join-Path $root $name
    if (-not (Test-Path -LiteralPath $p)) { Add-Finding 'DRIFT' 'MISSING_CONTEXT' $name 'always-read file is missing'; continue }
    $bytes = (Get-Item -LiteralPath $p).Length
    $lines = ((Read-Text $name) -split "`n").Count
    $totalBytes += $bytes
    $sizeRows += [pscustomobject]@{ File = $name; Lines = $lines; Budget = $AlwaysRead[$name]; KB = [math]::Round($bytes / 1KB, 1) }
    if ($lines -gt $AlwaysRead[$name]) {
        Add-Finding 'BLOAT' 'CONTEXT_SIZE' $name ('{0} lines, budget {1}; read at the start of every conversation' -f $lines, $AlwaysRead[$name])
    }
}
if ($totalBytes -gt $AlwaysReadBytes) {
    Add-Finding 'BLOAT' 'CONTEXT_SIZE' 'always-read set' ('{0:N1} KB combined, budget {1:N0} KB' -f ($totalBytes / 1KB), ($AlwaysReadBytes / 1KB))
}
foreach ($doc in @($refDocs | Where-Object { -not $AlwaysRead.Contains($_) } | Sort-Object -Unique)) {
    $lines = ((Read-Text $doc) -split "`n").Count
    if ($lines -gt $ContextMaxLines) { Add-Finding 'BLOAT' 'CONTEXT_SIZE' $doc ('{0} lines, budget {1}' -f $lines, $ContextMaxLines) }
}

foreach ($f in $untracked) { Add-Finding 'INFO' 'UNTRACKED' $f 'not committed and not ignored; commit it or add it to .gitignore' }

# ---------------------------------------------------------------- report ----

$about = [ordered]@{
    'NAME_PATTERN'         = 'Filename does not follow the naming table in CLAUDE.md'
    'PREFIX_MISMATCH'      = 'Subject prefix does not match the folder the file is in'
    'DIR_CASE'             = 'Folder name has capitals or spaces'
    'NO_UNIT_FOLDER'       = 'Material sits above the unit level'
    'SOURCE_IN_PUBLIC'     = 'Markdown or LaTeX source inside public/materials/'
    'SCRIPT_IN_MATERIALS'  = 'Script inside a materials folder'
    'RENDER_BESIDE_SOURCE' = 'HTML/PDF renders outside public/materials/ (posters and tests exempt)'
    'ROOT_STRAY'           = 'Unexpected file at the repo root'
    'DIVERGED_COPY'        = 'Same filename in several places with DIFFERENT content'
    'BROKEN_REF'           = 'Context file points at a path that does not exist'
    'MISSING_CONTEXT'      = 'Expected _context.md is missing'
    'STALE_STATUS'         = '_status.md is older than the latest materials commit'
    'SUPERSEDED_VERSION'   = 'Older version beside a newer one (archive candidate)'
    'IDENTICAL_COPY'       = 'Same filename in several places with identical content'
    'BYPRODUCT'            = 'Build byproducts on disk'
    'EMPTY_DIR'            = 'Empty folders'
    'LARGE_FILE'           = 'Large tracked files'
    'CONTEXT_SIZE'         = 'Context file over its size budget'
    'UNTRACKED'            = 'Untracked files'
    'UNBUILT_REF'          = 'Context file names a file that does not exist (planned material, example, or stale name)'
}

''
'WORKSPACE AUDIT  ' + (Get-Date -Format 'yyyy-MM-dd') + '   ' + $root
('{0} tracked, {1} untracked, {2} material files checked' -f $tracked.Count, $untracked.Count, $materials.Count)
''
'Always-read context'
foreach ($r in $sizeRows) { '  {0,-20} {1,4} lines (budget {2,3})  {3,5} KB' -f $r.File, $r.Lines, $r.Budget, $r.KB }
'  {0,-20} {1,26:N1} KB (budget {2:N0}, about {3:N0} tokens)' -f 'combined', ($totalBytes / 1KB), ($AlwaysReadBytes / 1KB), ($totalBytes / 4)

foreach ($level in @('DRIFT', 'BLOAT', 'INFO')) {
    $inLevel = @($findings | Where-Object { $_.Level -eq $level })
    ''
    '=== {0} ({1}) ===' -f $level, $inLevel.Count
    foreach ($code in $about.Keys) {
        $rows = @($inLevel | Where-Object { $_.Code -eq $code })
        if ($rows.Count -eq 0) { continue }
        ''
        '{0} ({1}) - {2}' -f $code, $rows.Count, $about[$code]
        $show = $rows
        if (-not $Detail -and $rows.Count -gt $Max) { $show = $rows[0..($Max - 1)] }
        foreach ($r in $show) { '  {0}' -f $r.Path; '      {0}' -f $r.Note }
        if ($show.Count -lt $rows.Count) { '  ... {0} more (run with -Detail)' -f ($rows.Count - $show.Count) }
    }
}

$drift = @($findings | Where-Object { $_.Level -eq 'DRIFT' }).Count
$bloat = @($findings | Where-Object { $_.Level -eq 'BLOAT' }).Count
$info  = @($findings | Where-Object { $_.Level -eq 'INFO' }).Count
''
'SUMMARY: {0} drift, {1} bloat, {2} info' -f $drift, $bloat, $info

Pop-Location
if ($drift -gt 0) { exit 1 } else { exit 0 }
