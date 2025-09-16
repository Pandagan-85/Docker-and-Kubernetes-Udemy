# Deploying Docker Containers

Grazie ai container sia in sviluppo che produzione abbiamo:

- Isolated, standalone environment
- Reproducibles environment, easy to share and use.

> What works on your machine (in a container) will also work after deployment su una remote machine

- Durante lo sviluppo abbiamo usato molto i **Bind Mounts** che non useremo in deploy.
- Le app probabilmente in deploy avranno bisogno di **build step**.
- **Progetti multi container** potrebbero dover essere suddivisi su diverse host machine.
- Trade-offs tra **controllo** e **responsabilità**.

![](./whatwearedoing.png)

Ci sono vari **Hosting provider**, esempio AWS, AZURE, GOOGLE CLOUD.
Per questo mini progetto useremo **AWS**.

Useremo **AWS EC2** che ci permette di far girare e gestire le nostre macchine remote.

Nel primo esempio faremo semplicemente:

- Creare e lanciare una istanza EC2, VPC e security group
- Configure security group per esporre tutte le porte richieste verso www
- Connetterci all'istanza tramite SSH, installare docker e far girare il container.

![](./dev_vs_prod.png)

Su AWS console > EC2 > Avvia nuova istanza. Al momento useremo tutte le impostazioni di default e dobbiamo creare una **coppia di chiavi**, che ci serviranno per collegarci dopo alla nostra istanza via **SSH**

Dopo avere avviato l'istanza tramite ssh (secure shell protocol) ci collegheremo all'istanza tramite terminale.

Dall'istanza > Connetti > Client SSH.
Usiamo `chmod 400 "nome chiave"` per dare write permission.
E poi ci colleghiammo con il comando ripotarto nel pannello.
Il terminale adesso agirà non più sulla mia macchina locale, ma su quella remota. CHe figata!

Installiamo Docker :
Aggiorniamo il sistema
`sudo yum update -y`

- `yum` = package manager di Amazon Linux/Red Hat
- `update -y` = aggiorna tutti i pacchetti (il -y dice "sì" a tutto automaticamente)

`sudo yum -y install docker`

Avviamo docker: `sudo service docker start`
Aggiungiamo l'utente al gruppo docker `sudo usermod -a -G docker ec2-user`

dove:

- `usermod` = modifica utente
- `-a -G docker` = aggiunge (-a) l'utente al gruppo (-G) docker
- `ec2-user` = l'utente di default su Amazon Linux

> Per portare l'img sul server remoto abbiamo due opzioni

![](./img_su_remoto.png)

Creiamo un repository su docker hub, e facciamo build img e assegnamo lo stesso nome della repo.

e facciamo il push su docker hub.

> Essendo su mac con processore M devo rifare il build per multiple architetture.
> `docker buildx create --use --name multiarch`

Rebuild e push

```
docker buildx build --platform linux/amd64,linux/arm64 \
  -t pandagandocker/node-example-1 \
  --push .
```

Per verificare le architetture supportate:

`docker manifest inspect pandagandocker/node-example-1`

Sul terminale collegato al server remoto `docker run -d --rm -p 80:80 pandagandocker/node-example-1`
Per testare l'app che gira sul server remoto usiamo l'**indirizzo IPv4 publico**. Di default è disconessa da qualisiasi accesso al WWW.

Quindi da **Reti e sicurezza > Gruppi di sicurezza >** e individuo quello usato dalla nostra istanza. Questo gruppo avrà **regole in entrata e in uscita**. Nelle regole in entrata vediamo che è aperta "a tutto il mondo" con solo la porta 22 (per questo è molto importante la chiave di autenticazione ssh). Dobbiamo permettere del traffico http. Per farlo aggiungiamo una nuova regoal in entrata, di tipo HTTPS e con la porta 80. Ora se usiamo l'**indirizzo IPv4 publico** siamo in grado di comunicare con la nostra app che sta girando su un server remoto.

## Come fare update al codice

Facciamo rebuild, push, e la aggiorniamo sul remote server.
Rebuild e push

```
docker buildx build --platform linux/amd64,linux/arm64 \
  -t pandagandocker/node-example-1 \
  --push .
```

Poi sul server connesso tramite ssh stoppiamo il container attuale
`docker stop "nomecontainer"`
Scarichiamo la nuova immagine da dockerhub e la runniamo:

```bash
docker pull pandagandocker/node-example-1
docker run -d --rm -p 80:80 pandagandocker/node-example-1
```

## Come stoppare/mettere in pausa istanza

`docker stop "nomecontainer"`
in modo permanente da EC2 > istanze > **termina (elimina) istanza** oppure **arresta istanza**

## Svantaggi di questo approccio

Possiamo definire questo approccio **DO-IT-YOURSELF**, perchè abbiamo dovuto fare tutti gli step manualmente.
E siamo anche completamente responsabili della macchina, e della sua sicurezza:
aggiornamenti, network e gruppi di sicurezza.

## From manual deployment to Managed Service

L'approccio **do it yourself** ci da controllo totale, ma anche tantissime responsabilità. Un **trade-off** è usare una soluzione di terze parti.
![](managed-automated.png)

Quindi useremo **ECS** (Elastic container service), dove tutta la parte di sicurezza e aggiornamenti verrà gestita da ECS.
Meno controllo ma meno responsabilità. In un server gestito quindi non useremo i comandi nativi, o lo andremo a installare, perchè verrà gestito tutto da ECS.

Dalla console AWS > ECS > **Definizioni di processo** > crea nuova definizione di attività
![](ecs-container.png)

Useremo **AWS Fargate** un modo per lanciare il container serverless.

Caratteristiche principali:

- **Serverless**: Non vedi né gestisci EC2, solo container
- **Pay-per-use**: Paghi solo per CPU/RAM che usi effettivamente
- **Auto-scaling**: Si scala automaticamente in base al carico
- **Zero manutenzione**: AWS gestisce patching, aggiornamenti, sicurezza

✅ Applicazioni web semplici/medie
✅ Microservizi
✅ Task periodici
✅ Quando vuoi "semplicità"

Quando NON usarlo:

❌ Hai bisogno di controllo totale sul server
❌ Applicazioni molto specifiche
❌ Budget limitato per workload sempre attivi

> Poi creiamo un cluster a cui assegnare il servizio creato precedentemente.

## Updating Managed Containers

Quando modifichiamo il codice e lo pushiamo su docker hub, non verrà usata automaticametne la nuova img.

Ma dobbiamo andaare in Definizioni processo > il processo che sto usando > crea nuova revisione.

E poi da ECS > cluster > nome cluster usato > Servizi > il servizio usato > aggiorna.

## ![](this_works.png)

# Preparing a Multi Container APP
