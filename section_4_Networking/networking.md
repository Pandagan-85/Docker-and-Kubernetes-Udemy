# Networking

Out of the box i container possono mandare richieste a servizi esterni.
Per farlo comunicare a un database (es. mongodb) che gira sulla nostra macchina host, non possiamo usare url generico. Ma dobbiamo usare: **host.docker.internal** è un domino speciale.

## host.docker.internal

`host.docker.internal` è un hostname speciale fornito da Docker che risolve all'indirizzo IP dell'host dal punto di vista di un container Docker.

### Scopo e funzionamento

Quando un'applicazione all'interno di un container Docker deve comunicare con un servizio che gira sull'host (la macchina che esegue Docker), non può semplicemente usare `localhost` o `127.0.0.1`, perché questi indirizzi si riferiscono al container stesso, non all'host.
`host.docker.internal` risolve questo problema fornendo un modo standardizzato per raggiungere l'host dall'interno del container.

### Casi d'uso comuni

- Connessione a database che girano sull'host
- Accesso a servizi di sviluppo locali
- Comunicazione con API che girano sulla macchina host
- Testing e sviluppo locale

Questo hostname semplifica notevolmente lo sviluppo con Docker, eliminando la necessità di configurare manualmente gli indirizzi IP dell'host.

## Scarichiamo img ufficiale di mongodb

`docker run -d --name mongodb mongo`
e la ispezioniamo con `docker container inspect mongodb` e nella voce NetworkSettings cerchiamo **IPAdress**
`"IPAddress": "172.17.0.2",` che è l'indirizzo ip del nostro container e può essere usato per contattare il container.
Ma scrivere di volta in volta ip, non è molto conveniente.

## Creating Container Networks

`docker run --network my_network ...` Crea un network in cui i container sono in grado di parlarsi in quanto gli IPs sono risolti automaticamente.

I **container networks** sono reti virtuali create da Docker che permettono ai container di comunicare tra loro e con l'esterno in modo controllato e isolato.

### Concetti base

Docker crea reti virtuali separate dalla rete fisica dell'host, dove ogni container può avere il proprio indirizzo IP interno e comunicare con altri container attraverso queste reti.

### Tipi di network in Docker

#### 1. **Bridge Network (default)**

```bash
docker network ls
# Vedrai 'bridge' come rete di default
```

- I container possono comunicare tra loro usando gli indirizzi IP interni
- Comunicazione con l'host tramite port mapping (`-p 3000:3000`)

#### 2. **Host Network**

```bash
docker run --network=host my-app
```

- Il container usa direttamente la rete dell'host
- Non c'è isolamento di rete

#### 3. **None Network**

```bash
docker run --network=none my-app
```

- Container completamente isolato, senza connettività di rete

#### 4. **Custom Networks** (User-defined)

```bash
# Crea una rete personalizzata
docker network create my-network

# Collega container alla rete
docker run --network=my-network --name app1 my-app
docker run --network=my-network --name db mongodb
```

### Esempio pratico

Con Docker Compose:

```yaml
version: "3.8"
services:
  app:
    build: .
    networks:
      - app-network

  database:
    image: mongo
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Vantaggi delle reti personalizzate

1. **Risoluzione DNS**: I container si possono chiamare per nome

   ```javascript
   // Invece di IP, puoi usare il nome del servizio
   mongoose.connect("mongodb://database:27017/mydb");
   ```

2. **Isolamento**: Container in reti diverse non possono comunicare di default

3. **Sicurezza**: Controllo granulare su chi può comunicare con chi

### Comandi utili

```bash
# Lista tutte le reti
docker network ls

# Ispeziona una rete
docker network inspect bridge

# Crea una rete
docker network create --driver bridge my-net

# Collega un container esistente a una rete
docker network connect my-net my-container

# Scollega
docker network disconnect my-net my-container
```

Le reti Docker sono fondamentali per creare architetture multi-container sicure e organizzate!
