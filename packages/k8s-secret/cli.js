#!/usr/bin/env node

// const config = require('./src/index')

// const loadConfig = () => config.load(process.argv[2]);
// const initConfig = () => config.load(['secret/wtsecret', 'configmap/common', 'configmap/sql-prod']);
const loadConfig = require('./src/index');