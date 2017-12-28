import * as React from 'react'
import { render as reactRender } from 'react-dom'
import { App } from 'hydux'

export { React }

class PureComp extends React.PureComponent { }

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
      // ReactDOM.render is already batched
      // if wrapped by rAF it might break input's value and onChange
      return reactRender(view, container)
    }
  })
}
