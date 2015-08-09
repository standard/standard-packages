# List of Packages that Use JavaScript Standard Style

### List of repos that depend on [`standard`](https://github.com/feross/standard)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Usage

```js
var packages = require('standard-packages')
packages.forEach(function (pkg) {
  console.log('package name', pkg.name)
  console.log('repo url', pkg.repo)
})
```

## License

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
