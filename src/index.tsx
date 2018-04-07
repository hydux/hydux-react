import * as React from 'react'
import * as ReactDOM from 'react-dom'
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
    state: State
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
          state: this.ctx.state,
        })
      }
    })
  }

  render() {
    return this.view(
      this.props,
      this.state.state,
      this.ctx.actions,
    )
  }

}

export type Props = {
  text?: string,
  onSuccess?: () => void,
  onCancel?: () => void,
}

export interface Options {
  hydrate?: boolean
}

// hack for hmr
let _container
export default function withReact<State, Actions>(
  container?,
  options?: Options,
): (app: App<State, Actions>) => App<State, Actions> {
  container = container || _container
  if (!container) {
    container = _container = document.createElement('div')
    document.body.appendChild(container)
  }
  options = {
    hydrate: false,
    ...options,
  }
  let render =
    options.hydrate
      ? ReactDOM.hydrate
      : ReactDOM.render
  return app => props => app({
    ...props,
    onRender(view) {
      props.onRender && props.onRender(view)
      // ReactDOM.render is already batched
      // if wrapped by rAF it might break input's value and onChange
      return render(view, container)
    }
  })
}
