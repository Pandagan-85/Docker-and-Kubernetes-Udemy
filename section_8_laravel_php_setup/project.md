# Laravel & PHP dockerized

![](/section_8_laravel_php_setup/target-setup.png)

Avremo 3 **application containers**:

- MySQL Database
- Nginx Web Server
- PHP interpreter

e 3 **utility container**:

- Composer
- Laravel Artsisan
- npm

Per il progetto useremo docker compose, e inizieremo con i vari servizi nella compilazione del `compose.yaml`.

```
services:
  server:
  php:
  mysql:
  composer:
  artisan:
  npm:
```

Per php creiamo un docker file che si baserà su un img ufficiale di php.

> Non inseriamo CMD in quanto userà quello dell'img

> ! tutti i container creati dal docker compose, possono scoprirsi a vicenda per il nome in quanto fanno parte dello stesso network !

Dopo aver creato i 3 app container e il container utility composer.

`docker-compose run --rm composer create-project --prefer-dist laravel/laravel:^8.0 .`

Per testare i 3 servizi possiamo escludere quello utility
`docker-compose up -d server php mysql` e se andiamo su `localhost:8000` vedremo laravel, oppure invece di specificare i 3 servizi, aggiungiamo a server:

```
depends_on:
      - php
      - mysql
```

e quando `docker-compose up -d --build server` farà partire tutti e 3. (per spegnere tutto `docker-compose down`).
`--build` ricostruisce img se sappiamo di avere cambiato ad esempio docker file.

Per testare artisan
`docker-compose run --rm artisan migrate`
