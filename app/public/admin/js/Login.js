/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import Status from './RequestStatus';
import { login } from './api';

/*
  state: {
    name      : String, current username input
    password  : String, current paswword input
    status    : Status, status of the last request
  }
*/

const Action = Type({
  Name        : [String],
  Password    : [String],
  LoginStart  : [],
  LoginSuccess: [Object],
  LoginError  : [Object]
});

function onInput(dispatch, action) {
  return e => dispatch(action(e.target.value));
}

function onSubmit(dispatch) {
  return e => {
    e.preventDefault();
    dispatch(Action.LoginStart());
    return false;
  }
}

const view = ({state: {name, password, status}, dispatch}) =>
  <div classNames="login">
    <form on-submit={onSubmit(dispatch)}>
      <h1>Login</h1>

      <input classNames="name"
        type="text"
        placeholder="User name"
        value={name}
        on-input={onInput(dispatch, Action.Name)} />

      <input classNames="password"
        type="password"
        placeholder="Password"
        value={password}
        on-input={onInput(dispatch, Action.Password)} />

      <div classNames="status"
        class-success={Status.isSuccess(status)}
        class-error={Status.isError(status)}
        >{statusMsg(status)}</div>

      <button disabled={Status.isPending(status)} >Sign in</button>
    </form>;
  </div>

const statusMsg = Status.case({
  Empty   : ()    => '',
  Pending : ()    => 'Logging in ...',
  Success : msg   => 'Login Successfull',
  Error   : error => error
});


function init() {
  return { name: '', password: '', status: Status.Empty() };
}


function save(state, dispatch) {
  login(state.name, state.password)
  .then( _ => window.location.hash = '/admin')
  .catch(err => dispatch(Action.LoginError(err)))

  return { ...state, status: Status.Pending()};
}

function update(state, action, dispatch) {
  return  Action.case({
    // Input actions
    Name          : name      => ({ ...state, name }),
    Password      : password  => ({ ...state, password }),
    // Login Request actions
    LoginStart    : ()        => save(state, dispatch),
    LoginError    : ({error}) => ({ ...state, status: Status.Error(error) })
  }, action);
}

export default { init, view, update, Action };
