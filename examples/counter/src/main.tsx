import _app from 'hydux'
import withPersist from 'hydux/lib/enhancers/persist'
import withReact, { React } from '../../../src/index'
import { ActionsType } from 'hydux/lib/types'
import './polyfill.js'
import Intro from './intro'
import Counter, { State as CounterState, Actions as CounterActions } from './counter'
import CounterComp from './comp'

// let app = withPersist<State, Actions>({
//   key: 'time-game/v1'
// })(_app)
let app = withReact<State, Actions>(void 0, {
  debug: true
})(_app)

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

type Actions = typeof actions
type State = typeof state
const view = (state: State, actions: Actions) =>
    <main>
      <h1>Counter1:</h1>
      {Counter.view(state.counter1, actions.counter1)}
      <h1>Counter2:</h1>
      {Counter.view(state.counter2, actions.counter2)}
      <h1>Counter HyduxComponent:</h1>
      <CounterComp init={10} />
      <Intro />
    </main>

export default app({
  init: () => state,
  actions,
  view,
})
