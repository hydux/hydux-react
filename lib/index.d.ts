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
        getState(): State;
        render: (state?: State | undefined) => void;
        init: () => State | [State, Sub<Actions>[]];
        view: (state: State, actions: Actions) => any;
        subscribe?: ((state: State) => Sub<Actions>[]) | undefined;
        onRender?: ((view: any) => void) | undefined;
        onError?: ((err: Error) => void) | undefined;
        onUpdate?: (<M>(data: {
            prevAppState: State;
            nextAppState: State;
            msgData: M;
            action: string;
        }) => void) | undefined;
    };
    constructor(props: any);
    render(): false | JSX.Element | null;
}
export declare type Props = {
    text?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
};
export default function withReact<State, Actions>(container?: any): (app: App<State, Actions>) => App<State, Actions>;
