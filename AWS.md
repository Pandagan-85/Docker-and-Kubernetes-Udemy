# Tutorial AWS ECS: I Concetti Fondamentali

## 🏗️ **1. CLUSTER**

_Il "palazzo" dove abitano i tuoi container_

**Cos'è:** Un raggruppamento logico di risorse di calcolo dove girano i container.

**Analogia:** È come un condominio - definisce dove possono "abitare" i tuoi container, ma non è il singolo appartamento.

**Tipi:**

- **EC2**: Gestisci tu le macchine virtuali
- **Fargate**: AWS gestisce tutto l'hardware (consigliato)

**Esempio:**

```
Cluster "my-app-cluster"
├── Container Frontend (React)
├── Container Backend (Node.js)
└── Container Database (PostgreSQL)
```

---

## 📋 **2. DEFINIZIONI DI PROCESSO (Task Definition)**

_Il "progetto architettonico" del container_

**Cos'è:** Il blueprint che descrive come deve essere costruito e configurato il container.

**Analogia:** È come il progetto di un appartamento - specifica quante stanze, che mobili, dove vanno le prese elettriche.

**Cosa contiene:**

- **Immagine Docker:** `node:18` o `pandagandocker/node-example-1`
- **Risorse:** CPU (256), RAM (512MB)
- **Porte:** Container:80 → Host:80
- **Variabili ambiente:** `NODE_ENV=production`

**Importante:** La definizione NON esegue nulla - è solo la "ricetta"!

---

## 🏃‍♂️ **3. SERVIZI (Services)**

_Il "portiere" che gestisce i container_

**Cos'è:** Quello che prende la definizione di processo e la "mette in vita" mantenendo attivo il numero di container desiderato.

**Analogia:** È come il portiere di un condominio che si assicura che il numero giusto di inquilini sia sempre presente negli appartamenti.

**Responsabilità:**

- **Desired count:** "Mantieni sempre 2 container attivi"
- **Health monitoring:** "Se un container muore, riavviane uno nuovo"
- **Load balancer:** "Collega i container al bilanciatore di carico"
- **Networking:** "Assegna IP pubblici e configura la rete"

**Flusso:**

```
Definizione Processo → Servizio → Container in esecuzione
     (ricetta)      →  (chef)  →     (piatto servito)
```

---

## 🛡️ **4. GRUPPI DI SICUREZZA (Security Groups)**

_I "buttafuori" della rete_

**Cos'è:** Firewall virtuali che decidono chi può parlare con chi e su quali porte.

**Analogia:** Come i buttafuori di una discoteca - decidono chi entra, da dove, e a che orario.

**Regole tipiche:**

**Per container web:**

```
INBOUND:
- Porta 80 (HTTP) ← Da Load Balancer
- Porta 443 (HTTPS) ← Da Load Balancer

OUTBOUND:
- Tutte le porte → Internet (per aggiornamenti)
```

**Per database:**

```
INBOUND:
- Porta 3306 (MySQL) ← Solo da backend containers
- NESSUN accesso diretto da Internet

OUTBOUND:
- Limitato o bloccato
```

**Regola d'oro:** Solo le porte necessarie, solo dalle fonti necessarie!

---

## ⚖️ **5. LOAD BALANCER**

_Il "centralinista" del traffico_

**Cos'è:** Distribuisce il traffico internet tra più container per bilanciare il carico.

**Analogia:** Come il centralinista di un'azienda - riceve tutte le chiamate e le indirizza al reparto giusto.

**Tipi:**

- **Application Load Balancer (ALB):** HTTP/HTTPS - il più comune
- **Network Load Balancer (NLB):** TCP/UDP - per alte prestazioni
- **Classic Load Balancer:** Vecchio, evitare

**Componenti:**

### **Listener:**

_"Ascolta sulla porta 80 e inoltra al target group"_

### **Target Group:**

_Lista di container che possono servire le richieste_

```
Internet → Load Balancer → Target Group → Container 1
                       → Target Group → Container 2
                       → Target Group → Container 3
```

**Health Check:** Il load balancer testa continuamente i container con richieste a `/health` o `/` per verificare che siano vivi.

---

## 🔄 **Come lavorano insieme:**

```
1. CLUSTER: "Ho uno spazio dove mettere container"
2. DEFINIZIONE: "Ecco come costruire il container"
3. SERVIZIO: "Usa quella ricetta e mantieni 2 container attivi"
4. SECURITY GROUP: "I container possono parlare solo sulla porta 80"
5. LOAD BALANCER: "Distribuisco il traffico tra i 2 container"
```

## 🎯 **Esempio pratico:**

**Scenario:** App React + API Node.js

```
CLUSTER: my-app-cluster
├── SERVIZIO Frontend
│   ├── Definizione: react-app (immagine React, porta 80)
│   ├── Security Group: HTTP da Load Balancer
│   └── Target Group: frontend-tg
├── SERVIZIO Backend
│   ├── Definizione: node-api (immagine Node, porta 8080)
│   ├── Security Group: HTTP da Frontend + Load Balancer
│   └── Target Group: backend-tg
└── LOAD BALANCER
    ├── Listener 80 → frontend-tg
    └── Listener /api → backend-tg
```

**Traffico:**

```
Utente → Load Balancer → Frontend Container → API calls → Backend Container
```
