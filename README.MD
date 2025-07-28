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
# run container
docker run "imageID"
# run container specificando porta
docker run -p 3000:80 "imageID"
# run container interattivo
docker run -it "imageID"
# mostra container in run
docker ps
# mostra tutti i container
docker ps -a
# Stop run container
docker stop "nome-container"
docker stop "containerID"

```

# Section 2 Image -> Containers

- Le **immagini** sono i template/blueprint per i container.
  Può essere condivisa.
- I **Container** sono le unità software che girano. Possono essere create quanti container vogliamo da una stessa img.

- **DockerHub** contiene varie img ufficiali pre-built.
