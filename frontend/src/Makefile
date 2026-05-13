dev:
	docker compose --env-file src/.env up --build -d
rangel:
	docker compose down && docker container prune -f && docker compose up -d --build --force-recreate

rebuild:
	docker compose down --remove-orphans
	docker compose up -d --build --force-recreate --remove-orphans

clean:
	docker compose down --remove-orphans
	docker container prune -f

migrate:
	docker exec -it marathon_backend sh -c "cd /app && npx knex migrate:latest --knexfile knexfile.ts"