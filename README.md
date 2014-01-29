# Simple web API that check the health of services

## Prerequisites
* nodejs >= 0.10.24

## Install
```bash
[sudo] bash -c "$(curl -fsSL https://raw2.github.com/Wiredcraft/health_api/master/install.sh)"
```

## Access
* Http port - `5002`
* username - `wiredcraf`
* password - `wuding1189426`

__curl example__

```bash
curl -u wiredcraft:wuding1189426 http://127.0.0.1:5002/{component}
```

## Supporting checks

Component | Description
--------- | -----------
redis     | Checking if the local tcp port `6379` can be access
couchdb   | Checking if the local http port `5984` can be access
couchbase | Checking if the local http port `8091` can be access
elasticsearch | Checking if the local http port `9200` can be access
http | Checking if the local http port `80` can be acccess
https | Checing if the local http port `443` can be access
mongooseim | Checking if the local tcp port `5222` can be access
api | Checking if the local api end point `http://127.0.0.1:3000/ping` retunr correct message `pong`
