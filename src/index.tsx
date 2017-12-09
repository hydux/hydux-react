import { createElement, PureComponent } from 'react'
import { render as reactRender } from 'react-dom'
import { App } from 'hydux'

// Fix React's default export doesn't work with typescript loader
export const React = { createElement }

class PureComp extends PureComponent { }

export function PureView(props) {
  return (
    <PureComp {...props.state}>
      {props.children}
    </PureComp>
  )
}

// work for hmr
let _container
export default function withReact<State, Actions>(container?): (app: App<State, Actions>) => App<State, Actions> {
  container = container || _container
  if (!container) {
    container = _container = document.createElement('div')
    document.body.appendChild(container)
  }
  return app => props => app({
    ...props,
    onRender(view) {
      props.onRender && props.onRender(view)
      return reactRender(view, container)
    }
  })
}
