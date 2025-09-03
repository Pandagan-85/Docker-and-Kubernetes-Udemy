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

> ! tutti i container creati dal docker compose, possono scoprirsi a vicenza per il nome in quanto fanno parte dello stesso network !
