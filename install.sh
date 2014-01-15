#!/bin/bash
WHC_ROOT=/opt/whc
WHC_SCRIPT=${WHC_ROOT}/whc-server
WHC_DAEMON=/etc/init.d/whc-server
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

if [ ! -d ${WHC_ROOT}/.git ];then
    git clone https://gist.github.com/8430606.git ${WHC_ROOT}
else
    cd ${WHC_ROOT}
    git pull
fi

cp ${WHC_SCRIPT} ${WHC_DAEMON}

echo "Run [sudo] service whc-server [re]start"
