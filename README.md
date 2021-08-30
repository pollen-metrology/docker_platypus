# docker_platypus

Here is an example of the docker-compose.yml file
```
version: "3.9"
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
