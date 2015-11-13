/** @jsx html */

import { html } from 'snabbdom-jsx';
import Counter from './Counter';
import { contract, pipe, withContext, getter } from './helpers';

const [update, actions] = contract({
  addItem: state => ({...state,
    nextID: state.nextID+1,
    items: [...state.items, {id: state.nextID, data: Counter.init()}]
  }),
  updateItem: (state, id, action) => ({...state,
    items: state.items.map(it => it.id !== id ? it : {
        id,
        data: Counter.update(it.data, action)
    })
  })
});

function itemContext(id) {
  return withContext(
    actions.updateItem,
    getter(`/items/${id}/data`),
    id);
}

const view = ({state: {items}})  =>
    <div>
      <button on-click={actions.addItem}>Add</button>
      <hr/>
      <div>
        { items.map(item => <CounterItem item={item} />) }
      </div>
    </div>;

const CounterItem = ({item: {id, data}}) =>
  <div key={id}>
    <Counter state={data} ctx={itemContext(id)} />
  </div>;

const init = () => ({nextID: 1, items: []});

export default { init, update, view  }
