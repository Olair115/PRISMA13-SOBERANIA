FROM node:24-alpine

WORKDIR /app
ENV PORT=8080

COPY public ./public

EXPOSE 8080
CMD ["node", "public/dev-server.js"]
