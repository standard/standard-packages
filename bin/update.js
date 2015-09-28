var chalk = require('chalk')
var es = require('event-stream')
var fs = require('fs')
var gh = require('github-url-to-object')
var json = require('JSONStream')
var padLeft = require('pad-left')
var path = require('path')

var freqs = {}

// search some modules specifically
var modules = [
  'standard', 'snazzy', 'eslint-config-standard'
]

var allFreqs = {}

fs.createReadStream(path.join(__dirname, '..', 'alldata.json'))
  .pipe(json.parse('rows.*.value'))
  .pipe(es.mapSync(function (data) {
    var repo = data.repository && data.repository.url
    if (repo) repo = gh(repo)
    if (repo) repo = repo.https_url
    if (repo === '') repo = null

    var description = data.description
    if (description === '') description = null

    var name = data.name
    var deps = []
    if (data.dependencies) deps = deps.concat(Object.keys(data.dependencies))
    if (data.devDependencies) deps = deps.concat(Object.keys(data.devDependencies))
    deps.forEach(function (key) {
      if (modules.indexOf(key) >= 0) {
        if (!(key in freqs)) {
          freqs[key] = { count: 1, deps: [] }
        } else {
          freqs[key].count++
        }
        if (name && repo) freqs[key].deps.push([ name, repo, description ])
      }

      if (!(key in allFreqs)) {
        allFreqs[key] = 1
      } else {
        allFreqs[key]++
      }
    })
    return deps
  }))
  .on('end', function (ev) {
    var values = Object.keys(allFreqs)
      .map(function (k) {
        return { value: k, frequency: allFreqs[k] }
      })
      .sort(function (a, b) {
        return (b.frequency || 0) - (a.frequency || 0)
      })

    values = values.slice(0, 200)

    var longest = values.reduce(function (prev, a) {
      return Math.max(prev, a.value.length)
    }, 0)

    console.log('\n--------')
    console.log('SPECIFIC MODULES')
    console.log('--------\n')

    var arr = []
    modules.forEach(function (key) {
      var padding = longest - key.length
      console.log(key, padLeft(freqs[key].count || 0, padding + 1))
      freqs[key].deps
        .forEach(function (dep) {
          arr.push({ name: dep[0], repo: dep[1], description: dep[2], dependents: allFreqs[dep[0]] })
        })
    })

    // `standard` count should include `snazzy` and `eslint-config-standard` users
    var standard = arr.filter(function (pkg) {
      if (pkg.name === 'standard') return true
    })[0]
    standard.dependents = arr.length

    arr = arr.sort(function (a, b) {
      return (b.dependents || 0) - (a.dependents || 0)
    })
    fs.writeFileSync(path.join(__dirname, '..', 'standard.json'), JSON.stringify(arr, undefined, 2))

    console.log('\n--------')
    console.log('TOP ' + values.length)
    console.log('--------\n')

    values.forEach(function (x, i) {
      var key = x.value
      var count = x.frequency
      var padding = longest - key.length

      // highlight standard style packages
      modules.forEach(function (module) {
        freqs[module].deps.some(function (val) {
          if (key === val[0] || key === 'standard') {
            key = chalk.green(key + ' (using standard)')
            return true
          }
          return false
        })
      })

      console.log((i + 1) + '. ' + key, padLeft(count || 0, padding + 1))
    })
  })
