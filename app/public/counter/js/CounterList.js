/** @jsx html */

import { html } from 'snabbdom-jsx';
import Counter from './Counter';
import ListModel from './ListModel';

export const model = ListModel(Counter.model);


export const view = ({state: {items}})  =>
    <div>
      <button
        on-click={model.add}>Add</button>
      <hr/>
      <div>
        { items.map(item => <CounterItem item={item} />) }
      </div>
    </div>;

const CounterItem = ({item: {id, data}}) =>
  <div key={id}>
    <Counter
      state={data}
      context={[model.update, id]} />
  </div>;
