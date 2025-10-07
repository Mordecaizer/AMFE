FROM node:18

WORKDIR /frontend

COPY package*.json ./

RUN npm install && npm install react-scripts --legacy-peer-deps

COPY . .

# Fix para el error de OpenSSL con Node.js 18+
ENV NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 3000

CMD ["npm", "start"]