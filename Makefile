dev:
	docker compose --env-file src/.env up --build -d
rangel:
	docker compose down && docker container prune -f && docker compose up -d --build --force-recreate
