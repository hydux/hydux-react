# hydux-react
React renderer for hydux.

## Install
```sh
yarn add hydux hydux-react # or npm i hydux hydux-react
```

## Usage


```js
import _app from 'hydux'
import withPersist from 'hydux/lib/enhancers/persist'
import withReact, { React } from 'hydux-react'

let app = withReact()(_app)

export default app({
  init: () => { count: 1 },
  actions: {
    down: () => state => ({ count: state.count - 1 }),
    up: () => state => ({ count: state.count + 1 })
  },
  view: (state: State, actions: Actions) =>
    <div>
      <h1>{state.count}</h1>
      <button onClick={actions.down}>–</button>
      <button onClick={actions.up}>+</button>
    </div>
})
```

## Helpers

### PureView

[React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) helper, with which the component uses a shallow prop comparison to determine whether to re-render, which in turn prevents unnecessary re-rendering.

```tsx

import { PureView } from 'hydux-react'

export function View(props) {
  return (
    <PureView stateInUse={props}> // The props passed to PureView would be shallow compared and determine whether diff and render child components.
      {(props) => <ChildComponent {...props} />} // here we pass function as children to avoid executing child components' render function.
    </PureView>
  )
}

```

## ErrorBoundary

We can use the ErrorBoundary component to catch children's error, which requires a [React 16 feature](https://reactjs.org/docs/error-boundaries.html).

```tsx
import { ErrorBoundary } from 'hydux-react'

export function View(props) {
  return (
    <ErrorBoundary
      report={(error, errorInfo) => void} // Custom error handler function
      renderMessage={(error, errorInfo) => React.ChildNode} // Custom error message renderer, default is `return null`
    >
      {() => <ChildComponent {...props} />} // here we pass function as children to catch errors in child components' render function.
    </ErrorBoundary>
  )
}
```


## Counter App

```sh
git clone https://github.com/hydux/hydux-react.git
cd examples/counter
yarn # or npm i
npm start
```

Now open http://localhost:8080 and hack!

## License

MIT
