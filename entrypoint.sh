#!/bin/sh

cat <<EOF > /usr/share/nginx/html/configuration.json
{
  "QUEEN_URL": "${QUEEN_URL}",
  "PEARL_API_URL": "${PEARL_API_URL}",
  "PEARL_AUTHENTICATION_MODE": "${PEARL_AUTHENTICATION_MODE}"
}
EOF

cat <<EOF > /usr/share/nginx/html/keycloak.json
{
  "auth-server-url": "${KEYCLOAK_AUTH_SERVER_URL}",
  "realm": "${KEYCLOAK_REALM}",
  "resource": "${KEYCLOAK_RESOURCE}",
  "ssl-required": "external",
  "public-client": true,
  "confidential-port": 0
}
EOF
exec "$@"