/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import Counter from './Counter';

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
]);


var state = Counter.init(),
    vnode = document.getElementById('placeholder');

function updateUI() {
  const newVnode = <Counter state={state} dispatch={dispatch} />;
  vnode = patch(vnode, newVnode);
}

function dispatch(action) {
  state = Counter.update(state, action, dispatch);
  updateUI();
}

updateUI();
