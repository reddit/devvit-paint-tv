import pkg from '../../package.json' with {type: 'json'}
import {postWebViewMessage} from './mail.ts'

console.log(`${pkg.name} v${pkg.version}`)

addEventListener('message', console.log)
postWebViewMessage({type: 'Registered'})
