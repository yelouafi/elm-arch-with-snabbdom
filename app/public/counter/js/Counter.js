/** @jsx html */

import { html } from 'snabbdom-jsx';
import { contract, pipe } from './helpers';

const [update, actions] = contract({
  increment : ({count}) => ({count: count + 1}),
  decrement : ({count}) => ({count: count - 1}),
  setCount  : (_, value) => ({count: value}),
  startInc  : ({count}) => ({count, pending: true})
});

function asyncInc(){
  return  dispatch => {
    dispatch(actions.startInc());
    setTimeout(() => dispatch(actions.increment()), 2000);
  };
}

const inputValue = e => e.target.value;

const init = () => ({count: 0});

const view = ({state, ctx}) =>
    <div>
      <input type="number" on-change={[pipe(inputValue, actions.setCount), ctx]}
      <button on-click={[actions.increment, ctx]}>+</button>
      <div>{state.count}</div>
      <button on-click={[actions.decrement, ctx]}>-</button>
      <button disabled={state.pending} on-click={[asyncInc, ctx]}>+ (async)</button>
    </div>;

export default { init, update, view, actions };
