/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import Login from './Login';

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
]);


var state = Login.init(),
    vnode = document.getElementById('placeholder');

function updateUI() {
  const newVnode = <Login state={state} dispatch={dispatch} />;
  vnode = patch(vnode, newVnode);
}

function dispatch(action) {
  state = Login.update(state, action, dispatch);
  updateUI();
}

updateUI();
