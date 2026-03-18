# Backend — AI Agent Instructions

Django 5 backend for LoMo. See the root [AGENTS.md](../../AGENTS.md) for repo-wide info.

## Stack

- Django 5.0.4 + Django REST Framework 3.16.1
- PostgreSQL 17 via Docker (port 5432, user: `postgres`, password: `postgres`, db: `lomo`)
- Auth: `django-oauth-toolkit` installed and configured
- Python 3.11 (per Dockerfile)
- Dependencies: `requirements.txt` (no poetry/pipenv)
- No Python linter or formatter configured yet

## Project Structure

- Django project module: `backend/` (settings, urls, wsgi, asgi)
- New Django apps should be created alongside the `backend/` module
- Entrypoint: `entrypoint.sh` runs migrations and creates superuser on startup

## Commands

The backend runs in Docker only. These commands are run from the repo root:

| Command | Description |
|---------|-------------|
| `bun run dev` | Start everything (Postgres, Django, Vite) |
| `bun run dev:stop` | Stop Docker services |
| `bun run dev:reset` | Stop Docker and wipe DB volumes |
| `bun run dev:logs` | Tail Docker service logs |

## Testing

No tests yet. Django's built-in test framework (`python manage.py test`) will be used when added.

## Do NOT

- Do NOT run Django directly on the host — always use Docker
- Do NOT install Python dependencies on the host — add to `requirements.txt` and rebuild the container
- Do NOT commit `.env` files
