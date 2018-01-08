import * as React from 'react'
import { render as reactRender } from 'react-dom'
import app, { App, ActionsType, noop, Sub } from 'hydux'

export { React, Sub }

class PureComp extends React.PureComponent { }

export function PureView(props) {
  return (
    <PureComp {...props}>
      {props.children}
    </PureComp>
  )
}

export abstract class HyduxComponent<Props, State, Actions> extends React.PureComponent<Props, { state: State }> {
  abstract init: (props: Props) => State
  abstract actions: ActionsType<State, Actions>
  abstract view: (props: Props, state: State, actions: Actions) => JSX.Element | null | false
  ctx: {
    actions: Actions,
    getState: () => State,
  }
  state = {
    state: null as any as State
  }
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.setState({
      state: this.init(this.props),
    })
    this.ctx = app<State, Actions>({
      init: () => this.init(this.props),
      actions: this.actions,
      view: noop,
      onRender: _ => {
        if (!this.ctx) {
          return
        }
        this.setState({
          state: this.ctx.getState(),
        })
      }
    })
  }

  render() {
    return this.view(this.props, this.state.state, this.ctx.actions)
  }

}

export type Props = {
  text?: string,
  onSuccess?: () => void,
  onCancel?: () => void,
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
