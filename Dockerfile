FROM node:18

WORKDIR /app

COPY . .

RUN npm install

RUN npm run db:generate
RUN npm run build

# backend port
EXPOSE 3000 
# prisma studio port
EXPOSE 5555

CMD ["npm", "run", "start:prod"]