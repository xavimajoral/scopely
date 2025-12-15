#!/bin/bash

# Script to install Git hooks
# This copies the pre-push hook to .git/hooks/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"
PRE_PUSH_HOOK="$HOOKS_DIR/pre-push"

echo "Installing Git hooks..."

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Copy pre-push hook
if [ -f "$PRE_PUSH_HOOK" ]; then
    echo "✅ Pre-push hook already installed"
else
    # The hook is already in .git/hooks/, just need to make it executable
    if [ -f "$PRE_PUSH_HOOK" ]; then
        chmod +x "$PRE_PUSH_HOOK"
        echo "✅ Pre-push hook installed and made executable"
    else
        echo "⚠️  Pre-push hook not found. Please ensure it exists in .git/hooks/"
    fi
fi

echo ""
echo "Git hooks installation complete!"
echo ""
echo "The pre-push hook will now run integration checks before each push."
echo "To skip the hook (not recommended), use: git push --no-verify"

