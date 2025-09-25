# Intro docker

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
