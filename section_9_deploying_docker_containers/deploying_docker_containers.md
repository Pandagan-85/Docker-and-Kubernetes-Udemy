# Deploying Docker Containers

Grazie ai container sia in sviluppo che produzione abbiamo:

- Isolated, standalone environment
- Reproducibles environment, easy to share and use.

> What works on your machine (in a container) will also work after deployment

Durante lo sviluppo abbiamo usato molto i **Bind Mounts** che non useremo in deploy. Le app probabilmente in deploy avranno bisogno di **build step**.
**Progetti multi container** potrebbero dover essere suddivisi su diverse host machine.
Trade-offs tra **controllo** e **responsabilità**.
