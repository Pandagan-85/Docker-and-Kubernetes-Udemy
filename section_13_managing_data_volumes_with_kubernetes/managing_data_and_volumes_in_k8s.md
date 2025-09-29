# Managing Data and Volumes in Kunernetes

## Starting Project

`docker compose up -d --build`

La nostra app espone `/story`, possiamo fare un get per vedere cosa contiene, o con un post inserire una nuova story tramite postman. Dando nel body ad esempio:

```json
{
    "text": "My text"!"
}
```

questo aggiungerà una riga al file di testo dentro `story>text.txt`

## Understanding STATE

**State** sono i dati creati e usati dalla nostra applicazione che non devono andare persi.

Ci sono vari tipi di stati:

- **User Generated Data, user accounts** : > Spesso salvati in db, o file come uploads

- **Intermediate results derived by the app** > Spesso conservati nella memoria, o database o file temporanei.

## K8S VOlumes: Theory & Docker Volumes

K8S può montare Volumi nei containers.

Ha una larga varietà di tipi di volumi e drivers supportati.

- Local Volumes
- Cloud provider specific volumes

**Il Lifetime del volume dipende dal lifetime del pod**, in quanto i volumi sono parte del pod. **I volumi sono specifici per il pod**.

- Il volume sopravvive al restart del container o della sua rimozione
- Volumi sono rimossi quando il pod viene distrutto

I volumi K8S supportano vari tipi e drivers, mentre docker non ho drive/type support.
I volumi K8S non sono necessariamente persistenti(sopravvivono al restart del container ma non a quello del pod), mentre su docker sono persistenti fino a quando non vengono puliti manualmente.

## Creating a New deployment & service
