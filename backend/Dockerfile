FROM node:bullseye-slim

COPY ./files /transcendence

WORKDIR /transcendence

RUN npm install && npx prisma generate

EXPOSE 3000

ENTRYPOINT [ "npm" ]

CMD [ "run", "backend" ]
