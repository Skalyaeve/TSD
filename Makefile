start:
	docker compose up -d --build --quiet-pull

stop:
	docker compose stop

down:
	docker compose down

delete:
	docker compose down	-v --rmi all

.PHONY: start stop down delete
