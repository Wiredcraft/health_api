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

if [ ! -d ${WHI_ROOT}/.git ];then
  git clone ${WHI_REPO} ${WHI_ROOT}
else
  cd ${WHI_ROOT}
  git pull
fi

cp ${WHI_SCRIPT} ${WHI_DAEMON}

echo "Run [sudo] service whi-server [re]start"
