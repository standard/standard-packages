#!/usr/bin/env node

const nano = require('nano')('http://admin:admin@localhost:5984')

nano.db.replicate('https://replicate.npmjs.com', 'npm_registry')
