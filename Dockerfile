FROM nginxinc/nginx-unprivileged:1.25-bookworm
ENV NGINX_USER_ID=101
ENV NGINX_GROUP_ID=101
ENV NGINX_USER=nginx
RUN rm etc/nginx/conf.d/default.conf
COPY --chown=$NGINX_USER:$NGINX_USER nginx.conf etc/nginx/conf.d/

COPY --chown=$NGINX_USER:$NGINX_USER build /usr/share/nginx/html
USER root
RUN rm /usr/share/nginx/html/configuration.json
RUN rm /usr/share/nginx/html/keycloak.json
USER $NGINX_USER
RUN touch /usr/share/nginx/html/configuration.json
RUN touch /usr/share/nginx/html/keycloak.json

COPY --chown=$NGINX_USER:$NGINX_USER  entrypoint.sh /entrypoint.sh

RUN chmod 755 /entrypoint.sh

EXPOSE 8080

USER $NGINX_USER_ID
ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]

