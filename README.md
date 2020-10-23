# standard-packages [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://img.shields.io/travis/standard/standard-packages/master.svg
[travis-url]: https://travis-ci.org/standard/standard-packages
[npm-image]: https://img.shields.io/npm/v/standard-packages.svg
[npm-url]: https://npmjs.org/package/standard-packages
[downloads-image]: https://img.shields.io/npm/dm/standard-packages.svg
[downloads-url]: https://npmjs.org/package/standard-packages
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

### List of packages that use [`standard`](https://github.com/standard/standard)

### [View the list (all.json)](all.json)

## Usage

```js
const packages = require('standard-packages')
packages.forEach(pkg => {
  console.log('package name', pkg.name)
  console.log('repo url', pkg.repo)
})
```

## Contribute

To update the data in `all.json`, first install [CouchDB](https://couchdb.apache.org):

```bash
npm run install-deps
```

Add an admin password to the CouchDB config file:

```bash
vim /usr/local/etc/local.ini # add admin password to config file
```

For example, this sets the admin password to "admin":

```ini
[admins]
  admin = admin
```

Then, start CouchDB, create an `npm_registry` database, and start the replication process:

```bash
couchdb
curl -X PUT http://admin:admin@127.0.0.1:5984/npm_registry # create database
npm run replicate
```

Finally, update the package stats with:

```bash
npm run update
```

:warning: `npm run replicate` will [replicate](https://docs.couchdb.org/en/stable/replication/intro.html) a 10 GB+ database

## Install dependencies

On macOS, you can run `npm run install-deps` to install CouchDB.

## License

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
