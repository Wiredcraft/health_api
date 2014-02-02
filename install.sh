#!/bin/bash

WHI_REPO="https://github.com/Wiredcraft/health_api.git"
WHI_ROOT=/opt/whi
WHI_SCRIPT=${WHI_ROOT}/whi-server
WHI_DAEMON=/etc/init.d/whi-server
NODE_BIN=`which node`
NPM_BIN=`which npm`

if [[ ! ${NODE_BIN} ]];then
  echo "Error: node not found in ${PATH}"
  echo "Installation terminated"
  exit 1
fi

if [[ ! ${NPM_BIN} ]];then
  echo "Error: npm not found in ${PATH}"
  echo "Installation terminated"
  exit 1
fi

echo -n "Basic auth - port [5002]: "
read PORT
echo -n "Basic auth - user [wiredcraft]: "
read USER
echo -n "Basic auth - pass: "
read PASS

# Apply defauts
if [[ -z "$PORT" ]]; then
  PORT=5002
fi
if [[ -z "$USER" ]]; then
  USER=wiredcraft
fi
if [[ -z "$PASS" ]]; then
  echo "You need to specify a password. Exiting..."
  exit 1
fi

if [ ! -d ${WHI_ROOT}/.git ];then
  echo "Fetching whi-server code"
  git clone ${WHI_REPO} ${WHI_ROOT}
else
  echo "Updating whi-server code"
  cd ${WHI_ROOT}
  git pull
fi

echo "Setting up API auto-health script"
cat > /etc/cron.d/whi-server-health << EOF
# Simple health script that attempts to connect to the API and restart it on failure
* * * * * root curl http://$USER:$PASS@localhost:$PORT/api > /dev/null 2>&1 || (logger "restarting whi-server"  && service whi-server restart)
EOF

echo "Preparing init script"
cp ${WHI_SCRIPT} ${WHI_DAEMON}
sed -e "s/API_PORT/$PORT/g" -e "s/API_USERNAME/$USER/g" -e "s/API_PASSWORD/$PASS/g" ${WHI_DAEMON}
echo "Run [sudo] service whi-server [re]start"
