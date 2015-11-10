/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import App from './App';

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
]);


var state = App.init(dispatch),
    vnode = document.getElementById('placeholder');

function updateUI() {
  const newVnode = <App state={state} dispatch={dispatch} />;
  vnode = patch(vnode, newVnode);
}

function dispatch(action) {
  state = App.update(state, action, dispatch);
  updateUI();
}

updateUI();
