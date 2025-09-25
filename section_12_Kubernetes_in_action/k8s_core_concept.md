# K8S

è importante capire cosa farà per noi K8s e cosa no.
![](do_dont.png).
Non è un un cloud provider, ma è un framework.
Dobbiamo creare noi i Cluster e le istanze dei nodi, fare il setup di API server, e i software necessari e risorse (come load balancer, fylesystems etc.)

Ci aiuterà a creare i nostri oggetti (es pods) e li gestirà, farà il monitoring dei pods e li ricrea e scala.
K8s utilizzerà le risorse del provider cloud per applicare le nostre configurazioni.

[Kubermatic](https://www.kubermatic.com/) è un tool che può aiutare.
AWS ha anche il servizio EKS > Elastic K8s Service.

## Setup and installation steps

Ci servirà per prima cosa un **Cluster** che conterrà il nostro **Master Node** e uno o più **Worker Node** e tutti i software richiesti (services).

E il **Kubectl** che è un tool per mandare le istruzioni al cluster (ad es. un nuovo deployment)

![](installation.png).

Per impostare il cluster useremo un tool chiamato **[Minikube](https://minikube.sigs.k8s.io/docs/)** per simulare un'altra macchina, creerà un single node cluster.

> Io salto questo step perchè ho già abilitato tutto dentro DockerDesktop.

### Focus Kubectl

**kubectl** è lo strumento da riga di comando ufficiale per interagire con i cluster Kubernetes.

In termini semplici:
È il "telecomando" di Kubernetes - ti permette di controllare e gestire tutto quello che succede nel tuo cluster da terminale.

Cosa fa kubectl:

- **Crea risorse**: pod, servizi, deployment, ecc.
- **Visualizza lo stato**: cosa sta girando, se è sano, i log
- **Modifica configurazioni**: scaling, aggiornamenti, configurazioni
- **Elimina risorse**: pulizia e manutenzione
- **Debug**: ispeziona problemi, esegue comandi nei container

Esempi pratici:

```bash
kubectl get pods              # mostra i pod in esecuzione
kubectl create deployment     # crea un'applicazione
kubectl logs <pod-name>       # visualizza i log di un pod
kubectl scale deployment      # aumenta/diminuisce le repliche
kubectl delete pod <name>     # elimina un pod

```

**Analogia**:
Se Kubernetes è come un sistema operativo per container, kubectl è come la sua shell/terminale. Proprio come usi `ls`, `cd`, `mkdir` per il filesystem, usi `kubectl get`, `kubectl create`, `kubectl delete` per Kubernetes.

Caratteristiche:

- Funziona con qualsiasi cluster K8s (minikube, Docker Desktop, cloud)
- Usa file YAML per le configurazioni
- Ha centinaia di comandi e opzioni

Lista ampliata dei comandi `kubectl` fondamentali:

**🔍 Comandi di visualizzazione (GET):**

```bash
kubectl get pods                    # mostra i pod in esecuzione
kubectl get deployments            # mostra i deployment
kubectl get services               # mostra i servizi
kubectl get nodes                  # mostra i nodi del cluster
kubectl get all                    # mostra tutte le risorse principali
kubectl get all --all-namespaces  # mostra tutto in tutti i namespace
kubectl get pods -o wide          # output dettagliato
kubectl get pods --watch          # monitora i cambiamenti in tempo reale
```

**📝 Comandi di creazione (CREATE/APPLY):**

```bash
kubectl create deployment <name> --image=<image>  # crea un deployment
kubectl create service clusterip <name>           # crea un servizio
kubectl apply -f <file.yaml>                      # applica configurazione da file
kubectl create namespace <name>                   # crea un namespace
kubectl expose deployment <name> --port=80        # espone un deployment
```

**ℹ️ Comandi di descrizione (DESCRIBE):**

```bash
kubectl describe pod <pod-name>        # dettagli completi di un pod
kubectl describe deployment <name>     # dettagli di un deployment
kubectl describe service <name>        # dettagli di un servizio
kubectl describe node <node-name>      # dettagli di un nodo
```

**📋 Comandi di log e debug:**

```bash
kubectl logs <pod-name>                # visualizza i log di un pod
kubectl logs <pod-name> -f             # segue i log in tempo reale
kubectl logs <pod-name> --previous     # log del container precedente
kubectl exec -it <pod-name> -- /bin/bash  # entra nel pod (shell interattiva)
kubectl exec <pod-name> -- <command>   # esegue un comando nel pod
```

**⚙️ Comandi di modifica:**

```bash
kubectl scale deployment <name> --replicas=3  # scala a 3 repliche
kubectl edit deployment <name>                # modifica configurazione
kubectl patch deployment <name> -p '<json>'   # modifica parziale
kubectl set image deployment/<name> <container>=<new-image>  # aggiorna immagine
```

**🗑️ Comandi di eliminazione:**

```bash
kubectl delete pod <name>              # elimina un pod
kubectl delete deployment <name>       # elimina un deployment
kubectl delete service <name>          # elimina un servizio
kubectl delete -f <file.yaml>         # elimina risorse da file
kubectl delete all --all              # elimina tutto nel namespace corrente
```

**📁 Gestione namespace:**

```bash
kubectl get namespaces                 # mostra i namespace
kubectl config set-context --current --namespace=<name>  # cambia namespace di default
kubectl get pods -n <namespace>        # mostra pod in un namespace specifico
```

**🔧 Comandi di configurazione:**

```bash
kubectl config view                    # mostra la configurazione
kubectl config current-context        # mostra il contesto corrente
kubectl config get-contexts           # mostra tutti i contesti disponibili
kubectl config use-context <name>     # cambia contesto
```

**📊 Comandi di monitoraggio:**

```bash
kubectl top nodes                      # utilizzo CPU/memoria dei nodi
kubectl top pods                       # utilizzo CPU/memoria dei pod
kubectl get events                     # eventi recenti del cluster
kubectl get events --sort-by='.metadata.creationTimestamp'  # eventi ordinati
```

## Understanding K8s Objects (risorse)

K8S lavora con **Objects**, gli Objects sono le "entità" che Kubernetes gestisce - pensa a loro come ai "mattoni" con cui costruisci le tue applicazioni nel cluster.

I principali oggetti sono:

- **Pod**: Il più piccolo unit deployabile (uno o più container)
- **Deployment**: Gestisce un set di pod identici
- _Service_: Espone i pod alla rete (come un load balancer interno)
- _Volume_: Spazio di storage persistente per i dati

Questi oggetti possono essere creati in due modi:

- **Imperatively** (da comandi come `kubectl create deployment nginx --image=nginx`)
- **Declaratively** (Tramite file YAML/JSON)

### POD object

Il più piccolo unit deployabile (uno o più container)

- Contiene e runna uno o più container.

- Contengono risorse condivise (es. volumi) per tutti i pod containers.

- Ha un IP interno al cluster di default (che può essere usato per mandare richieste al container contenuto nel pod).
  - I containers contenuti in un pod possono comunicare tra loro tramite `localhost`

> I pod sono **effimeri**: Kubernetes li inizializza, ferma e sostituisce quando necessario.

Per poter essere gestiti da noi, abbiamo bisono di un **Controller** (es. Deployment)

### Deployment object

Solitamente non creiamo manualmente un pod, ma creiamo un oggetto Deployment.

- Può controllare uno o più pod.
  - Impostiamo uno stato desiderato, e K8S si occuperà di cambiare lo stato attuale.
    Definiamo cosa vogliamo e K8S si occuperà di farlo (es numero di istanze e quali container runnare)
  - Il Deploy può essere messo in pausa, cancellato o far un rollback
  - Il Deploy può essere scalato dinamicamente e automaticamente (esempio impostando una certa metrica, che se viene superata fa innescare l'aumento dei pod e viceversa.)

### Comandi base

# Schema Comandi kubectl - Guida Rapida

## 🔍 **VISUALIZZARE** (GET)

```bash
kubectl get pods                    # mostra pod
kubectl get deployments           # mostra deployment
kubectl get services              # mostra servizi
kubectl get nodes                 # mostra nodi
kubectl get all                   # mostra tutto nel namespace corrente
kubectl get all --all-namespaces # mostra tutto ovunque
kubectl get pods -o wide         # output dettagliato
kubectl get pods --watch         # monitora in tempo reale
```

## 📝 **CREARE** (CREATE/APPLY)

```bash
kubectl create deployment <name> --image=<image>    # crea deployment
kubectl create namespace <name>                     # crea namespace
kubectl apply -f <file.yaml>                       # applica da file YAML
kubectl expose deployment <name> --port=80         # espone servizio
kubectl create service clusterip <name>            # crea servizio
```

## ℹ️ **DETTAGLI** (DESCRIBE)

```bash
kubectl describe pod <name>        # dettagli completi pod
kubectl describe deployment <name> # dettagli deployment
kubectl describe service <name>    # dettagli servizio
kubectl describe node <name>       # dettagli nodo
```

## 📋 **LOG & DEBUG**

```bash
kubectl logs <pod-name>                    # visualizza log
kubectl logs <pod-name> -f                 # segui log in tempo reale
kubectl exec -it <pod-name> -- /bin/bash   # entra nel pod (shell)
kubectl exec <pod-name> -- <command>       # esegui comando nel pod
```

## ⚙️ **MODIFICARE**

```bash
kubectl scale deployment <name> --replicas=3      # scala repliche
kubectl edit deployment <name>                    # modifica configurazione
kubectl set image deployment/<name> container=<new-image>  # aggiorna immagine
kubectl patch deployment <name> -p '<json>'       # modifica parziale
```

## 🗑️ **ELIMINARE** (DELETE)

```bash
kubectl delete pod <name>           # elimina pod
kubectl delete deployment <name>    # elimina deployment
kubectl delete service <name>       # elimina servizio
kubectl delete -f <file.yaml>      # elimina da file
kubectl delete all --all           # elimina tutto nel namespace
```

## 📁 **NAMESPACE**

```bash
kubectl get namespaces                     # mostra namespace
kubectl create namespace <name>            # crea namespace
kubectl config set-context --current --namespace=<name>  # cambia namespace
kubectl get pods -n <namespace>            # opera in namespace specifico
```

## 🔧 **CONFIGURAZIONE CLUSTER**

```bash
kubectl config view                        # mostra configurazione
kubectl config current-context            # contesto attuale
kubectl config get-contexts               # tutti i contesti
kubectl config use-context <name>         # cambia contesto/cluster
kubectl cluster-info                       # info cluster
```

## 📊 **MONITORAGGIO**

```bash
kubectl top nodes                          # uso CPU/memoria nodi
kubectl top pods                           # uso CPU/memoria pod
kubectl get events                         # eventi recenti
kubectl get events --sort-by='.metadata.creationTimestamp'  # eventi ordinati
```

---

## 🚀 **WORKFLOW TIPICO**

### Per iniziare un nuovo progetto:

```bash
1. kubectl create namespace mio-progetto
2. kubectl config set-context --current --namespace=mio-progetto
3. kubectl create deployment app --image=nginx
4. kubectl get all
```

### Per debug:

```bash
1. kubectl get pods
2. kubectl describe pod <name>
3. kubectl logs <name>
4. kubectl exec -it <name> -- /bin/bash
```

### Per cleanup:

```bash
kubectl delete all --all -n <namespace>
kubectl delete namespace <namespace>
```

---

**💡 Pro Tips:**

- Usa `--dry-run=client -o yaml` per vedere il YAML senza applicarlo
- Usa `-o wide` per output dettagliato
- Usa `--watch` per monitorare cambiamenti
- Usa `-n <namespace>` per operare su namespace specifici

## First demo imperative approach

```bash
kubectl create namespace corso-kubernetes`
# Lavori in namespace specifici:
kubectl config set-context --current --namespace=corso-kubernetes
kubectl get pods  # vedi solo i pod di questo progetto
```

`docker build -t pandagandocker/kub-first-app .`

`docker push pandagandocker/kub-first-app`

```bash
kubectl create deployment first-app --image=pandagandocker/kub-first-app
```

---

❯ kubectl get deployments
NAME READY UP-TO-DATE AVAILABLE AGE
first-app 1/1 1 1 14s

❯ kubectl get pods
NAME READY STATUS RESTARTS AGE
first-app-7bb547bb98-fm95q 1/1 Running 0 53s

---

Cosa è successo con questo comando?

`kubectl create deployment first-app --image=pandagandocker/kub-first-app`

[](behind_scene.png)

Quando lo eseguiamo il **Master Node (Control Plane)** riceve la richiesta:

- **kubectl** invia il comando al **kube-apiserver**
- L'API server valida e salva la configurazione in **etcd** (il database)

**Scheduler entra in azione:**

- Analizza i **Worker Node** disponibili
- Guarda le risorse (CPU, RAM, storage)
- **Decide il nodo migliore** per il tuo Pod
- Nel mio caso Docker Desktop: solo 1 nodo, quindi scelta facile!

**Worker Node riceve l'ordine:**

- Il **kubelet** (agente sul worker) riceve istruzioni
- **Tira l'immagine** `pandagandocker/kub-first-app` da Docker Hub
- **Crea il Container** dentro un **Pod**

**Deployment Controller si attiva:**

- Monitora che il Pod sia "healthy"
- Se il Pod muore, ne crea uno nuovo
- Gestisce scaling, rolling updates, etc.

**Nel mio ambiente Docker Desktop:**

```bash
# Il tuo nodo unico:
kubectl get nodes
# docker-desktop (Master + Worker insieme)

# Il deployment creato:
kubectl get deployments
# first-app

# Il pod risultante:
kubectl get pods
# first-app-xxxxxxxxx-xxxxx
```

**In sintesi:** do un comando, Kubernetes orchestra tutto automaticamente per mantenere l'app sempre running! 🎯

## Service Object

Per raggiungere un Pod e un container all'interno di un pod abbiamo bisogno di un **Service**.

Un servizio è responsabile per:

Esporre i pods al cluster o esternamente:

- Ogni pods ha un suo ip interno al cluster possiamo vederlo con
  `kubectl describe pod <nome-pod>` \
  `kubectl describe pod first-app-7bb547bb98-fm95q` \
   Name: first-app-7bb547bb98-fm95q \
   Namespace: corso-kubernetes \
   Priority: 0\
   Service Account: default\
   Node: docker-desktop/192.168.65.3\
   Start Time: Thu, 25 Sep 2025 \
   pod-template-hash=7bb547bb98\
   Annotations: <none>\
   Status: Running\
   IP: 10.1.0.62

  ***

      **Problema** come su AWS ogni volta **questo IP cambia** quando il pod viene sostituito (ad esempio se abbiamo lo scaling attivo)

- Service Group Pods con un IP condiviso
- I Servizi permetto accesso esterno ai PODS

> Senza **Servizi** i pods sono difficilmente raggiungibili, e anche comunicare con essi è difficile. E raggiungere un pod dall'esterno del Cluster non è possibile senza usare un servizio

## Exposing a Deployment with a Service

`kubectl expose deployment first-app --type=LoadBalancer --port=8080`
Tipi di porta che possiamo dare al parametro type
`--type=ClusterIP`
`--type=NodePort`
`--type=LoadBalancer`

Il run del comando precedente ci da `service/first-app exposed`
Per vedere l'ip che viene esposto grazie al Load Balancer
`kubectl get services`
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
first-app LoadBalancer 10.103.28.141 localhost 8080:31480/TCP 37s
