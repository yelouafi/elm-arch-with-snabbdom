/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import App from './CounterList';

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('./on')(dispatch)
]);


var state = App.init(),
    vnode = document.getElementById('placeholder');

function updateUI() {
  const newVnode = <App state={state} />;
  vnode = patch(vnode, newVnode);
  //console.log(vnode);
}

export function dispatch(action) {
  if(typeof action === 'function')
    action(dispatch, state);
  else
    state = App.update(state, action);
  updateUI();
}

updateUI();
