const nano = require('nano')('http://localhost:5984')

nano.db.replicate('https://replicate.npmjs.com', 'npm_registry')
