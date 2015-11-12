/** @jsx html */

import { html } from 'snabbdom-jsx';

const KEY_ENTER = 13;

const model = {
  init        : (id, title) => ({ id, title, done: false, editing: false, editingValue: '' }),
  title       : (task, title) => ({...task, title}),
  done        : (task, done) => ({...task, done}),
  startEdit   : task => ({...task, editing: true, editingValue: task.title}),
  commitEdit  : task => ({...task, title, editing: false,  editingValue: ''}),
  cancelEdit  : task => ({...task, editing: false,  editingValue: ''})
}

const targetChecked = e => e.target.checked;
const targetValue = e => e.target.value;

function onInput(state, e) {
  if(e.keyCode === KEY_ENTER)
    model.CommitEdit(e.target.value))
}

const view = ({state: {title, done, editing, editingValue}, context, onRemove}) =>
    <li
      key={model.id}
      class-completed={!!done && !editing}
      class-editing={editing}>

      <div classNames="view">
        <input
          classNames="toggle"
          type="checkbox"
          checked={!!done}
          on-click={} />

        <label
          on-dblclick={ bind(handler, Action.StartEdit()) }>{model.title}</label>

        <button
          classNames="destroy"
          on-click={onRemove} />
      </div>

      <input
        classNames="edit"
        value={model.title}
        on-blur={ bind(handler, Action.CancelEdit()) }
        on-keydown={ bind(onInput, handler) } />
    </li>
