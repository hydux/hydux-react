import { React, HyduxComponent } from '../../../src/index'
import { Cmd, noop } from 'hydux'
const initState = { count: 0 }

const init = (props: Props) => ({ count: props.init })
const actions = {
  down: () => state => ({ count: state.count - 1 }),
  up: () => state => ({ count: state.count + 1 }),
  upN: n => state => ({ count: state.count + n }),
  upLater: () => state => actions =>
    [ state,
      Cmd.ofPromise(
        n => {
          return new Promise(resolve =>
            setTimeout(() => resolve(n), 1000))
        },
        10,
        actions.upN) ]
}
const view = (props: Props, state: State, actions: Actions) => (
  <div>
    <h1>{state.count}</h1>
    <div>Init: {props.init}</div>
    <button onClick={_ => actions.down()}>–</button>
    <button onClick={_ => actions.up()}>+</button>
    <button onClick={_ => actions.upLater()}>+ later</button>
  </div>
)
export type Actions = typeof actions
export type State = typeof initState
export type Props = {
  init: number
}
export default class Counter extends HyduxComponent<Props, State, Actions> {
  init = init
  actions = actions
  view = view
}
