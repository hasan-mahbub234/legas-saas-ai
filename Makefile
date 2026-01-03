# Makefile
.PHONY: help build up down logs clean migrate test

help:
	@echo "Available commands:"
	@echo "  make build    - Build all Docker containers"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - Show logs for all services"
	@echo "  make clean    - Remove all containers and volumes"
	@echo "  make migrate  - Run database migrations"
	@echo "  make test     - Run backend tests"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

migrate:
	docker-compose exec backend alembic upgrade head

test:
	docker-compose exec backend pytest

frontend-dev:
	cd frontend && npm run dev

backend-dev:
	cd . && python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000