/** @jsx html */

import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import { UpdateResult, pure, withEffects } from './UpdateResult';
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
const routes =  {
  '/login': Login,
  '/admin': UserList
};
const T = () => true;

const Action = Type({
  Navigate: [String],
  Update  : [T]
});

const Effect = Type({
  Init: [T],
  Child: [T]
});

function componentDispatcher(dispatch) {
  return action => dispatch(Action.Update(action));
}

const view = ({
  state: {routes, currentRoute, currentState},
  dispatch
}) =>

  <div classNames="view">{
    routes[currentRoute].view({
      state: currentState,
      dispatch: componentDispatcher(dispatch)
    })
  }</div>

function initPure(currentState) {
  return {
    routes,
    currentRoute: DEFAULT_ROUTE,
    currentState
  };
}

function init() {
  const component = routes[DEFAULT_ROUTE],
        result    = component.init();

  return UpdateResult.case({
    Pure: currentState =>
        withEffects(initPure(currentState), Effect.Init(null)),
    WithEffects: (currentState, eff) =>
        withEffects(initPure(currentState), Effect.Init(eff))
  }, result);
}

function navigatePure(state, currentRoute, currentState) {
  return {...state,
    currentRoute,
    currentState
  };
}

function navigate(state, currentRoute) {
  const component = state.routes[currentRoute] || DEFAULT_ROUTE,
        result    = component.init();

  return UpdateResult.case({
    Pure: currentState =>
        pure(navigatePure(state, currentRoute, currentState)),
    WithEffects: (currentState, eff) =>
        withEffects(
          navigatePure(state, currentRoute, currentState),
          Effect.Child(eff))
  }, result);
}

function updateComponentPure(state, currentState) {
  return {...state, currentState };
}

function updateComponent(state, action) {
  const component = state.routes[state.currentRoute],
        result    = component.update(state.currentState, action);

  return UpdateResult.case({
    Pure: currentState =>
        pure(updateComponentPure(state, currentState)),
    WithEffects: (currentState, eff) =>
        withEffects(
          updateComponentPure(state, currentState),
          Effect.Child(eff))
  }, result);

}


function update(state, action) {
  return  Action.case({
    Navigate: route => navigate(state, route),
    Update  : componentAction => updateComponent(state, componentAction)
  }, action);
}

function executeInit(state, childEff, dispatch) {
  window.addEventListener('hashchange', () =>
    dispatch(Action.Navigate(window.location.hash.substr(1) || DEFAULT_ROUTE))
  );

  if(childEff) {
    const component = state.routes[state.currentRoute];
    component.execute(state.currentState, childEff, componentDispatcher(dispatch))
  }
}

function execute(state, effect, dispatch) {
  Effect.case({
    Init: childEff => executeInit(state, childEff, dispatch),
    Child: eff => {
      const component = state.routes[state.currentRoute];
      component.execute(state.currentState, eff, componentDispatcher(dispatch))
    }
  }, effect);
}

export default { view, init, update, Action, execute, Effect };
