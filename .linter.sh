#!/bin/bash
cd /home/kavia/workspace/code-generation/5gtestgenie-20721-154bcfdd/5gtestgenie_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

