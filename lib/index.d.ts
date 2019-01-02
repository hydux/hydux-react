import * as React from 'react';
import { App, ActionsType, Sub } from 'hydux';
export { React, Sub };
export interface PureViewProps<T> {
    stateInUse: T;
    children: JSX.Element | ((p: T) => JSX.Element | null);
}
/**
 * @deprecated Deprecated for React.memo
 */
export declare class PureView<P> extends React.Component<PureViewProps<P>> {
    shouldComponentUpdate(nextProps: PureViewProps<P>, nextState: any, nextContext: any): boolean;
    render(): JSX.Element | (string & ((p: P) => JSX.Element | null)) | (number & ((p: P) => JSX.Element | null)) | (true & ((p: P) => JSX.Element | null)) | (false & ((p: P) => JSX.Element | null)) | (React.ReactNodeArray & ((p: P) => JSX.Element | null)) | null;
}
export declare class ErrorBoundary extends React.Component<{
    renderMessage?: (error: Error, errorInfo?: {
        componentStack: string;
    }) => any;
    report?: (error: Error, errorInfo?: {
        componentStack: string;
    }) => void;
    children: any;
}> {
    state: {
        error: Error | undefined;
        errorInfo: {
            componentStack: string;
        } | undefined;
    };
    report(error: any, errorInfo: any): void;
    render(): any;
    componentDidCatch(error: Error, errorInfo: {
        componentStack: string;
    }): void;
}
export declare abstract class HyduxComponent<Props, State, Actions> extends React.PureComponent<Props, {
    state: State;
}> {
    abstract init: (props: Props) => State;
    abstract actions: ActionsType<State, Actions>;
    abstract view: (props: Props, state: State, actions: Actions) => JSX.Element | null | false;
    ctx: {
        actions: Actions;
        state: State;
    };
    state: {
        state: State;
    };
    constructor(props: any);
    componentWillMount(): void;
    render(): false | JSX.Element | null;
}
export declare type Props = {
    text?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
};
export interface Options {
    hydrate?: boolean;
    /**
     * In component mode, hydux-react will mount the hydux state in a root react component, so we can modify the state in React Devtools.
     */
    useComponent?: boolean;
}
export default function withReact<State, Actions>(container?: any, options?: Options): (app: App<State, Actions>) => App<State, Actions>;
