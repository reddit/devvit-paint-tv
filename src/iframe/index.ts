import pkg from '../../package.json' with {type: 'json'}

console.log(`${pkg.name} v${pkg.version}`)
