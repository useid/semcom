#!/usr/bin/env node

const { launch, createVariables } = require('../dist/main.js');

const variabes = createVariables(process.argv);

launch(variabes);
