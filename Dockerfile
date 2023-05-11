# Pobieranie obrazu z Node.js
FROM node:18

ENV POSTGRES_URL=postgresql://postgres_user:postgres_password@postgres-db:5432/sumatywny?schema=public
ENV MONGODB_URL=mongodb://mongo-db:27017/sumatywny

# Tworzenie katalogu roboczego i ustawienie go jako katalogu roboczego w kontenerze
WORKDIR /app

# Kopiowanie plików projektu do kontenera
COPY package*.json ./
COPY . .

# Instalacja zależności z pliku package.json
RUN npm install

# Wygenerowanie klientow baz danych 
RUN npm run db:push

# Otwieranie portu aplikacji
EXPOSE 3000

# Uruchamianie aplikacji w trybie developerskim
CMD ["npm", "run", "start:dev"]