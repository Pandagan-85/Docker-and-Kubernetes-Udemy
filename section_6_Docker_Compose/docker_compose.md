# Docker Compose

Per gestire i 3 container del modulo precedente dovevamo scrivere dei comandi molto lunghi.

**DOCKER COMPOSE** ci permette di rimpiazzare i vari comandi di `docker build ...` e `docker run ...` con un file di configurazione che contiene i comandi di orchestrazione.

Si crea un file YAML **compose.yaml**

[Documentazione docker compose](https://docs.docker.com/compose/gettingstarted/)

Non serve specificare un network, in quando i 3 container faranno parte già dello stesso ambiente.

```
docker compose version

# Cerca automaticamente nell'ordine di priorità
docker compose up -d

# Ferma e rimuove container + network (NON i volumi)
docker compose down

# Ferma, rimuove container + network + volumi
docker compose down -v

# Ferma i servizi ma NON rimuove i container
docker compose stop

# Riavvia i servizi
docker compose restart

# Vedi i log
docker compose logs

# Vedi solo i servizi attivi
docker compose ps

# Rebuild delle immagini se necessario
docker compose up --build

# build image without starting it
docker compose build

# Rimuovi tutto incluse le immagini
docker compose down --rmi all

```
