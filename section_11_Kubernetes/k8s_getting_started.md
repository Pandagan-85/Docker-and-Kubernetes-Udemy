# Getting started with Kubernetes

è come un framework, una collezione di concetti, uno standard.
Ci aiuta con l'orchestrazione di container, e il deploy su larga scala, in maniera indipendente rispetto al servizio provider cloud che stiamo usando.

> é un sistema open source per il deploy automatizzato, lo scaling, e la gestione di applicazioni containerizzate.

Quando pensiamo al **deploy manuale** dei container, dovremmo manualmente creare le istanza sui server cloud (es istanza EC2) e pensare noi a :

- Sicurezza
- Gestione del crash dei containers, e loro sostituzione
- Monitoring manuale
- Gestione di Traffik spikes o workload che ci portano o dover gestire scale up/down manuali dei container
- Distribuire il traffico in arrivo in maniera uniforme sui vari container in quanto non dobbiamo sovraccaricare un container lasciandone altri scarichi.

Servizi come **AWS ECS** possono aiutare in alcuni passaggi. Può occuparsi del crash e sostituizione, autoscaling e del traffico bilanciato sui vari server. **Il problema è che usare un cloud server ci blocca nel configurare tutto con esse**. Questo significa che se vogliamo cambiare cloud provider i file di configurazione non andranno più bene, perchè troppo specifici per il vecchio, ad esempio se erano scritti per AWS ECS non andranno bene per AZURE, ma li dovremmo tradurre per fare lo switch.

**Kubernetes rende tutto indipendente dal cloud server che stiamo usando**.

Con il file di configurazione diamo le indicazioni e possiamo "passarlo" con alcuni strumenti o setup provider specifici a qualsiasi cloud provider o macchina remota.
**È come DockerCOmpose ma per più macchine**

## Architettura e Core concepts

Un container nel mondo k8s viene gestito da un **pod**, un pod è l'unità più piccola possibile. Un pod può contenere uno o più container.

Il pod che contiene il container a sua volta è contenuto in un **Worker node** che è ciò che runna il container (possiamo pensarlo come il nostro pc o una macchina virtuale).

Il worker node, può contenere uno o più POD e contiene anche un **PROXY** che è un tool per controllare il traffico network dei pods sul worker node.
Solitamente avremmo più Worker Node per applicazioni grandi, e probabilmente di un o più server per avere la giusta potenza computazionale.

**K8s può in automatico fare scale up/ down dei pod**.

A controllare i Worker node abbiamo il **Master Node/Control Plane**.

Nei progetti piccoli il worker node e master node possono coincidere.

Il control plane è un'insieme di vari componenti che che aiutano nella gestione dei worker node. Tutto questo forma un **Cluster**, che può mandare le istruzioni al Cloud provider per far replicare la struttura.

![structure](/section_11_Kubernetes/01_kubernetes_structure.png)

## Worker node

![worker_node](/section_11_Kubernetes/02_kubernetes_worker_node.png)

Il **Worker Node** è una delle nostre **macchine/istanze virtuali**, è gestita dal Master Node.

Al suo interno abbiamo i **POD**, che hosta una o più applicazioni conteinerizzate, e tutte le risorse che appartengono a questi container (file di configurazione, volumi). I pod sono gestiti dal master node, che può decidere di eliminarli o costruirne di nuovi.

Quando un'applicazione richiede più container che devono poter lavorare insieme vicini, **possiamo avere più container in un pod**. Nella **maggior parte dei casi**, un pod contiene UN SOLO container. Più container nello stesso pod si usano solo per pattern specifici (es: sidecar, helper containers).
Un Worker node può contenere più pod, che possono essere la copia dell'altro o pod completametne diversi.

Olter ai Pod i worker node contengono del software addizionale come **Kubelet(communication device tra Worker e master node), Docker, Kube-proxy(che deve gestire le richieste di traffico in entrata**).

## Master node

![master_mode](/section_11_Kubernetes/03_kubernetes_worker_node.png)

Il componente più importante è **API SERVER**, la controparte di **Kubelet** sui workernode.
**SCHEDULER** decide su quale worker node far girare nuovi pod.
**KUBE-CONTROLLER-MANAGER** monitora lo stato desiderato vs stato attuale del cluster e mantiene il numero corretto di repliche dei pod.
**CLOUD-CONTROLLER-MANAGER** fa lo stesso ma per uno specifico cloud provider (es AWS, AZURE, traduce le istruzioni.)

## Key terms

- Cluster: Un set di macchine nodo che runnano l'app containerizzata(worker node) o controlla altri nodi (MASTER)
- Nodes(worker|master): Macchina fisica o virtuale che hosta una o più pode comunicano con il cluster.
- POD: Running APP (container + risorse)
- Containers: Docker container
- Services: Un'astrazione che espone un set di pods tramite un endpoint di rete stabile (IP e porta fissi), anche quando i pods vengono creati/distrutti dinamicamente.
