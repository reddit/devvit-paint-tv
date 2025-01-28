import type {WebViewMessage} from '../shared/types/message.ts'

export function postWebViewMessage(msg: Readonly<WebViewMessage>): void {
  parent.postMessage(msg, document.referrer || '*')
}
