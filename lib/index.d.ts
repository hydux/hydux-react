/// <reference types="react" />
import * as React from 'react';
import { App, ActionsType, Sub } from 'hydux';
export { React, Sub };
export declare function PureView(props: any): JSX.Element;
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
}
export default function withReact<State, Actions>(container?: any, options?: Options): (app: App<State, Actions>) => App<State, Actions>;
