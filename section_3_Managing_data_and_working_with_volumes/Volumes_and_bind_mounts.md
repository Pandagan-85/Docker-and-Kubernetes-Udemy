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

# Volumes and bind mounts

Es di uso dei 3 tipi:

```
docker run -d --rm -p 3000:80 --name feedback-app \
-v feedback:/app/feedback \
-v $PWD:/app \
-v /app/node_modules \
feedback-node:volumes

```

## 1. `-v feedback:/app/feedback` (Named Volume)

Scopo:

- Persistenza dei dati
- Mantiene i file di feedback anche dopo che il container viene eliminato
- I dati sopravvivono ai riavvii del container

## 2. `-v $PWD:/app` (Bind Mount)

Scopo:

- Sviluppo in tempo reale
- Mappa la cartella corrente del tuo host dentro /app nel container
- Permette di modificare il codice sorgente e vedere le modifiche immediatamente

## 3. `-v /app/node_modules` (Anonymous Volume)

Scopo:

- Protezione delle dipendenze
- Questo è il trucco chiave! Previene che le `node_modules` dell'host sovrascrivano quelle del container

Senza `-v /app/node_modules`, succede questo:

- Il bind mount `-v $PWD:/app` mappa tutto il contenuto della tua cartella locale in `/app`
- Se nella tua cartella locale non ci sono node_modules (o sono diverse), sovrascrive quelle del container
- L'app si rompe perché le dipendenze non sono più disponibili

Il volume anonimo `/app/node_modules` ha priorità più alta del bind mount per quella specifica cartella, proteggendo le dipendenze installate durante il build dell'immagine.

---

![volume_comparison](/section_3_Managing_data_and_working_with_volumes/volumes_comparison.png)
