FROM	alpine:latest

RUN		apk update			\
		&& apk add npm		\
		&& apk add yarn		\
		&& mkdir front		\
		&& mkdir front/src	\
		&& mkdir front/dist

COPY	*.json	/front
COPY	*.cjs	/front
COPY	.babel*	/front
COPY	src		/front/src
COPY	dist	/front/dist

WORKDIR	/front
RUN		yarn install