FROM nginxinc/nginx-unprivileged:1.25-bookworm
ENV NGINX_USER_ID=101
ENV NGINX_GROUP_ID=101
ENV NGINX_USER=nginx
# RUN rm etc/nginx/conf.d/default.conf
# COPY --chown=$NGINX_USER:$NGINX_USER nginx.conf etc/nginx/conf.d/

COPY --chown=$NGINX_USER:$NGINX_USER build /usr/share/nginx/html
COPY --chown=$NGINX_USER:$NGINX_USER  entrypoint.sh /docker-entrypoint.d/90-configuration-appli.sh

# USER $NGINX_USER_ID

RUN echo '' > /usr/share/nginx/html/configuration.json && \
  echo '' > /usr/share/nginx/html/keycloak.json

