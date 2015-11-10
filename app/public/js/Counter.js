/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';

const Action = Type({
  Increment : [],
  Decrement : [],
});


const view = ({state, dispatch}) =>
  <div>
    <button on-click={ [dispatch, Action.Increment()] }>+</button>
    <div>{state}</div>
    <button on-click={ [dispatch, Action.Decrement()] }>-</button>
  </div>;

// returns the initial state
function init() { return 0; }

// updates the state
function update(state, action) {
  return  Action.case({
    Increment : () => state + 1,
    Decrement : () => state - 1,
  }, action);
}

export default { init, view, update, Action };
