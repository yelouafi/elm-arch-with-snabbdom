/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import UserForm from './UserForm';
import Status from './RequestStatus';
import { get, post } from './api';

/*
  state: {
    items   : [{id: Number, user: UserForm}],
    nextId  : Number,
    status  : Status
  }
*/

const Action = Type({
  Add             : [],
  Update          : [Number, UserForm.Action],
  GetUsersSuccess : [Array],
  GetUsersError   : [Object]
});

function userDispatcher(id, dispatch) {
  return action => dispatch(Action.Update(id, action));
}

const view = ({state, dispatch}) =>
  <div classNames="admin">
    <button on-click={[dispatch, Action.Add()]}>Add</button>
    <span>{statusMsg(state.status)}</span>
    <hr />
    <div>{
      state.items.map( item => <UserItem item={item} dispatch={dispatch} />)
    }</div>
  </div>;

const UserItem = ({item, dispatch}) =>
  <div key={item.id} classNames="item">
    <UserForm state={item.user} dispatch={userDispatcher(item.id, dispatch)}  />
  </div>

const statusMsg = Status.case({
  Pending : ()    => 'Getting user list...',
  Error   : error => `Error! ${error}`,
  _       : () => ''
});

function init(dispatch) {
  get('/api/list')
  .then(Action.GetUsersSuccess, Action.GetUsersError)
  .then(dispatch);

  return { items: [], nextId: 1, status: Status.Pending() };
}

function addUser(state) {
  return {...state,
    items: [...state.items, {
      id: state.nextId,
      user: UserForm.init()
    }],
    nextId: state.nextId + 1
  };
}

function updateUser(id, userState, userAction, dispatch) {
  return UserForm.update(userState, userAction, userDispatcher(id, dispatch));
}

function updateUserList(state, id, userAction, dispatch) {
  const items = state.items.map( item =>
    id !== item.id ? item :
                     {...item, user: updateUser(id, item.user, userAction, dispatch)});

  return {...state, items };
}

function refreshUsers(state, users) {
  return {
    items   : users.map( (user, idx) => ({id: idx+1, user: UserForm.init(user)}) ),
    nextId  : users.length + 1,
    status  : Status.Success('')
  };
}

function update(state, action, dispatch) {
  return  Action.case({
    Add             : () => addUser(state),
    Update          : (id, userAction) => updateUserList(state, id, userAction, dispatch),
    // GetUsers Request Actions
    GetUsersSuccess : users     => refreshUsers(state, users),
    GetUsersError   : ({error}) => ({...state, status: Status.Error(error) })
  }, action);
}



export default { init, view, update, Action };
