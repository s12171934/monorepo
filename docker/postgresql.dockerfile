FROM postgres:16-alpine

LABEL org.opencontainers.image.title="monorepo-postgresql" \
  org.opencontainers.image.description="Shared PostgreSQL image for all local servers in the monorepo"

ARG TZ=Asia/Seoul

ENV TZ=${TZ} \
  POSTGRES_INITDB_ARGS="--encoding=UTF-8 --locale=C.UTF-8"

RUN apk add --no-cache tzdata bash \
  && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
  && echo "${TZ}" > /etc/timezone

RUN mkdir -p /docker-entrypoint-initdb.d /backups

EXPOSE 5432

CMD ["postgres"]
