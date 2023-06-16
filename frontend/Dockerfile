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
COPY	srcs	/front/srcs
COPY	dist	/front/dist

WORKDIR	/front
RUN		yarn install