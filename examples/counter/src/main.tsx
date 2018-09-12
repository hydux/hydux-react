import * as Hydux from 'hydux'
import withPersist from 'hydux/lib/enhancers/persist'
import withReact, { React, ErrorBoundary } from '../../../src/index'
import { ActionsType } from 'hydux/lib/types'
import './polyfill.js'
import Intro from './intro'
import Counter, { State as CounterState, Actions as CounterActions } from './counter'
import CounterComp from './comp'

// let app = withPersist<State, Actions>({
//   key: 'time-game/v1'
// })(_app)
let app = withReact<State, Actions>(void 0, {
  useComponent: true,
})(Hydux.app as any) // HACK for different version of hydux

if (process.env.NODE_ENV === 'development') {
  const devTools = require('hydux/lib/enhancers/devtools').default
  const logger = require('hydux/lib/enhancers/logger').default
  const hmr = require('hydux/lib/enhancers/hmr').default
  app = logger()(app)
  app = devTools()(app)
  app = hmr()(app)
}

const actions = {
  counter1: Counter.actions,
  counter2: Counter.actions,
}

const state = {
  counter1: Counter.init(),
  counter2: Counter.init(),
}

function ErrorTest(props) {
  let fn = () => {
    throw new Error('test error boundary')
  }
  fn()
  return null
}

class ErrorTest2 extends React.Component {
  componentDidMount() {
    throw new Error('error test')
  }

  render() {
    return 'error test2'
  }
}

type Actions = typeof actions
type State = typeof state
const view = (state: State, actions: Actions) =>
    <main>
      <button onClick={actions.counter1.up}>up counter1</button>
      <button onClick={actions.counter2.up}>up counter2</button>
      <h1>Counter1:</h1>
      {Counter.view(state.counter1, actions.counter1)}
      <h1>Counter2:</h1>
      {Counter.view(state.counter2, actions.counter2)}
      <h1>Counter HyduxComponent:</h1>
      <CounterComp init={10} />
      <Intro />
      <ErrorBoundary renderMessage={err => `[ErrorBoundary caught]: ${err.message}`}>
        {() => <ErrorTest />}
      </ErrorBoundary>
      <ErrorBoundary renderMessage={err => `[ErrorBoundary caught]: ${err.message}`}>
        {() => <ErrorTest2 />}
      </ErrorBoundary>
    </main>

export default app({
  init: () => state,
  actions,
  view,
})
