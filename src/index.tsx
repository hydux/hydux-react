import * as React from 'react'
import * as ReactDOM from 'react-dom'
import app, { App, ActionsType, noop, Sub } from 'hydux'

export { React, Sub }

function shallowDiffers (a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (i !== 'children' && a[i] !== b[i]) return true
  return false
}

export class PureView<P = any,S = any> extends React.Component<P, S> {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return shallowDiffers(this.props, nextProps)
  }
  render() {
    const { children } = this.props
    return typeof children === 'function' ? (children as any)() : children
  }
}

export class ErrorBoundary extends React.Component<{
  renderMessage?: (error: Error, errorInfo?: { componentStack: string }) => any
  report?: (error: Error, errorInfo?: { componentStack: string }) => void
  children: any
}> {
  state = {
    error: void 0 as Error | undefined,
    errorInfo: void 0 as { componentStack: string } | undefined
  }
  report(error, errorInfo) {
    const { report } = this.props
    if (report) {
      return report(error, errorInfo)
    }
    console.error(error, errorInfo)
  }
  render() {
    let { error, errorInfo } = this.state
    const { report, renderMessage, children } = this.props
    if (!error) {
      try {
        return typeof children === 'function' ? children() : children
      } catch (err) {
        error = err
        this.report(error, errorInfo)
      }
    }
    return renderMessage ? renderMessage(error!, errorInfo) : null
  }
  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.setState({ error, errorInfo })
    this.report(error, errorInfo)
  }
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
   * In component mode, hydux-react will mount the hydux state in a root react component, so we can modify the state in React Devtools.
   */
  useComponent?: boolean
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
  if (options.useComponent) {
    class Root extends React.Component {
      state = {
        state: {},
        actions: {},
        view: (s, a) => null,
      }
      actions: any
      view: ((s: any, a: any) => any) = () => null
      componentDidMount() {
        document.addEventListener(UpdateEvent, (e: CustomEvent) => {
          this.setState(e.detail)
        })
      }
      render() {
        return this.state.view(
          this.state.state,
          this.state.actions,
        )
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
      options!.useComponent ? (
        (state, actions) => {
          return {
            view: props.view,
            state,
            actions,
          }
        }
      ) : props.view,
    onRender(view) {
      props.onRender && props.onRender(view)
      if (options!.useComponent) {
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
