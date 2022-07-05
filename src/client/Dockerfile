# Main dockerfile - a clean from source build
# BUILD (from repo root): docker build -f ./devops/docker/Dockerfile -t acallaweb .
# RUN: docker run --name acallaweb -d -p 80:8080 acallaweb

FROM node:16.13.0-alpine as BuildStage

# Layer dependencies installing (for caching)
COPY package.json /var/src/package.json
COPY yarn.lock /var/src/yarn.lock
WORKDIR /var/src
# Install dependencies
RUN yarn install

# Copy sources
COPY . /var/src

# Build App
RUN yarn build


FROM nginx as ConfigStage   
# Copy build results to serving folder
COPY --from=BuildStage /var/src/build /var/www/webapp
# Make sure NGNIX can access the files
RUN chown -R nginx:nginx /var/www/webapp
# Copy Ngnix configuration
COPY ./devops/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 3001


WORKDIR /var/www/webapp/static
# Make runtime environments available on react app
COPY ./get_runtime_env_vars.sh .
COPY .env .
# Make our shell script executable
RUN chmod +x get_runtime_env_vars.sh

# Add bash
CMD ["/bin/bash", "-c", "./get_runtime_env_vars.sh && nginx -g \"daemon off;\""]
