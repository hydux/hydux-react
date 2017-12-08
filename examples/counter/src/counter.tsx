import { React } from '../../../src/index'
import { Cmd, noop } from 'hydux'
const initState = { count: 0 }
const counter = {

  init: () => initState,
  actions: {
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
  },
  view: (state: State) => (actions: Actions) =>
    <div>
      <h1>{state.count}</h1>
      <button onClick={_ => actions.down()}>–</button>
      <button onClick={_ => actions.up()}>+</button>
      <button onClick={_ => actions.upLater()}>+ later</button>
    </div>
}
export default counter
export type Actions = typeof counter.actions
export type State = typeof initState
