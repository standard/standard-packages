#!/usr/bin/env node

const chalk = require('chalk')
const db = require('nano')('http://admin:admin@localhost:5984/npm_registry')
const es = require('event-stream')
const fs = require('fs')
const gh = require('github-url-to-object')
const json = require('JSONStream')
const padLeft = require('pad-left')
const path = require('path')

const freqs = {}

// search some modules specifically
const modules = [
  'standard', 'snazzy', 'eslint-config-standard'
]

const allFreqs = {}

db.listAsStream({ include_docs: true })
  .pipe(json.parse('rows.*.doc'))
  .pipe(es.mapSync(function (data) {
    // skip packages missing a "dist-tags" key
    if (!data['dist-tags']) {
      console.log(`skipping ${data._id} ${data.name}`)
      return
    }

    // skip packages where the `latest` tag is not in `versions`
    if (!data.versions[data['dist-tags'].latest]) {
      return
    }

    let description = data.description
    if (description === '') description = null

    const name = data.name
    const latest = data.versions[data['dist-tags'].latest]
    let deps = []
    if (latest.dependencies) deps = deps.concat(Object.keys(latest.dependencies))
    if (latest.devDependencies) deps = deps.concat(Object.keys(latest.devDependencies))
    deps.forEach(function (key) {
      if (modules.indexOf(key) >= 0) {
        if (!(key in freqs)) {
          freqs[key] = { count: 1, deps: [] }
        } else {
          freqs[key].count++
        }
        let repo = latest.repository && latest.repository.url
        if (repo) try { repo = gh(repo) } catch (err) {}
        if (repo) repo = repo.https_url
        if (repo === '') repo = null
        if (name && repo) freqs[key].deps.push([name, repo, description])
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
    let values = Object.keys(allFreqs)
      .map(function (k) {
        return { value: k, frequency: allFreqs[k] }
      })
      .sort(function (a, b) {
        return (b.frequency || 0) - (a.frequency || 0)
      })

    values = values.slice(0, 200)

    const longest = values.reduce(function (prev, a) {
      return Math.max(prev, a.value.length)
    }, 0)

    console.log('\n--------')
    console.log('SPECIFIC MODULES')
    console.log('--------\n')

    let arr = []
    const included = {}
    modules.forEach(function (key) {
      const padding = longest - key.length
      console.log(key, padLeft(freqs[key].count || 0, padding + 1))
      freqs[key].deps
        .forEach(function (dep) {
          if (included[dep[0]]) return
          arr.push({ name: dep[0], repo: dep[1], description: dep[2], dependents: allFreqs[dep[0]] })
          included[dep[0]] = true
        })
    })

    // `standard` count should include `snazzy` and `eslint-config-standard` users
    const standard = arr.find(function (pkg) {
      return pkg.name === 'standard'
    })
    standard.dependents = arr.length

    arr = arr.sort(function (a, b) {
      return (b.dependents || 0) - (a.dependents || 0)
    })
    fs.writeFileSync(path.join(__dirname, '..', 'all.json'), JSON.stringify(arr, undefined, 2))

    console.log('\n--------')
    console.log('TOP ' + values.length)
    console.log('--------\n')

    values.forEach(function (x, i) {
      let key = x.value
      const count = x.frequency
      const padding = longest - key.length

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
