.PHONY:		dev prod test					\
			build-dev build-prod build-test	\
			restart stop start down			\
			clean fclean logs npm

# ------BUILD-ALL+START---------- #
dev:
			docker-compose up -d dev
prod:
			docker-compose up -d prod
test:
			docker-compose up -d test

# ------BUILD-IMAGE-------------- #
build-dev:
			docker-compose build dev
build-prod:
			docker-compose build prod
build-test:
			docker-compose build test

# ------STOP-START--------------- #
restart:
			docker-compose restart
stop:
			docker-compose stop
start:
			docker-compose start

# ------STOP+CLEAN--------------- #
down:
			docker-compose down

# ------CLEAN-------------------- #
clean:
			docker system prune -f
fclean:
			docker system prune -fa

# ------LOGS--------------------- #
logs:
			docker-compose logs -f

# ------DEV-NODOCKER------------- #
npm:
			npm run start