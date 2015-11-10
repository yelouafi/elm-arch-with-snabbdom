/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import Login from './Login';
import UserList from './UserList';

/*
  state: {
    { route1: component1, ...}
    currentRoute: String,
    currentState: Object
  }
*/

const DEFAULT_ROUTE = '/login';

const Action = Type({
  Navigate: [String],
  Update  : [Object]
});

function componentDispatcher(dispatch) {
  return action => dispatch(Action.Update(action));
}

const view = ({state: {routes, currentRoute, currentState}, dispatch}) =>
  <div classNames="view">{
    routes[currentRoute].view({
      state: currentState,
      dispatch: componentDispatcher(dispatch)
    })
  }</div>

function init(dispatch) {
  window.addEventListener('hashchange', _ =>
    dispatch(Action.Navigate(window.location.hash.substr(1) || DEFAULT_ROUTE))
  );
  return navigate(
    {routes: { '/login': Login, '/admin': UserList }},
    window.location.hash.substr(1) || DEFAULT_ROUTE,
    dispatch);
}

function navigate(state, currentRoute, dispatch) {
  const component = state.routes[currentRoute] || DEFAULT_ROUTE;
  return {...state,
    currentRoute,
    currentState: component.init(componentDispatcher(dispatch))
  }
}

function updateComponent(state, action, dispatch) {
  const component = state.routes[state.currentRoute];
  return {...state,
    currentState: component.update(state.currentState, action, componentDispatcher(dispatch))
  }
}


function update(state, action, dispatch) {
  return  Action.case({
    Navigate: route             => navigate(state, route, dispatch),
    Update  : componentAction   => updateComponent(state, componentAction, dispatch)
  }, action);
}

export default { init, view, update, Action };
