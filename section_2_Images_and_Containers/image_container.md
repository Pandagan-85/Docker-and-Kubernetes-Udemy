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

## Deleting Images & Containers

## Inspecting Images

## Copyng Files into & from containers

## Naming & Tagging Container & Images

## Sharing Images on dockerhub (renaming images to match repo name on dockerhub)
