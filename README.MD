# Corso Docker & Kubernetes: The Practical Guide [2025 Edition]

Questa repo contiene gli esercizi del corso UDEMY "[Docker & Kubernetes: The Practical Guide](https://www.udemy.com/course/docker-kubernetes-the-practical-guide/)".

# Section 1

Introduzione Docker, e vantaggi rispetto Virtual Machine.

[intro_docker](./section_1_Intro/intro_docker.md)

# Section 2 Image -> Containers

[image_container](./section_2_Images_and_Containers/image_container.md)

# Section 3 Mangaging Data & Working Volumes

Volume and bind mount
Focus > section_3 [Volumes_and_bind_mounts.md](./section_3_Managing_data_and_working_with_volumes/Volumes_and_bind_mounts.md)

# Section 4 Networking (Cross-) container communication

Connecting Containers! (& external networks) (Use case):

1. Comunicare dal container a un serzivio api esterno (es.swapi, api di star wars)
2. Comunicare dal container a un servizio sulla nostra host machine (es database)
3. Comunicare dal container a un altro container (che ad esempio ha un SQL databse)

Focus > section_4_Networking > [networking.md](./section_4_Networking/networking.md)

# Section 5 Building Multi-Container App. with Docker

- Combining multiple services to one app
- Working with multiple containers

3 Building Blocks

1. Database (MongoDB)
2. Backend (NodeJS REST API)
3. Frontend (React SPA)

Focus > section_5_Building_multi_cintainer_app > [multi-container.md](./section_5_Building_multi_cintainer_app/multi-container.md)

# Section 6 Docker Compose

Permette il setup automatizzato di multipli containers.
Es. un container per front-end e uno per back-end

Permette di rimpiazzare i comandi `docker build ...` e `docker run ...` **creando un unico file di configurazione** e comandi di orchestrazione come `build, start, stop`

> - Non sostituisce il dockerfile per le img custom
> - Non sostituisce le img o containers
> - Non è fatto per gestire multipli containers su differenti host

Focus > section_6_Docker_Compose > [docker_compose.md](./section_6_Docker_Compose/docker_compose.md)

# Section 7 Docker Utility Containers

Focus > section_7_utility_containers> [docker_utility_container.md](./section_7_utility_containers/docker_utility_container.md)

# Section 8 - Project (Laravel & PHP Dockerized)

Laravel PHP project with Docker

Focus > section_8_laravel_php_setup> [project.md](./section_8_laravel_php_setup/project.md)

# Section 9 - Deploying Docker Containers

From DEV to PROD! (Focus on WebApp Deployment).
Useremo AWS come hosting provider.

Focus > section_9_deploying_docker_containers> [deploying_docker_containers.md](./section_9_deploying_docker_containers/deploying_docker_containers.md)

# Extra Focus on AWS

[AWS focus](AWS.md)

# Section 10 Docker & Containers Summary

[docker summary](./section_10_docker_containers_summary/docker_summary.md)

# Section 11 Getting started with Kubernetes

è come un framework, una collezione di concetti, uno standard.
Ci aiuta con l'orchestrazione di container, e il deploy su larga scala, in maniera indipendente rispetto al servizio provider cloud che stiamo usando.
Focus > section_11_Kubernetes > [k8s_getting_started.md](./section_11_Kubernetes/k8s_getting_started.md)

# Sectiont 12 Kubernetes in Action - Diving into the Core Concept

- How to setup & testing K8s Env
- Working with K8s Obj
- Examples
  Focus > section_12_Kubernetes_in_action > [k8s_core_concept.md](./section_12_Kubernetes_in_action/k8s_core_concept.md)

# Section 13 Managing Data & Volumes with Kubernetes

- Storing Data (far sopravvivere i dati al riavvio dei pod)
- Volumes (with k8s Persistent Volumes & Persistend Volumes Claims)
- Environment Variables

Focus > section_13_managing_data_volumes_with_kubernetes > [managing_data_and_volumes_in_k8s.md](./section_13_managing_data_volumes_with_kubernetes/managing_data_and_volumes_in_k8s.md)
