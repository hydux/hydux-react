import { App } from 'hydux';
export declare const React: {
    createElement: any;
};
export declare function PureView(props: any): any;
export default function withReact<State, Actions>(container?: any): (app: App<State, Actions>) => App<State, Actions>;
