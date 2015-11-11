/** @jsx html */

import { html } from 'snabbdom-jsx';

const model = {
  init      : () => ({value: 0, n: 0}),
  value     : (state, e) => ({...state, value}),
  increment : state => ({...state, n: state.n+state.value})
};

const targetVal = (state, e) => model.value(state, +e.target.value)

const view = ({state, context}) =>
    <div>
      <input type="number" on-input={[context, model.value]} value={state.value} />
      <button on-click={[context, model.increment]}>+</button>
      <div>{state.n}</div>
    </div>;

export default { model, view };
