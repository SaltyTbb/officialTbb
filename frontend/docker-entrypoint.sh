#!/bin/sh

# Generate env-config.js with environment variables for the frontend
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js

# Add environment variables that start with REACT_APP_
for envvar in $(printenv | grep 'REACT_APP_'); do
  key=$(echo $envvar | cut -d= -f1)
  value=$(echo $envvar | cut -d= -f2-)
  echo "  $key: \"$value\"," >> /usr/share/nginx/html/env-config.js
done

echo "};" >> /usr/share/nginx/html/env-config.js

exec "$@" 