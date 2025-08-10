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
