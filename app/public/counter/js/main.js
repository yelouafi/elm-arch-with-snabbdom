import snabbdom from 'snabbdom';
import {view, model} from './CounterList';

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('./on')(dispatch),
]);


var state = model.init(),
    vnode = document.getElementById('placeholder');

function updateUI() {
  const newVnode = view({state});
  vnode = patch(vnode, newVnode);
}

function dispatch(action, ...args) {
  if(Array.isArray(action)) {
    const [ctxtAction, ...ctxtArgs] = action;
    state = ctxtAction(state, ...ctxtArgs, ...args);
  } else
    state = action(state, ...args);
  updateUI();
}

updateUI();
