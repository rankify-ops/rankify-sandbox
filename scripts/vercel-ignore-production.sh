#!/usr/bin/env bash
# Vercel "Ignored Build Step": exit 0 = skip this build, exit 1 = build it.
# This site is preview-only, so any production build is skipped. That covers the
# repo's default branch too, which Vercel treats as production on import.
if [ "$VERCEL_ENV" = "production" ]; then
  echo "Production deployments are disabled for this project (preview only). Skipping build."
  exit 0
fi
echo "Preview deployment ($VERCEL_GIT_COMMIT_REF). Building."
exit 1
