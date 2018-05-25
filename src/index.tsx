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
  /**
   * In debug mode, hydux-react will mount the hydux state in a root react component, so we can modify the state in React Devtools.
   */
  debug?: boolean
}

// hack for hmr
let _container
let mounted = false
export default function withReact<State, Actions>(
  container?,
  options: Options = {},
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
  const UpdateEvent = '@hydux-react/update-state'
  if (options.debug) {
    class Root extends React.Component {
      state = {}
      actions: any
      view: ((s: any, a: any) => any) = () => null
      componentDidMount() {
        document.addEventListener(UpdateEvent, (e: CustomEvent) => {
          this.view = e.detail[0]
          this.actions = e.detail[2]
          this.setState(e.detail[1])
        })
      }
      render() {
        return this.view(this.state, this.actions)
      }
    }
    if (!mounted) {
      mounted = true
      render(<Root />, container)
    }
  }

  return app => props => app({
    ...props,
    view:
      options!.debug ? (
        (state, actions) => {
          return [props.view, state, actions]
        }
      ) : props.view,
    onRender(view) {
      props.onRender && props.onRender(view)
      if (options!.debug) {
        document.dispatchEvent(new CustomEvent(UpdateEvent, {
          detail: view
        }))
        return
      }
      // ReactDOM.render is already batched
      // if wrapped by rAF it might break input's value and onChange
      return render(view, container)
    }
  })
}
