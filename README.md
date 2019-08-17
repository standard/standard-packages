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

To update the data in `all.json`, install [CouchDB](https://couchdb.apache.org), create an `npm_registry` database, and run:

```bash
npm run replicate && npm run update
```

:warning: `npm run replicate` will [replicate](https://docs.couchdb.org/en/stable/replication/intro.html) a 10 GB+ database

## License

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
