import React from 'react'
import ReactDOM from 'react-dom'
import { App } from 'hydux'

export { React }

// work for hmr
let _container
export default function withReact<State, Actions>(container): (app: App<State, Actions>) => App<State, Actions> {
  container = container || _container
  if (!container) {
    container = _container = document.createElement('div')
    document.body.appendChild(container)
  }
  return app => props => app({
    ...props,
    onRender(view) {
      props.onRender && props.onRender(view)
      return ReactDOM.render(view, container)
    }
  })
}
