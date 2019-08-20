### Building containers for the first time
After clone and docker daemon running, go to docker folder inside of the project

```sh
cd docker
```

For build the nginx
```sh
docker-compose build --no-cache nginx
```

For build the mysql
```sh
docker-compose build --no-cache mysql
```

for build the react app
```sh
docker-compose build --no-cache react
```

for build the vue app
```sh
docker-compose build --no-cache vue
```
### Uping MySQL for the first time

For build the mysql
```sh
docker-compose up -d --force-recreate mysql
```
Please, wait a while, something like 10 minutes, for make sure the whole configuration were setted.

This command will set the mysql data on **./data/mysql/** folder, and create 2 fresh databases: **tegra_node** and **tegra_php**


### Hosts
Set these hosts in your host machine

````
#TEGRA
127.0.0.1	laravel.tegra.com.la
127.0.0.1	nuxt.tegra.com.la
127.0.0.1	node.tegra.com.la
127.0.0.1	next.tegra.com.la
````

### Nginx proxys
All files inside the folder: **/docker/nginx/sites/\***

Make sure the right host docker internal ip is setted on **proxy_pass** setup

##### service.conf

````
server {
    ...
    location / {
		....
        proxy_pass http://[internal.ip]:[port];
		....
    }
	...
}
````

### Setup Laravel Project
On terminal, go into workspace
```sh
docker-compose exec workspace bash
```
On workspace
```sh
cd back-end/php-laravel
composer install
```
After instalation of the laravel framework, create the .env file
```sh
cp .env.example .env
```
Create the key for the laravel project
```sh
php artisan key:generate
```
### Populate the mysql database for the Laravel API Project
The same service container **workspace** as the setup laravel project, use the laravel migration for create and populate the mysql **tegra_php** database name.
```sh
php artisan migrate --seed
```
After the migration and seeders ran, the react and vue app will use the laravel api properly.

### Deploy React app
After **nginx** and **mysql** up and running, let's setup the react app.

**required:** mysql **tegra_php** database populated and **laravel** up and runnning as well.

On terminal, send.
```sh
docker-compose up -d react
```
Access in the browser http://next.tegra.com.la

### Deploy Vue Universal App
After **nginx** and **mysql** up and running, let's setup the react app.

**required:** mysql **tegra_php** database populated and **laravel** up and runnning as well.

On terminal, send.
```sh
docker-compose up -d vue
```
Access in the browser http://nuxt.tegra.com.la


### Deploy Node API
File **./back-end/node-express/config/config.json**
Make sure in above file, the right host machine is setted.

**required:** mysql container up and running.

Then on terminal, hit.
```sh
docker-compose up -d node_api
```
This command will drop all tables from **tegra_node** database and migrate all tables again, after that, populate the tables and start the node server.


