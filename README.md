# Prepare a linux server
  - Install docker and docker-compose
    ```
    sudo apt-get update && sudo apt-get install -y docker.io docker-compose
    ```
  - Set some variables
    * POLLEN_USER: Used to run the docker container & owner of configuration files and database
    * VERSION: Version on Smart 3
    * CONFIGURATION: Delivered configuration
    * CONTAINER_NAME: Name of the container that runs Smart 3
    * LICENSE_SERVER: IP address of the licence server
    ```shell
    export POLLEN_USER=pollen
    export VERSION=3.102.0
    export CONFIGURATION=Customer
    export CONTAINER_NAME=pollen_smart_$VERSION
    export LICENSE_SERVER=127.0.0.1
    ```
  - Allow user to use docker :
    ```shell
    sudo usermod -a -G docker $POLLEN_USER
    ```
  - Connect the user who will generate the container 
    ```shell
    su $POLLEN_USER
    ```
  - Create a platypus folder
    ```shell
    mkdir -p ~/Docker/platypus
    ```
  - Create the docker-compose file
    ```shell
    echo -e "\
    version: \"3.3\" \
    \nservices: \
    \n  platypus: \
    \n    image: pollenm/platypus_$CONFIGURATION:$VERSION \
    \n      container_name: $CONTAINER_NAME \
    \n    restart: always \
    \n    ports: \
    \n      - \"8080:8080\" \
    \n    volumes: \
    \n      # Persist DataBase and Licences \
    \n      - ./data:/root/.local/share/Pollen Metrology/Platypus \
    \n      - ./models:/root/.local/share/Pollen Metrology/Models \
    \n      # Persist Config File (you must create the ./config/Platypus.ini file before generating a container) \
    \n      - ./config/Platypus.ini:/usr/local/bin/platypus/bin/Platypus.ini \
    \n" > ~/Docker/platypus/docker-compose.yaml
    ```
  - Create the persistent data folder
    ```shell
    mkdir -p ~/Docker/platypus/data
    mkdir -p ~/Docker/platypus/models
    ```
  - Create the licence file to the data folder
    ```shell
    echo -e "\
    SERVER $LICENSE_SERVER ANY 8091 \
    \nVENDOR POLLEN \
    \nUSE_SERVER \
    "> ~/Docker/platypus/data/floating_license.lic
    ```
  - Create the config folder 
    ```shell
    mkdir -p ~/Docker/platypus/config
    ```
  - Create the config file (updated version adapted from default)
    ```shell
    echo -e "\
    [settings] \
    \napplication-suffix= \
    \nhelp=OFF \
    \nversion=OFF \
    \n \
    \n[log] \
    \nverbose=ON \
    \nloglevel=debug \
    \nlogfile= \
    \nlogfile-no=OFF \
    \n \
    \n[network] \
    \ninterface=0.0.0.0 \
    \nport=8080 \
    \n \
    \n[authentication] \
    \nauthentication-config-file=./Platypus.ini \
    \nactivated=true \
    \nldap=false \
    \nadmin.username=admin \
    \nadmin.password=admin \
    \nsession.timeout=30 \
    \n \
    \n[ldap] \
    \nhost=ldap_server.your-domain.com \
    \nport=389 \
    \nbind.dn.pattern=\"cn={0},ou=your-organisation,dc=your-domain,dc=com\" \
    \n \
    \n[ldap_groups] \
    \napi = Api \
    \nlite = Lite \
    \nsmart = Smart \
    " > ~/Docker/platypus/config/Platypus.ini
    ```  
  - If you are granted access, log in to the platypus registry with the provided DOCKER_USER 
    ```shell
    docker login -u {DOCKER_USER} https://index.docker.io/v2/
    ```
  - If you don't have access to the registry, load the provided image
    ```shell
    docker load -i platypus_$CONFIGURATION-$VERSION-docker.tar
    ```
  - Start the container
    ```shell
    cd ~/Docker/platypus
    docker-compose up -d
    ```

# Sample config files

  Here is an example of the docker-compose.yml file
  ```yml
  version: "3.3"
  services:
    platypus:
      image: pollenm/platypus_pollen:3.102.0
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
  ```ini
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

# Hint

* You can see the logs with the command `docker-compose logs -f`
  
# Some known issues
  - If you are using wsl and the container time is not up-to-date. You can force the time update with this command in the wsl console :
  ```shell
  sudo hwclock -s
  ```
  - If you using wsl and ubuntu 18.04, you can't log in docker without install "pass" library
  ```shell
  sudo apt-get install pass
  ```
