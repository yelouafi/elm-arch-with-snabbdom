/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';

const Action = Type({
  Increment: [],
  Decrement: []
})

const view = ({state, dispatch}) =>
    <div>
      <button on-click={[dispatch, Action.Increment()]}>+</button>
      <div>{state}</div>
      <button on-click={[dispatch, Action.Decrement()]}>-</button>
    </div>;

const init = () => 0;

const update = (state, action) => Action.case({
  Increment: () => state + 1,
  Decrement: () => state - 1
}, action);

export default { init, update, view, Action };
