/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import UserForm from './UserForm';
import Status from './RequestStatus';
import { UpdateResult, pure, withEffects } from './UpdateResult';
import api from './api';

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
  GetUsers        : [],
  GetUsersSuccess : [Array],
  GetUsersError   : [Object]
});

const Effect = Type({
  GetUsers: [],
  UserForm: [Number, UserForm.Effect]
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

function receiveUsers(state, users) {
  const items = users.map( (user, idx) => ({ id: idx + 1, user }) );
  return pure({
    items,
    nextId: items.length + 1,
    status: Status.Success('')
  });
}

function getUsers(dispatch) {
  api.getUsers()
  .then(Action.GetUsersSuccess, Action.GetUsersError)
  .then(dispatch);
}

function addUserPure(state, user) {
  return {...state,
    users: [...state.users, {id: state.nextId, user}],
    nextId: state.nextId + 1
  };
}

function addUser(state) {
  const result = UserForm.init();
  return UpdateResult.case({
    Pure : user => pure(addUserPure(state, user)),
    WithEffects : (user, eff) => {
      const state = addUserPure(state, user);
      return withEffects(state, Effect.UserForm(state.nextId-1, eff));
    }
  }, result);
}

function updateUserPure(state, user, id) {
  return {...state,
    items: state.items.map(it => it.id !== id ? it : { id: it.id, user })
  };
}

function updateUser(state, id, userAction) {
  const item = state.items.find(it => it.id === id);
  if(item) {
    const result = UserForm.update(item.user, userAction);
    return UpdateResult.case({
      Pure : user => pure(updateUserPure(state, user, id)),
      WithEffects : (user, eff) => {
        const state = updateUserPure(state, user, id);
        return withEffects(state, Effect.UserForm(id, eff));
      }
    }, result);
  }
  return pure(state);
}

const init = () =>
    withEffects(
      { nextId: 1, items: [], status: Status.Pending() },
      Effect.GetUsers()
    );

function update(state, action) {
  return  Action.case({
    Add    : () => addUser(state),
    Update : (id, userAction) => updateUser(state, id, userAction),
    // GetUsers Request Actions
    GetUsers        : () => withEffects(
                              {...state, status: Status.Pending()},
                              Effect.GetUsers()
                            ),
    GetUsersSuccess : users => receiveUsers(state, users),
    GetUsersError   : error => pure({...state, status: Status.Error(error) })
  }, action);
}

function execute(state, effect, dispatch) {
  Effect.case({
    GetUsers: () => getUsers(dispatch),
    UserForm: (id, eff) => {
      const item = state.items.find(it => it.id === id);
      if(item)
        UserForm.execute(item.user, eff, userDispatcher(dispatch, id))
    }
  }, effect);
}



export default { init, view, update, Action, execute, Effect };
