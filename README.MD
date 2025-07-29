# Corso Docker & Kubernetes: The Practical Guide [2025 Edition]

Questa repo contiene gli esercizi del corso UDEMY "[Docker & Kubernetes: The Practical Guide](https://www.udemy.com/course/docker-kubernetes-the-practical-guide/)".

# Section 1

Introduzione Docker, e vantaggi rispetto Virtual Machine.

## Comandi base

```bash
# crea img da Dockerfile
docker build .
# crea img da Dockerfile con nome:tag
docker build -t nome-app:latest .
# mostra le img
docker images
# cancella img
docker rmi "imageID"
#cancella container
docker rm "containerID"
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
# mostra container in run
docker ps
# mostra tutti i container
docker ps -a
# Stop run container
docker stop "nome-container"
docker stop "containerID"
# Re Start container
docker start "nome-container"
docker start "containerID"
docker start -a "nome-container"
# run container con terminale interattivo
docker run -i -t "imageid"
# restart container con terminale interattivo
docker start -a -i "nomecontainer

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
