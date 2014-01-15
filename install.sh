#!/bin/bash

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

git clone https://gist.github.com/8430606.git /opt/whc

cp /opt/whc/whc-server /etc/init.d/whc-server
