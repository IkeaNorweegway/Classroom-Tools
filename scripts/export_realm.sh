#!/bin/sh
# Export the Math 9 Realm game (Godot) to the site. Needs Godot 4.7.2 at ~/.local/bin/godot with its web export templates.
# Runs the Realm tests first; stops if they fail. Output: public/materials/math-9/realm/
set -e
cd "$(dirname "$0")/../godot/story-engine"
GODOT=${GODOT:-$HOME/.local/bin/godot}
"$GODOT" --headless --path . --import >/dev/null 2>&1 || true
"$GODOT" --headless --path . -s res://tests/test_realm.gd
"$GODOT" --headless --path . -s res://tests/test_nav.gd
mkdir -p ../../public/materials/math-9/realm
"$GODOT" --headless --path . --export-release "Web-Realm" >/dev/null 2>&1
ls -la ../../public/materials/math-9/realm/
