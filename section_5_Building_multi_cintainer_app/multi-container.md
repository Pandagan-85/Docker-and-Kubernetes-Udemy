# Multi Container

3 Building Blocks

1. Database (MongoDB)
2. Backend (NodeJS REST API)
3. Frontend (React SPA)

![](3-block.png)

## Dockerizziamo i componenti

1. Usiamo img ufficiale di docker mongo
   `docker run --name mongodb --rm -d -p 27017:27017 mongo`

2. Creiamo il dockerfile per il backend

```
FROM node

WORKDIR /app

COPY package.json   .

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "app.js"]

```

e poi buildiamo img

`docker build -t goals-node .`

e runniamo un container

`docker run --name goals-backend --rm -d -p 80:80 goals-node`

3. Creiamo il Dockerfile per app REACT

```
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

buildiamo img `docker build -t goals-react .` e runniamo il container `docker run --name goals-frontend --rm -d -p 3000:3000 -it goals-react`

## Network comune per i 3 container

`docker network create goals-net`

1. Mongo db > `docker run --name mongodb -d --rm --network goals-net mongo`

2. Backend > nel file app.js dove colleghiamo il db cambiamo domino con `"mongodb://mongodb:27017/course-goals"`, e facciamo di nuovo il build dell'img. Runniamo il container all'interno del network `docker run --name goals-backend --rm -d -p 80:80 --network goals-net goals-node` Anche se è nel network esponiamo la porta 80 per farla parlare con il frontend che gira nel browser.

3. Frontend > nel file App.js **non**cambiamo con il nome dell'img del backend `goals-backend` tutti i punti in cui appare localhost e facciamo build dell'img, in quanto gira sul browser non nel docker container.

`docker build -t goals-react .` e runniamo img `docker run --name goals-frontend --rm -p 3000:3000 -it goals-react`. Non serve network perchè gira nel browser

## Aggiungere volumi per persistenza dei dati e live source code update

### Mongo db

Al momento se stoppiamo mongodb perdiamo tutte le entry.

aggiungiamo un **named volume** al container **mongodb**, in questo modo anche se stoppiamo il container mongodb, al nuovo run caricherà i dati salvati precedentemente.

`docker run --name mongodb -v data:/data/db  -d --rm --network goals-net mongo`

Aggiungiamo delle variabili per il nome utente e psw

`docker run --name mongodb -v data:/data/db  -d --rm --network goals-net -e MONGO_INITDB_ROOT_USERNAME=panda -e MONGO_INITDB_ROOT_PASSWORD=secret mongo`

adesso modifichiamo in app.js per aggiungere name e pse

```mongoose.connect(
  "mongodb://mongodb:27017/course-goals",
  {
```

```mongoose.connect(
  "mongodb://panda:secret@mongodb:27017/course-goals?authSource=admin",
  {
```

### aggiungere 3 volumi al **backend**

`docker run --name goals-backend -v /Users/pandagan/workspace/projects/02_docker_udemy/section_5_Building_multi_cintainer_app/multi-01-starting-setup/backend:/app -v logs:/app/logs -v /app/node_modules -d --rm -d -p 80:80 --network goals-net goals-node`

#### 1 **bind mount**

`-v /Users/pandagan/workspace/projects/02_docker_udemy/section_5_Building_multi_cintainer_app/multi-01-starting-setup/backend:/app`

- Mappa la cartella del codice sorgente dal tuo Mac direttamente nella cartella /app del container
- Utile per sviluppo: le modifiche al codice si riflettono immediatamente nel container

#### 2 **Named Volume**

`-v logs:/app/logs`

- Crea un volume chiamato "logs" gestito da Docker
- I log vengono persistiti anche se il container viene rimosso
- Docker gestisce automaticamente dove memorizzare questi dati

#### 3 **Anonymous Volume**

`-v /app/node_modules`

- Crea un volume anonimo per la cartella `node_modules`
- Questo è un trucco comune in Node.js per evitare che le `node_modules` dell'host (se esistono) sovrascrivano quelle del container
- Garantisce che il container usi le proprie dipendenze installate durante il build

Nel backend aggiungiamo la dipendenza **nodemon**, basata su node, che monitora e aggiorna il server in caso di modifiche del codice.

Nel docker file

```
# CMD ["node", "app.js"]

## restart server when code changes
CMD ["npm", "start"]
```

Inoltre aggiungiamo delle variaibili di ambiente per gestire username e psw di mongodb

```
EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

```

```
docker run --name goals-backend -v /Users/pandagan/workspace/projects/02_docker_udemy/section_5_Building_multi_cintainer_app/multi-01-starting-setup/backend:/app -v logs:/app/logs -v /app/node_modules -e MONGODB_USERNAME=panda -d --rm -d -p 80:80 --network goals-net goals-node
```

`docker logs goals-backend`

### Aggiungere live source update al frontend

Useremo **bind mount** per avere in tempo reale i cambiamenti al codice sorgente del frontend

```
docker run -v /Users/pandagan/workspace/projects/02_docker_udemy/section_5_Building_multi_cintainer_app/multi-01-starting-setup/frontend/src:/app/src --name goals-frontend --rm -p 3000:3000 -it goals-react
```
