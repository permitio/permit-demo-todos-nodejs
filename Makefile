install:
	cd src/client && yarn
	cd src/api && yarn
	cd src/api-with-permit && yarn

run:
	docker compose --env-file .env up --force-recreate


run-with-permit:
	docker compose --env-file .env -f docker-compose-with-permit.yml up --force-recreate
