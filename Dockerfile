ARG REGISTRY_NODE_IMAGE=node:22-alpine
ARG REGISTRY_NGINX_IMAGE=nginx:1.27-alpine

FROM ${REGISTRY_NODE_IMAGE} AS build

ARG VITE_API_BASE_URL=http://localhost:8000
ARG BUILD_DATE
ARG CURRENT_BRANCH
ARG BUILD_VERSION
ARG REPOSITORY

LABEL org.opencontainers.image.authors="aleksander.bialka@icloud.com"
LABEL org.label-schema.schema-version="1.0" \
    org.label-schema.name="bioscopeai-web" \
    org.label-schema.description="BioScopeAI Web Frontend" \
    org.label-schema.url="https://${REPOSITORY}/bioscopeai-web" \
    org.label-schema.vcs-url="https://${REPOSITORY}/bioscopeai-web" \
    org.label-schema.vcs-ref="${CURRENT_BRANCH}" \
    org.label-schema.build-date="${BUILD_DATE}" \
    org.label-schema.version="${BUILD_VERSION}"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM ${REGISTRY_NGINX_IMAGE} AS runtime

COPY ./docs/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
