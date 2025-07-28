# Custom image basata su built-in node image
FROM node

# Tutti i comandi successivi verranno eseguiti in questa cartella
# Imposta la cartella di lavoro
WORKDIR /app

# Copiamo i file nella workdir
# equivale a `COPY . /app`
COPY . ./ 

RUN npm install

# Esponiamo la porta 80 (è per documentazione, dobbiamo specificare nel run del container la porta - ES: docker run -p 3000:80 nome-immagine)
EXPOSE 80

# CMD è l'istruzione che viene eseguita quando il container viene avviato, `RUN node server.js` avrebbe eseguito il comando durante la build dell'immagine
CMD ["node", "server.js"]

