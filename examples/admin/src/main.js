/** @jsx html */

import { html } from 'snabbdom-jsx';
import snabbdom from 'snabbdom';
import { UpdateResult } from './UpdateResult';
import App from './App';

const patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventListeners')
]);


var state,
    vnode = document.getElementById('placeholder');

function updateUI() {
  const newVnode = <App state={state} dispatch={dispatch} />;
  vnode = patch(vnode, newVnode);
}

function updateStatePure(newState) {
  //console.log(newState)
  state = newState;
  updateUI();
}

function updateStateWithEffect(newState, effect) {
  updateStatePure(newState);
  App.execute(state, effect, dispatch);
}

function handleUpdateResult(updateResult) {
  UpdateResult.case({
    Pure        : updateStatePure,
    WithEffects : updateStateWithEffect
  }, updateResult);
}

export function dispatch(action) {
  const updateResult = App.update(state, action);
  handleUpdateResult(updateResult);
}

handleUpdateResult(App.init());
