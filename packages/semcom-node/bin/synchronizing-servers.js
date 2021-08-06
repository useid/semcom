#!/usr/bin/env node

const { launch, createVariables } = require('../dist/main.js');


const variabes1 = createVariables([...process.argv, '-p', '3000', '-c', 'config/config-default.dev.json']);
launch(variabes1);

const variabes2 = createVariables([...process.argv, '-p', '3001', '-c', 'config/config-default.dev2.json']);
launch(variabes2);
