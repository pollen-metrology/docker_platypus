# Prepare a linux server
  - Install docker and docker-compose
    ```
    sudo apt-get update && sudo apt-get install -y docker.io docker-compose
    ```
  - Allow user to use docker (replaces {USER} with the user who will generate the container) : 
    ```
    sudo usermod -a -G docker {USER}
    ```
  - Connect the user who will generate the container 
    ```
    su {USER}
    ```
  - Create a platypus folder (change {VERSION} value)
    ```
    mkdir -p ~/Docker/platypus/platypus_{VERSION}
    ```
  - Create the docker-compose file
    ```
    echo -e "\
    version: \"3.3\" \
    \nservices: \
    \n  platypus: \
    \n    image: pollenm/platypus_{CUSTOMER}:{PLATYPUS_VERSION} \
    \n      container_name: {CONTAINER_NAME} \
    \n    restart: always \
    \n    ports: \
    \n      - \"8081:8080\" \
    \n    volumes: \
    \n      # Persist DataBase and Licences \
    \n      - ./data:/root/.local/share/Pollen Metrology/Platypus \
    \n      # Persist Config File (you must create the ./config/Platypus.ini file before generating a container) \
    \n      - ./config/Platypus.ini:/usr/share/Platypus/bin/Platypus.ini \
    \n" > ~/Docker/platypus/platypus_{VERSION}/docker-compose.yaml
    ```
  - Create the persistent data folder
    ```
    mkdir -p ~/Docker/platypus/platypus_{VERSION}/data
    ```
  - Create the licence file to the data folder (change {SERVER_URL} value)
    ```
    echo -e "\
    SERVER {SERVER_URL} ANY 8091 \
    \nVENDOR POLLEN \
    \nUSE_SERVER \
    "> ~/Docker/platypus/platypus_{VERSION}/data/floating_license.lic
    ```
  - Create the config folder 
    ```
    mkdir -p ~/Docker/platypus/platypus_{VERSION}/config
    ```
  - Create the config file 
    ```
    echo -e " \
    \n[settings]
    \napplication-suffix=
    \nhelp=OFF
    \nversion=OFF
    \n
    \n[log]
    \nverbose=ON
    \nloglevel=debug
    \nlogfile=
    \nlogfile-no=OFF
    \n 
    \n[network]
    \ninterface=0.0.0.0
    \nport=8080
    \n
    \n[authentication]
    \nauthentication-config-file=./Platypus.ini
    \nactivated=true
    \nldap=false
    \nadmin.username=admin
    \nadmin.password=admin
    \nsession.timeout=30
    \n
    \n[ldap]
    \nhost=ldap_server.your-domain.com
    \nport=389
    \nbind.dn.pattern="cn={0},ou=your-organisation,dc=your-domain,dc=com"
    \n
    \n[ldap_groups]
    \napi = Api
    \nlite = Lite
    \nsmart = Smart
    \n" > ~/Docker/platypus/platypus_{VERSION}/config/Platypus.ini
    ```  
  - Login to the platypus registry (replace ${DOCKER_USER} by your user login
  ```
  docker login -u ${DOCKER_USER} https://index.docker.io/v2/
  ```
  - Start the container
  ```
  cd ~/Docker/platypus/platypus_{VERSION}
  docker-compose up -d
  ```

# docker_platypus

Here is an example of the docker-compose.yml file
```
version: "3.3"
services:
  platypus:
    image: pollenm/platypus:3.102.0
    restart: always
    ports:
      - "8080:8080"
    volumes:
      # Persist DataBase and Licences
      - ./data:/root/.local/share/Pollen Metrology/Platypus
      # Persist Config File (you must create the ./config/Platypus.ini file before generating a container)
      - ./config/Platypus.ini:/usr/share/Platypus/bin/Platypus.ini
```

Here is the default config file (Platypus.ini)
```
[settings]
application-suffix=
help=OFF
version=OFF

[log]
verbose=OFF
loglevel=info
logfile=
logfile-no=OFF

[network]
interface=0.0.0.0
port=8080

[authentication]
authentication-config-file=./Platypus.ini
activated=false
ldap=false
admin.username=admin
admin.password=admin
session.timeout=30

[ldap]
host=ldap_server.your-domain.com
port=389
bind.dn.pattern="cn={0},ou=your-organisation,dc=your-domain,dc=com"

[ldap_groups]
api = Api
lite = Lite
smart = Smart

```

Some known issues
- If you are using wsl and the container time is not up to date. You can force the time update with this command in the wsl console :
```
sudo hwclock -s
```
