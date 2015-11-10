/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import Status from './RequestStatus';
import { post } from './api';

/*
  state: {
  id      : Number, stored id
  name      : String, current username input
  password  : String, current paswword input
  status  : Status, status of the last request
  }
*/

const Action = Type({
  Name        : [String],
  Password    : [String],
  SaveStart   : [],
  SaveSuccess : [Object], // {id}
  SaveError   : [Object]  // {error}
});

function onInput(dispatch, action) {
  return e => dispatch(action(e.target.value));
}

function onSubmit(dispatch) {
  return e => {
    e.preventDefault();
    dispatch(Action.SaveStart());
    return false;
  }
}


const view = ({state: {id, name, password, status}, dispatch}) =>
  <form on-submit={onSubmit(dispatch)}>
    <input
      type="text"
      placeholder="User name"
      value={name}
      on-input={onInput(dispatch, Action.Name)} />

    <input
      type="password"
      placeholder="Password"
      value={password}
      on-input={onInput(dispatch, Action.Password)} />

    <button
      disabled={Status.isPending(status)}
      on-click={[dispatch, Action.SaveStart()]}>
        {id ? 'Update' : 'Add'}
    </button>

    <span classNames="status"
      class-success={Status.isSuccess(status)}
      class-error={Status.isError(status)}>
        {statusMsg(status)}
    </span>
  </form>;

const statusMsg = Status.case({
  Empty   : ()    => '',
  Pending : ()    => 'Saving user...',
  Success : id    => `User ${id} saved with success`,
  Error   : error => `Error! ${error}`
});


function init(user={name: '', password: ''}) {
  return { ...user, status: Status.Empty() };
}


function save(state, dispatch) {
  const url   = state.id ? '/admin/update' : '/api/add';
  const data = {id: state.id, name: state.name, password: state.password};
  post(url, data)
  .then(Action.SaveSuccess, Action.SaveError)
  .then(dispatch);

  return { ...state, status: Status.Pending()};
}

function update(state, action, dispatch) {
  return  Action.case({
    // Input Actions
    Name        : name      => ({ ...state, name }),
    Password    : password  => ({ ...state, password }),
    // Save Request Actions
    SaveStart   : ()        => save(state, dispatch),
    SaveSuccess : ({id})    => ({ ...state, id, status: Status.Success(id)  }),
    SaveError   : ({error}) => ({ ...state, status: Status.Error(error) })
  }, action);
}

export default { init, view, update, Action };
