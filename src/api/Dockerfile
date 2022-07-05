# --------------> The build image
FROM node:latest AS build
WORKDIR /app
COPY package.json .
COPY yarn.lock .
# Install dependencies
RUN npm install

# build app
COPY tsconfig.json /app/
COPY .eslintignore /app/
COPY .eslintrc /app/
COPY src/ /app/src/
RUN npm run build

# --------------> The final image
FROM node:12-alpine3.11
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app /app

# set default env vars
ENV PORT=8008

# set node to production mode
ENV NODE_ENV=production

# expose port
EXPOSE 8008

# run node
CMD ["npm", "run", "serve"]