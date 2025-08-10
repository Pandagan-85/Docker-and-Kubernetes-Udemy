# Corso Docker & Kubernetes: The Practical Guide [2025 Edition]

Questa repo contiene gli esercizi del corso UDEMY "[Docker & Kubernetes: The Practical Guide](https://www.udemy.com/course/docker-kubernetes-the-practical-guide/)".

# Section 1

Introduzione Docker, e vantaggi rispetto Virtual Machine.

## Comandi base

```bash
# crea img da Dockerfile
docker build .


# crea img da Dockerfile con name:tag (name gruppo di img specializzate, tag la versione di quell'immagine)
docker build -t nome-app:latest .
# assegnare nome a container
docker run --name nomescelto "imageID"
# Rename image (clona l'immagine) - Utile per push su docker hub, il nuovo nome = nomerepository
docker tag vecchionome:tag nuovonome:tag
# login/logout docker hub
docker login
# Condividere le img su docker hub (post login, nome_img = nomerepository)
docker push IMAGE_NAME
docker pull IMAGE_NAME


# mostra le img
docker images
# mostra container in run
docker ps
# mostra tutti i container
docker ps -a

# cancella img
docker rmi "imageID"
# cancella tutte le img
docker image prune
# cancella tutte le img anche con tag
docker image prune -a
# cancella container
docker rm "containerID"
# cancella tutti i container stopped
docker container prune
# cancella container dopo lo stop automaticamente --rm
docker run -p 3000:80 -d --rm "imageID"


# run nuovo container
docker run "imageID"
# run nuovo container specificando porta
docker run -p 3000:80 "imageID"
# run nuovo container specificando porta in modalità detached
docker run -p 3000:80 -d "imageID"
# modalità attach per il container specificato
docker attach "nome-container"
# Logs passati o per rimanere in ascolto
docker logs "nome-container"
docker logs -f "nome-container"
# run nuovo container interattivo
docker run -it "imageID"
# run container con terminale interattivo
docker run -i -t "imageid"

# Stop run container
docker stop "nome-container"
docker stop "containerID"
# Re Start container
docker start "nome-container"
docker start "containerID"
docker start -a "nome-container"
# restart container con terminale interattivo
docker start -a -i "nomecontainer"

# ispezionare un img
docker image inspect "imageID"

# copiare file da una sorgente a una destinazione (local machine to running container)
docker cp folder_sorgente nome_container:/folder_destinazione



```

# Section 2 Image -> Containers

- Le **immagini** sono i template/blueprint per i container.
  Può essere condivisa.
- I **Container** sono le unità software che girano. Possono essere create quanti container vogliamo da una stessa img.

- **DockerHub** contiene varie img ufficiali pre-built.

**Le img sono READ-ONLY**, se modifichiamo il codice sorgente dobbiamo fare una nuova build dell'img e un nuovo run di un nuovo container.
E sono **Layer Based** ogni istruzione nel docker file crea un Layer. Quando modifichiamo un layer tutti quelli successivi vengono ricostruiti. È importante l'ordine delle istruzioni per ottimizzare il processo di build e poter usare le versioni in cache.

## Detached vs Attached container

In modalità **attached** di default quando usiamo `docker run` il terminale risulta bloccato in quanto è in ascolto per mostrarci gli output.
In modalità **detached** il terminale rimane libero per vedere gli output possiamo usare `logs` `-a` oer passare alla modalità attached.

## Interactive mode

Quando vogliamo rimanere in ascolto e poter **digitare da terminale** degli input usiamo
`docker run -i -t "imageid"` , per far ripartire un container con le stesse modalità `docker start -a -i "nomecontainer"`

## Deleting Images & Containers

## Inspecting Images

## Copyng Files into & from containers

## Naming & Tagging Container & Images

## Sharing Images on dockerhub (renaming images to match repo name on dockerhub)

# Section 3 Mangaging Data & Working Volumes

## Data Categories

1. Application (code + env) **read-only**.
2. **Temporary** app Data (es. user input) **read-write** stored in container temporary (non si perde allo stop/restart, ma se ne creiamo uno nuovo lo perdiamo.). Il container non è collegato in nessun modo al nostro file system.
3. **Permanent** app Data (es user account/DB) **read-write** Conservati nei container con l'uso dei **Volumes**

## Volumes and Bind Mounts

For Persistent Data.

I volumi(anonimi o nominali) sono cartelle sul disco rigido della macchina host che vengono montate ("rese disponibili", mappate) nei contenitori

Quando creiamo un volume, docker creerà sulla nostra macchina una cartella `docker volume ls`. (`docker volume rm nomevolume`)
Quando usiamo un volume anonimo la sua vita è legata a quella del container.
Un volume named invece avrà una vita separata, si dichiarano al run del container aggiungendo `-v nomeVolume:/app/nome_cartella`.
I volumi anonimi o named sono gestiti da docker e noi non vi possiamo accedere.

**Bind Mounts**
Definiamo una cartella sulla nostra macchina host. Sono ottimi per dati persistenti e che devono essere editati anche da noi (si può usare per il codice sorgente ed evitare il rebuilt.)

Modifichi codice → salvi il file → refresh browser → testa → se non va bene → modifichi di nuovo → salvi → testa

Focus > section_3 > [Volumes_and_bind_mounts.md](/section_3_Managing_data_and_working_with_volumes/Volumes_and_bind_mounts.md)

## Read Only Volumes

In questo modo con `:ro` evitiamo che il nostro container possa modificare il codice sorgente, e specifichiamo i path che non devono sottostare al readonly(delle **eccezione che devono rimanere scrivibili**).

```
docker run -d --rm -p 3000:80 --name feedback-app \
-v feedback:/app/feedback \
-v $PWD:/app:ro \
-v /app/temp \
-v /app/node_modules \
feedback-node:volumes
```

**Longest Path Wins (Most specific path wins)**

```
-v $PWD:/app:ro           # Specificità: /app (livello 1)
-v /app/temp              # Specificità: /app/temp (livello 2)
-v /app/node_modules      # Specificità: /app/node_modules (livello 2)
-v feedback:/app/feedback # Specificità: /app/feedback (livello 2)
```

## Managin Docker Volumes

`docker volume ls` \
`docker volume create [nomeVolume]` \
informazioni sul volume \
`docker volume inspect [nomeVolume]`
`docker volume rm [nomeVolume]`

## COPY vs Bind Mounts

Il bind mount lo usiamo in fase dev per essere veloci e vedere subito i risultati.
Il bind mount **sovrascrive** i file copiati con `COPY . .` durante lo sviluppo.

In produzione, rimuoviamo il bind mount e l'immagine usa i file copiati durante il build con `COPY . .`.

**Una sola immagine, due modalità d'uso**:

- **Dev**: `docker run -v $PWD:/app my-app` (bind mount attivo)
- **Prod**: `docker run my-app` (usa COPY del Dockerfile)

## Dockerignore

`.dockerignore` è come il `.gitignore`. Serve per indicare quali file non dobbiamo copiare nelle istruzioni di `COPY . .` nella creazione dell'immagine.

## Env Variables & Security

| Aspetto    | ARG                    | ENV                 |
| ---------- | ---------------------- | ------------------- |
| Quando     | Solo build time        | Build + runtime     |
| Visibilità | Dockerfile only        | Container processes |
| Override   | `--build-arg`          | `-e` al run         |
| Eredità    | No                     | Sì (processi figli) |
| Uso tipico | Versioni, build config | App config, secrets |

**ARG** può essere usato ad esempio per avere configurazioni diverse dalla stesa codebase:

```bash

# Build immagine DEV (porta 3000)
docker build --build-arg DEFAULT_PORT=3000 -t my-app:dev .

# Build immagine PROD (porta 80)
docker build --build-arg DEFAULT_PORT=80 -t my-app:prod .

# Build immagine TEST (porta 8080)
docker build --build-arg DEFAULT_PORT=8080 -t my-app:test .

```

E poi fare

```bash
# Stessa codebase, configurazioni diverse!
docker run -p 3000:3000 my-app:dev   # Dev environment
docker run -p 80:80 my-app:prod      # Production environment
docker run -p 8080:8080 my-app:test  # Test environment
```

# Section 4 Networking (Cross-) container communication

Connecting Containers! (& external networks) (Use case):

1. Comunicare dal container a un serzivio api esterno (es.swapi, api di star wars)
2. Comunicare dal container a un servizio sulla nostra host machine (es database)
3. Comunicare dal container a un altro container (che ad esempio ha un SQL databse)
