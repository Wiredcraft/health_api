#!/bin/bash

WHI_REPO=git@github.com:Wiredcraft/health_api.git
WHI_ROOT=/opt/whi
WHI_SCRIPT=${WHI_ROOT}/whi-server
WHI_DAEMON=/etc/init.d/whi-server
NODE_BIN=`which node`
NPM_BIN=`which npm`

if [[ ! ${NODE_BIN} ]];then
    echo "node not found"
    exit 1
fi

if [[ ! ${NPM_BIN} ]];then
    echo "npm not found"
    exit 1
fi

if [ ! -d ${WHI_ROOT}/.git ];then
    git ${WHI_REPO} ${WHI_ROOT}
else
    cd ${WHI_ROOT}
    git pull
fi

cp ${WHI_SCRIPT} ${WHI_DAEMON}

echo "Run [sudo] service whi-server [re]start"
