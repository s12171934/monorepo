#!/usr/bin/env bash

set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
  echo "bun is required to run turbo commands." >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: ./scripts/turbo.sh <task> [scope] [extra turbo args...]" >&2
  echo "Example: ./scripts/turbo.sh dev gateway --continue" >&2
  exit 1
fi

task="$1"
scope=""

if [[ $# -ge 2 && "${2}" != -* ]]; then
  scope="$2"
  shift 2
else
  shift 1
fi

declare -a cmd
cmd=(bunx turbo run "$task")

if [[ -n "$scope" ]]; then
  case "$scope" in
    auth|auth-service)
      cmd+=("--filter=auth-service")
      ;;
    gateway)
      cmd+=("--filter=gateway")
      ;;
    home)
      cmd+=("--filter=home")
      ;;
    shell)
      cmd+=("--filter=shell")
      ;;
    *)
      cmd+=("--filter=$scope")
      ;;
  esac
fi

if [[ $# -gt 0 ]]; then
  cmd+=("$@")
fi

exec "${cmd[@]}"
