#!/usr/bin/env bash
# Idempotent dependency setup for the 3Draw Meteor app.
# The original 2014 Meteor 0.8.0 binaries can no longer be installed, so the
# project was pinned to Meteor 2.16 (see .meteor/release). This installs that
# toolchain and the project's npm dependencies.
set -euo pipefail

# Meteor 2.x runs on its bundled Node 14; allow running the tool as any user.
export METEOR_ALLOW_SUPERUSER=1

METEOR_RELEASE="2.16"

if [ ! -x "$HOME/.meteor/meteor" ]; then
  echo "Installing Meteor ${METEOR_RELEASE}..."
  curl -sSL "https://install.meteor.com/?release=${METEOR_RELEASE}" | sh
fi

# Make sure the meteor launcher is resolvable on PATH. The official installer
# writes /usr/local/bin/meteor (via sudo); fall back to a per-user symlink if
# that location was not created.
if ! command -v meteor >/dev/null 2>&1; then
  if [ -w /usr/local/bin ] || sudo -n true 2>/dev/null; then
    sudo ln -sf "$HOME/.meteor/meteor" /usr/local/bin/meteor
  else
    mkdir -p "$HOME/.local/bin"
    ln -sf "$HOME/.meteor/meteor" "$HOME/.local/bin/meteor"
    export PATH="$HOME/.local/bin:$PATH"
  fi
fi

meteor --version

# Install project npm dependencies (currently only @babel/runtime).
meteor npm install
