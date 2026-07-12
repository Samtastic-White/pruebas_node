dev:
	docker compose --env-file src/.env up --build -d

rebuild:
	docker compose down --remove-orphans
	docker compose up -d --build --force-recreate --remove-orphans

clean:
	docker compose down --remove-orphans
	docker container prune -f

init:
	docker compose --env-file src/.env build
	docker compose --env-file src/.env up -d postgres_seed mongo_seed gotenberg_seed
	@sleep 5
	docker compose --env-file src/.env run --rm --no-deps backend_seed sh -c "cd /app && npx tsx ./node_modules/knex/bin/cli.js migrate:latest --knexfile knexfile.ts"
	docker compose --env-file src/.env up -d backend_seed

migrate:
	docker compose --env-file src/.env run --rm --no-deps backend_seed sh -c "cd /app && npx tsx ./node_modules/knex/bin/cli.js migrate:latest --knexfile knexfile.ts"