#!/bin/sh
# Export CEFL Town v2 (Godot) to the site. Needs Godot 4.7.2 at ~/.local/bin/godot with its web export templates.
# Runs the model tests first; stops if they fail.
set -e
cd "$(dirname "$0")/../godot/cefl-town-v2"
GODOT=${GODOT:-$HOME/.local/bin/godot}
"$GODOT" --headless --path . --import >/dev/null 2>&1 || true
"$GODOT" --headless --path . -s res://tests/test_model.gd
"$GODOT" --headless --path . --export-release "Web" >/dev/null 2>&1
ls -la ../../public/materials/cefl/town2/
