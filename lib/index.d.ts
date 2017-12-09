import React from 'react';
import { App } from 'hydux';
export { React };
export default function withReact<State, Actions>(container: any): (app: App<State, Actions>) => App<State, Actions>;
