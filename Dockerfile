### BUILD STEP ###

FROM node:latest AS builder

ARG VITE_PEARL_API_URL
ARG VITE_PEARL_AUTHENTICATION_MODE
ARG VITE_KEYCLOAK_CLIENTID
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_ROLES_ALLOW_LIST

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_PEARL_AUTHENTICATION_MODE=$VITE_PEARL_AUTHENTICATION_MODE
ENV VITE_KEYCLOAK_CLIENTID=$VITE_KEYCLOAK_CLIENTID
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_ROLES_ALLOW_LIST=$VITE_KEYCLOAK_ROLES_ALLOW_LIST

WORKDIR /pearl

COPY ./ ./

RUN yarn && yarn build

### EXECUTION STEP ###

FROM nginxinc/nginx-unprivileged:mainline-alpine

# Non root user
ENV NGINX_USER_ID=101
ENV NGINX_GROUP_ID=101
ENV NGINX_USER=nginx
ENV NGINX_GROUP=nginx

USER $NGINX_USER_ID

# Add build to nginx root webapp
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /pearl/build /usr/share/nginx/html

# Copy nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=$NGINX_USER:$NGINX_GROUP /pearl/nginx.conf /etc/nginx/conf.d/nginx.conf

# Add entrypoint and start nginx server
CMD ["nginx", "-g", "daemon off;"]
