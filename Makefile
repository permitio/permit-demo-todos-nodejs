run:
	docker compose --env-file .env up --force-recreate


run-with-permit:
	docker compose --env-file .env -f docker-compose-with-permit.yml up --force-recreate