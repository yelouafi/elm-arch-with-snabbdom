(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /** @jsx html */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _snabbdomJsx = require('snabbdom-jsx');

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

var _UpdateResult = require('./UpdateResult');

var _Login = require('./Login');

var _Login2 = _interopRequireDefault(_Login);

var _UserList = require('./UserList');

var _UserList2 = _interopRequireDefault(_UserList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  state: {
    { route1: component1, ...}
    currentRoute: String,
    currentState: Object
  }
*/

var DEFAULT_ROUTE = '/login';
var routes = {
  '/login': _Login2.default,
  '/admin': _UserList2.default
};
var T = function T() {
  return true;
};

var Action = (0, _unionType2.default)({
  Navigate: [String],
  Update: [T]
});

var Effect = (0, _unionType2.default)({
  Init: [T],
  Child: [T]
});

function componentDispatcher(dispatch) {
  return function (action) {
    return dispatch(Action.Update(action));
  };
}

var view = function view(_ref) {
  var _ref$state = _ref.state;
  var routes = _ref$state.routes;
  var currentRoute = _ref$state.currentRoute;
  var currentState = _ref$state.currentState;
  var dispatch = _ref.dispatch;
  return (0, _snabbdomJsx.html)(
    'div',
    { classNames: 'view' },
    routes[currentRoute].view({
      state: currentState,
      dispatch: componentDispatcher(dispatch)
    })
  );
};

function initPure(currentState) {
  return {
    routes: routes,
    currentRoute: DEFAULT_ROUTE,
    currentState: currentState
  };
}

function init() {
  var component = routes[DEFAULT_ROUTE],
      result = component.init();

  return _UpdateResult.UpdateResult.case({
    Pure: function Pure(currentState) {
      return (0, _UpdateResult.withEffects)(initPure(currentState), Effect.Init(null));
    },
    WithEffects: function WithEffects(currentState, eff) {
      return (0, _UpdateResult.withEffects)(initPure(currentState), Effect.Init(eff));
    }
  }, result);
}

function navigatePure(state, currentRoute, currentState) {
  return _extends({}, state, {
    currentRoute: currentRoute,
    currentState: currentState
  });
}

function navigate(state, currentRoute) {
  var component = state.routes[currentRoute] || DEFAULT_ROUTE,
      result = component.init();

  return _UpdateResult.UpdateResult.case({
    Pure: function Pure(currentState) {
      return (0, _UpdateResult.pure)(navigatePure(state, currentRoute, currentState));
    },
    WithEffects: function WithEffects(currentState, eff) {
      return (0, _UpdateResult.withEffects)(navigatePure(state, currentRoute, currentState), Effect.Child(eff));
    }
  }, result);
}

function updateComponentPure(state, currentState) {
  return _extends({}, state, { currentState: currentState });
}

function updateComponent(state, action) {
  var component = state.routes[state.currentRoute],
      result = component.update(state.currentState, action);

  return _UpdateResult.UpdateResult.case({
    Pure: function Pure(currentState) {
      return (0, _UpdateResult.pure)(updateComponentPure(state, currentState));
    },
    WithEffects: function WithEffects(currentState, eff) {
      return (0, _UpdateResult.withEffects)(updateComponentPure(state, currentState), Effect.Child(eff));
    }
  }, result);
}

function update(state, action) {
  return Action.case({
    Navigate: function Navigate(route) {
      return navigate(state, route);
    },
    Update: function Update(componentAction) {
      return updateComponent(state, componentAction);
    }
  }, action);
}

function executeInit(state, childEff, dispatch) {
  window.addEventListener('hashchange', function () {
    return dispatch(Action.Navigate(window.location.hash.substr(1) || DEFAULT_ROUTE));
  });

  if (childEff) {
    var component = state.routes[state.currentRoute];
    component.execute(state.currentState, childEff, componentDispatcher(dispatch));
  }
}

function execute(state, effect, dispatch) {
  Effect.case({
    Init: function Init(childEff) {
      return executeInit(state, childEff, dispatch);
    },
    Child: function Child(eff) {
      var component = state.routes[state.currentRoute];
      component.execute(state.currentState, eff, componentDispatcher(dispatch));
    }
  }, effect);
}

exports.default = { view: view, init: init, update: update, Action: Action, execute: execute, Effect: Effect };

},{"./Login":2,"./UpdateResult":4,"./UserList":6,"snabbdom-jsx":17,"union-type":25}],2:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /** @jsx html */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _snabbdomJsx = require('snabbdom-jsx');

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

var _RequestStatus = require('./RequestStatus');

var _RequestStatus2 = _interopRequireDefault(_RequestStatus);

var _UpdateResult = require('./UpdateResult');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  state: {
    name      : String, current username input
    password  : String, current paswword input
    status    : Status, status of the last request
  }
*/

var Action = (0, _unionType2.default)({
  Name: [String],
  Password: [String],
  Login: [],
  LoginError: [String]
});

var Effect = (0, _unionType2.default)({
  Login: []
});

function onInput(dispatch, action) {
  return function (e) {
    return dispatch(action(e.target.value));
  };
}

function onSubmit(dispatch) {
  return function (e) {
    e.preventDefault();
    dispatch(Action.Login());
    return false;
  };
}

var view = function view(_ref) {
  var _ref$state = _ref.state;
  var name = _ref$state.name;
  var password = _ref$state.password;
  var status = _ref$state.status;
  var dispatch = _ref.dispatch;
  return (0, _snabbdomJsx.html)(
    'div',
    { classNames: 'login' },
    (0, _snabbdomJsx.html)(
      'form',
      { 'on-submit': onSubmit(dispatch) },
      (0, _snabbdomJsx.html)(
        'h1',
        null,
        'Login'
      ),
      (0, _snabbdomJsx.html)('input', { classNames: 'name',
        type: 'text',
        placeholder: 'User name',
        value: name,
        'on-input': onInput(dispatch, Action.Name) }),
      (0, _snabbdomJsx.html)('input', { classNames: 'password',
        type: 'password',
        placeholder: 'Password',
        value: password,
        'on-input': onInput(dispatch, Action.Password) }),
      (0, _snabbdomJsx.html)(
        'div',
        { classNames: 'status',
          'class-success': _RequestStatus2.default.isSuccess(status),
          'class-error': _RequestStatus2.default.isError(status)
        },
        statusMsg(status)
      ),
      (0, _snabbdomJsx.html)(
        'button',
        { disabled: _RequestStatus2.default.isPending(status) },
        'Sign in'
      )
    ),
    ';'
  );
};

var statusMsg = _RequestStatus2.default.case({
  Empty: function Empty() {
    return '';
  },
  Pending: function Pending() {
    return 'Logging in ...';
  },
  Success: function Success() {
    return 'Login Successfull';
  },
  Error: function Error(error) {
    return error;
  }
});

function init() {
  return (0, _UpdateResult.pure)({ name: '', password: '', status: _RequestStatus2.default.Empty() });
}

function login(state, dispatch) {
  _api2.default.login(state.name, state.password).then(function () {
    return window.location.hash = '/admin';
  }).catch(function (err) {
    return dispatch(Action.LoginError(err));
  });
}

function update(state, action) {
  return Action.case({
    // Input actions
    Name: function Name(name) {
      return (0, _UpdateResult.pure)(_extends({}, state, { name: name }));
    },
    Password: function Password(password) {
      return (0, _UpdateResult.pure)(_extends({}, state, { password: password }));
    },

    // Request actions
    Login: function Login() {
      return (0, _UpdateResult.withEffects)(_extends({}, state, { status: _RequestStatus2.default.Pending() }), Effect.Login());
    },
    LoginError: function LoginError(error) {
      return (0, _UpdateResult.pure)(_extends({}, state, { status: _RequestStatus2.default.Error(error) }));
    }
  }, action);
}

function execute(state, effect, dispatch) {
  Effect.case({
    Login: function Login() {
      return login(state, dispatch);
    }
  }, effect);
}

exports.default = { view: view, init: init, update: update, Action: Action, execute: execute, Effect: Effect };

},{"./RequestStatus":3,"./UpdateResult":4,"./api":9,"snabbdom-jsx":17,"union-type":25}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var T = function T() {
  return true;
};

var Status = (0, _unionType2.default)({
  Empty: [],
  Pending: [],
  Success: [T],
  Error: [T]
});

Status.isPending = Status.case({
  Pending: function Pending() {
    return true;
  },
  _: function _() {
    return false;
  }
});

Status.isSuccess = Status.case({
  Success: function Success() {
    return true;
  },
  _: function _() {
    return false;
  }
});

Status.isError = Status.case({
  Error: function Error() {
    return true;
  },
  _: function _() {
    return false;
  }
});

exports.default = Status;

},{"union-type":25}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withEffects = exports.pure = exports.UpdateResult = undefined;

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var T = function T() {
  return true;
};

var UpdateResult = exports.UpdateResult = (0, _unionType2.default)({
  Pure: [T],
  WithEffects: [T, T]
});

var pure = exports.pure = function pure(v) {
  return UpdateResult.Pure(v);
};
var withEffects = exports.withEffects = function withEffects(v, effect) {
  return UpdateResult.WithEffects(v, effect);
};

},{"union-type":25}],5:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /** @jsx html */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _snabbdomJsx = require('snabbdom-jsx');

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

var _RequestStatus = require('./RequestStatus');

var _RequestStatus2 = _interopRequireDefault(_RequestStatus);

var _UpdateResult = require('./UpdateResult');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  state: {
  id      : Number, stored id
  name      : String, current username input
  password  : String, current paswword input
  status  : Status, status of the last request
  }
*/

var Action = (0, _unionType2.default)({
  Name: [String],
  Password: [String],
  Save: [],
  SaveSuccess: [Object], // {id}
  SaveError: [Object] // {error}
});

var Effect = (0, _unionType2.default)({
  Save: []
});

function onInput(dispatch, action) {
  return function (e) {
    return dispatch(action(e.target.value));
  };
}

function onSubmit(dispatch) {
  return function (e) {
    e.preventDefault();
    dispatch(Action.SaveStart());
    return false;
  };
}

var view = function view(_ref) {
  var _ref$state = _ref.state;
  var id = _ref$state.id;
  var name = _ref$state.name;
  var password = _ref$state.password;
  var status = _ref$state.status;
  var dispatch = _ref.dispatch;
  return (0, _snabbdomJsx.html)(
    'form',
    { 'on-submit': onSubmit(dispatch) },
    (0, _snabbdomJsx.html)('input', {
      type: 'text',
      placeholder: 'User name',
      value: name,
      'on-input': onInput(dispatch, Action.Name) }),
    (0, _snabbdomJsx.html)('input', {
      type: 'password',
      placeholder: 'Password',
      value: password,
      'on-input': onInput(dispatch, Action.Password) }),
    (0, _snabbdomJsx.html)(
      'button',
      {
        disabled: _RequestStatus2.default.isPending(status),
        'on-click': [dispatch, Action.SaveStart()] },
      id ? 'Update' : 'Add'
    ),
    (0, _snabbdomJsx.html)(
      'span',
      { classNames: 'status',
        'class-success': _RequestStatus2.default.isSuccess(status),
        'class-error': _RequestStatus2.default.isError(status) },
      statusMsg(status)
    )
  );
};

var statusMsg = _RequestStatus2.default.case({
  Empty: function Empty() {
    return '';
  },
  Pending: function Pending() {
    return 'Saving user...';
  },
  Success: function Success(id) {
    return 'User ' + id + ' saved with success';
  },
  Error: function Error(error) {
    return 'Error! ' + error;
  }
});

function init() {
  var user = arguments.length <= 0 || arguments[0] === undefined ? { name: '', password: '' } : arguments[0];

  return (0, _UpdateResult.pure)(_extends({}, user, { status: _RequestStatus2.default.Empty() }));
}

function save(state, dispatch) {
  var save = state.id ? _api2.default.addUser : _api2.default.updateUser;
  var data = { id: state.id, name: state.name, password: state.password };
  return save(data).then(Action.SaveSuccess, Action.SaveError).then(dispatch);
}

function update(state, action) {
  return Action.case({
    // Input Actions
    Name: function Name(name) {
      return (0, _UpdateResult.pure)(_extends({}, state, { name: name }));
    },
    Password: function Password(password) {
      return (0, _UpdateResult.pure)(_extends({}, state, { password: password }));
    },
    // Save Request Actions
    Save: function Save() {
      return (0, _UpdateResult.withEffects)(_extends({}, state, { status: _RequestStatus2.default.Pending() }), Effect.Save());
    },
    SaveSuccess: function SaveSuccess(id) {
      return (0, _UpdateResult.pure)(_extends({}, state, { id: id, status: _RequestStatus2.default.Success(id) }));
    },
    SaveError: function SaveError(error) {
      return (0, _UpdateResult.pure)(_extends({}, state, { status: _RequestStatus2.default.Error(error) }));
    }
  }, action);
}

function execute(state, effect, dispatch) {
  Effect.case({
    Save: function Save() {
      return save(state, dispatch);
    }
  }, effect);
}

exports.default = { view: view, init: init, update: update, Action: Action, execute: execute, Effect: Effect };

},{"./RequestStatus":3,"./UpdateResult":4,"./api":9,"snabbdom-jsx":17,"union-type":25}],6:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /** @jsx html */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _snabbdomJsx = require('snabbdom-jsx');

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

var _UserForm2 = require('./UserForm');

var _UserForm3 = _interopRequireDefault(_UserForm2);

var _RequestStatus = require('./RequestStatus');

var _RequestStatus2 = _interopRequireDefault(_RequestStatus);

var _UpdateResult = require('./UpdateResult');

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

/*
  state: {
    items   : [{id: Number, user: UserForm}],
    nextId  : Number,
    status  : Status
  }
*/

var Action = (0, _unionType2.default)({
  Add: [],
  Update: [Number, _UserForm3.default.Action],
  GetUsers: [],
  GetUsersSuccess: [Array],
  GetUsersError: [Object]
});

var Effect = (0, _unionType2.default)({
  GetUsers: [],
  UserForm: [Number, _UserForm3.default.Effect]
});

function userDispatcher(id, dispatch) {
  return function (action) {
    return dispatch(Action.Update(id, action));
  };
}

var view = function view(_ref) {
  var state = _ref.state;
  var dispatch = _ref.dispatch;
  return (0, _snabbdomJsx.html)(
    'div',
    { classNames: 'admin' },
    (0, _snabbdomJsx.html)(
      'button',
      { 'on-click': [dispatch, Action.Add()] },
      'Add'
    ),
    (0, _snabbdomJsx.html)(
      'span',
      null,
      statusMsg(state.status)
    ),
    (0, _snabbdomJsx.html)('hr', null),
    (0, _snabbdomJsx.html)(
      'div',
      null,
      state.items.map(function (item) {
        return (0, _snabbdomJsx.html)(UserItem, { item: item, dispatch: dispatch });
      })
    )
  );
};

var UserItem = function UserItem(_ref2) {
  var item = _ref2.item;
  var dispatch = _ref2.dispatch;
  return (0, _snabbdomJsx.html)(
    'div',
    { key: item.id, classNames: 'item' },
    (0, _snabbdomJsx.html)(_UserForm3.default, { state: item.user, dispatch: userDispatcher(item.id, dispatch) })
  );
};

var statusMsg = _RequestStatus2.default.case({
  Pending: function Pending() {
    return 'Getting user list...';
  },
  Error: function Error(error) {
    return 'Error! ' + error;
  },
  _: function _() {
    return '';
  }
});

function receiveUsers(state, users) {
  var items = users.map(function (user, idx) {
    return { id: idx + 1, user: user };
  });
  return (0, _UpdateResult.pure)({
    items: items,
    nextId: items.length + 1,
    status: _RequestStatus2.default.Success('')
  });
}

function getUsers(dispatch) {
  _api2.default.getUsers().then(Action.GetUsersSuccess, Action.GetUsersError).then(dispatch);
}

function addUserPure(state, user) {
  return _extends({}, state, {
    users: [].concat(_toConsumableArray(state.users), [{ id: state.nextId, user: user }]),
    nextId: state.nextId + 1
  });
}

function addUser(state) {
  var result = _UserForm3.default.init();
  return _UpdateResult.UpdateResult.case({
    Pure: function Pure(user) {
      return (0, _UpdateResult.pure)(addUserPure(state, user));
    },
    WithEffects: function WithEffects(user, eff) {
      var state = addUserPure(state, user);
      return (0, _UpdateResult.withEffects)(state, Effect.UserForm(state.nextId - 1, eff));
    }
  }, result);
}

function updateUserPure(state, user, id) {
  return _extends({}, state, {
    items: state.items.map(function (it) {
      return it.id !== id ? it : { id: it.id, user: user };
    })
  });
}

function updateUser(state, id, userAction) {
  var item = state.items.find(function (it) {
    return it.id === id;
  });
  if (item) {
    var result = _UserForm3.default.update(item.user, userAction);
    return _UpdateResult.UpdateResult.case({
      Pure: function Pure(user) {
        return (0, _UpdateResult.pure)(updateUserPure(state, user, id));
      },
      WithEffects: function WithEffects(user, eff) {
        var state = updateUserPure(state, user, id);
        return (0, _UpdateResult.withEffects)(state, Effect.UserForm(id, eff));
      }
    }, result);
  }
  return (0, _UpdateResult.pure)(state);
}

var init = function init() {
  return (0, _UpdateResult.withEffects)({ nextId: 1, items: [], status: _RequestStatus2.default.Pending() }, Effect.GetUsers());
};

function update(state, action) {
  return Action.case({
    Add: function Add() {
      return addUser(state);
    },
    Update: function Update(id, userAction) {
      return updateUser(state, id, userAction);
    },
    // GetUsers Request Actions
    GetUsers: function GetUsers() {
      return (0, _UpdateResult.withEffects)(_extends({}, state, { status: _RequestStatus2.default.Pending() }), Effect.GetUsers());
    },
    GetUsersSuccess: function GetUsersSuccess(users) {
      return receiveUsers(state, users);
    },
    GetUsersError: function GetUsersError(error) {
      return (0, _UpdateResult.pure)(_extends({}, state, { status: _RequestStatus2.default.Error(error) }));
    }
  }, action);
}

function execute(state, effect, dispatch) {
  Effect.case({
    GetUsers: function GetUsers() {
      return getUsers(dispatch);
    },
    UserForm: function UserForm(id, eff) {
      var item = state.items.find(function (it) {
        return it.id === id;
      });
      if (item) _UserForm3.default.execute(item.user, eff, userDispatcher(dispatch, id));
    }
  }, effect);
}

exports.default = { init: init, view: view, update: update, Action: Action, execute: execute, Effect: Effect };

},{"./RequestStatus":3,"./UpdateResult":4,"./UserForm":5,"./api":9,"snabbdom-jsx":17,"union-type":25}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _unionType = require('union-type');

var _unionType2 = _interopRequireDefault(_unionType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var T = function T() {
  return true;
};
var Result = (0, _unionType2.default)({
  Ok: [T],
  Error: [T]
});

exports.default = Result;

},{"union-type":25}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _users = require('./users');

var users = _interopRequireWildcard(_users);

var _Result = require('./Result');

var _Result2 = _interopRequireDefault(_Result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var makeApiCall = function makeApiCall(method) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (res, rej) {
      setTimeout(function () {
        _Result2.default.case({
          Ok: res,
          Error: rej
        }, method.apply(undefined, args));
      }, 200);
    });
  };
};

var obj = {};
for (var key in users) {
  obj[key] = makeApiCall(users[key]);
}

exports.default = obj;

},{"./Result":7,"./users":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _api2.default;

},{"./api":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsers = getUsers;
exports.login = login;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.removeUser = removeUser;

var _Result = require('./Result');

var _Result2 = _interopRequireDefault(_Result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = [{ name: 'admin', password: 'admin', admin: true }, { name: 'guest', password: 'guest' }];

function isDuplicate(name, exceptIdx) {
  return users.some(function (user, idx) {
    return user.name === name && idx !== exceptIdx;
  });
}

function getUsers() {
  return _Result2.default.Ok(users.slice(1));
}

function login(name, password) {
  var user = users.find(function (user) {
    return user.name === name && user.password === password;
  });
  return user ? _Result2.default.Ok('') : _Result2.default.Error('Invalid username/password');
}

function addUser(name, password, admin) {
  if (!isDuplicate(name)) {
    users.push({ name: name, password: password, admin: admin });
    return _Result2.default.Ok('' + users.length);
  } else {
    return _Result2.default.Error('Duplicate user');
  }
}

function updateUser(user) {
  var idx = users.findIndex(function (u) {
    return u.name === user.name;
  });
  if (idx < 0) return _Result2.default.Error('Invalid user id');else if (isDuplicate(user.name, idx)) return _Result2.default.Error('Duplicate user name');else {
    users[idx] = user;
    return _Result2.default.Ok('');
  }
}

function removeUser(user) {
  var idx = users.findIndex(function (u) {
    return u.name === user.name;
  });
  if (idx < 0) return _Result2.default.Error('Unkown user!');

  if (idx === 0) return _Result2.default.Error('Can not remove this one!');else {
    users.splice(idx, 1);
    return _Result2.default.Ok();
  }
}

},{"./Result":7}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dispatch = dispatch;

var _snabbdomJsx = require('snabbdom-jsx');

var _snabbdom = require('snabbdom');

var _snabbdom2 = _interopRequireDefault(_snabbdom);

var _UpdateResult = require('./UpdateResult');

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @jsx html */

var patch = _snabbdom2.default.init([require('snabbdom/modules/class'), require('snabbdom/modules/props'), require('snabbdom/modules/style'), require('snabbdom/modules/eventListeners')]);

var state,
    vnode = document.getElementById('placeholder');

function updateUI() {
  var newVnode = (0, _snabbdomJsx.html)(_App2.default, { state: state, dispatch: dispatch });
  vnode = patch(vnode, newVnode);
}

function updateStatePure(newState) {
  state = newState;
  updateUI();
}

function updateStateWithEffect(newState, effect) {
  updateStatePure(newState);
  _App2.default.execute(state, effect, dispatch);
}

function handleUpdateResult(updateResult) {
  _UpdateResult.UpdateResult.case({
    Pure: updateStatePure,
    WithEffects: updateStateWithEffect
  }, updateResult);
}

function dispatch(action) {
  var updateResult = _App2.default.update(state, action);
  handleUpdateResult(updateResult);
}

handleUpdateResult(_App2.default.init());

},{"./App":1,"./UpdateResult":4,"snabbdom":23,"snabbdom-jsx":17,"snabbdom/modules/class":19,"snabbdom/modules/eventListeners":20,"snabbdom/modules/props":21,"snabbdom/modules/style":22}],12:[function(require,module,exports){
var _curry2 = require('./internal/_curry2');


/**
 * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
 * parameters. Unlike `nAry`, which passes only `n` arguments to the wrapped function,
 * functions produced by `arity` will pass all provided arguments to the wrapped function.
 *
 * @func
 * @memberOf R
 * @sig (Number, (* -> *)) -> (* -> *)
 * @category Function
 * @param {Number} n The desired arity of the returned function.
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is
 *         guaranteed to be of arity `n`.
 * @deprecated since v0.15.0
 * @example
 *
 *      var takesTwoArgs = function(a, b) {
 *        return [a, b];
 *      };
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      var takesOneArg = R.arity(1, takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // All arguments are passed through to the wrapped function
 *      takesOneArg(1, 2); //=> [1, 2]
 */
module.exports = _curry2(function(n, fn) {
  // jshint unused:vars
  switch (n) {
    case 0: return function() {return fn.apply(this, arguments);};
    case 1: return function(a0) {return fn.apply(this, arguments);};
    case 2: return function(a0, a1) {return fn.apply(this, arguments);};
    case 3: return function(a0, a1, a2) {return fn.apply(this, arguments);};
    case 4: return function(a0, a1, a2, a3) {return fn.apply(this, arguments);};
    case 5: return function(a0, a1, a2, a3, a4) {return fn.apply(this, arguments);};
    case 6: return function(a0, a1, a2, a3, a4, a5) {return fn.apply(this, arguments);};
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) {return fn.apply(this, arguments);};
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) {return fn.apply(this, arguments);};
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {return fn.apply(this, arguments);};
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {return fn.apply(this, arguments);};
    default: throw new Error('First argument to arity must be a non-negative integer no greater than ten');
  }
});

},{"./internal/_curry2":15}],13:[function(require,module,exports){
var _curry2 = require('./internal/_curry2');
var _curryN = require('./internal/_curryN');
var arity = require('./arity');


/**
 * Returns a curried equivalent of the provided function, with the
 * specified arity. The curried function has two unusual capabilities.
 * First, its arguments needn't be provided one at a time. If `g` is
 * `R.curryN(3, f)`, the following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`,
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var addFourNumbers = function() {
 *        return R.sum([].slice.call(arguments, 0, 4));
 *      };
 *
 *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry2(function curryN(length, fn) {
  return arity(length, _curryN(length, [], fn));
});

},{"./arity":12,"./internal/_curry2":15,"./internal/_curryN":16}],14:[function(require,module,exports){
/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0) {
      return f1;
    } else if (a != null && a['@@functional/placeholder'] === true) {
      return f1;
    } else {
      return fn(a);
    }
  };
};

},{}],15:[function(require,module,exports){
var _curry1 = require('./_curry1');


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
module.exports = function _curry2(fn) {
  return function f2(a, b) {
    var n = arguments.length;
    if (n === 0) {
      return f2;
    } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
      return f2;
    } else if (n === 1) {
      return _curry1(function(b) { return fn(a, b); });
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true &&
                          b != null && b['@@functional/placeholder'] === true) {
      return f2;
    } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
      return _curry1(function(a) { return fn(a, b); });
    } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
      return _curry1(function(b) { return fn(a, b); });
    } else {
      return fn(a, b);
    }
  };
};

},{"./_curry1":14}],16:[function(require,module,exports){
var arity = require('../arity');


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @return {array} An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 */
module.exports = function _curryN(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (received[combinedIdx] == null ||
           received[combinedIdx]['@@functional/placeholder'] !== true ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (result == null || result['@@functional/placeholder'] !== true) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined) : arity(left, _curryN(length, combined, fn));
  };
};

},{"../arity":12}],17:[function(require,module,exports){
"use strict";

var SVGNS = "http://www.w3.org/2000/svg";
var modulesNS = ['key', 'hook', 'on', 'style', 'class', 'props'];
var slice = Array.prototype.slice;

function isPrimitive(val) {
  return  typeof val === 'string'   ||
          typeof val === 'number'   ||
          typeof val === 'boolean'  ||
          typeof val === 'symbol'   ||
          val === null              ||
          val === undefined;
}

function normalizeAttrs(attrs, nsURI, defNS, modules) {
  var map = { ns: nsURI };
  for (var i = 0, len = modules.length; i < len; i++) {
    var mod = modules[i];
    if(attrs[mod])
      map[mod] = attrs[mod];
  }
  for(var key in attrs) {
    var idx = key.indexOf('-');
    if(idx > 0)
      addAttr(key.slice(0, idx), key.slice(idx+1), attrs[key]);
    else if(!map[key])
      addAttr(defNS, key, attrs[key]);
  }
  return map;
  
  function addAttr(namespace, key, val) {
    var ns = map[namespace] || (map[namespace] = {});
    ns[key] = val;
  }
}

function buildVnode(nsURI, defNS, modules, tag, attrs, children) {
  attrs = attrs || {};
  if(attrs.classNames) {
    var cns = attrs.classNames;
    tag = tag + '.' + (
      Array.isArray(cns) ? cns.join('.') : cns.replace(/\s+/g, '.')  
    );
  }
  if(typeof tag === 'string') {
    return { 
      sel       : tag, 
      data      : normalizeAttrs(attrs, nsURI, defNS, modules), 
      children  : children.map( function(c) { 
        return isPrimitive(c) ? {text: c} : c;
      })
    };
  } else if(typeof tag === 'function')
    return tag(attrs, children);
  else if(tag && typeof tag.view === 'function')
    return tag.view(attrs, children);
}

function JSX(nsURI, defNS, modules) {
  return function jsxWithCustomNS(tag, attrs, children) {
    if(arguments.length > 3 || !Array.isArray(children))
      children = slice.call(arguments, 2);
    return buildVnode(nsURI, defNS || 'props', modules || modulesNS, tag, attrs, children);
  };
}

module.exports = { 
  html: JSX(undefined), 
  svg: JSX(SVGNS, 'attrs'), 
  JSX: JSX 
};

},{}],18:[function(require,module,exports){
module.exports = {
  array: Array.isArray,
  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
};

},{}],19:[function(require,module,exports){
function updateClass(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldClass = oldVnode.data.class || {},
      klass = vnode.data.class || {};
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}

module.exports = {create: updateClass, update: updateClass};

},{}],20:[function(require,module,exports){
var is = require('../is');

function arrInvoker(arr) {
  return function() {
    // Special case when length is two, for performance
    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
  };
}

function fnInvoker(o) {
  return function(ev) { o.fn(ev); };
}

function updateEventListeners(oldVnode, vnode) {
  var name, cur, old, elm = vnode.elm,
      oldOn = oldVnode.data.on || {}, on = vnode.data.on;
  if (!on) return;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    if (old === undefined) {
      if (is.array(cur)) {
        elm.addEventListener(name, arrInvoker(cur));
      } else {
        cur = {fn: cur};
        on[name] = cur;
        elm.addEventListener(name, fnInvoker(cur));
      }
    } else if (is.array(old)) {
      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
      old.length = cur.length;
      for (var i = 0; i < old.length; ++i) old[i] = cur[i];
      on[name]  = old;
    } else {
      old.fn = cur;
      on[name] = old;
    }
  }
}

module.exports = {create: updateEventListeners, update: updateEventListeners};

},{"../is":18}],21:[function(require,module,exports){
function updateProps(oldVnode, vnode) {
  var key, cur, old, elm = vnode.elm,
      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {};
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur) {
      elm[key] = cur;
    }
  }
}

module.exports = {create: updateProps, update: updateProps};

},{}],22:[function(require,module,exports){
var raf = requestAnimationFrame || setTimeout;
var nextFrame = function(fn) { raf(function() { raf(fn); }); };

function setNextFrame(obj, prop, val) {
  nextFrame(function() { obj[prop] = val; });
}

function updateStyle(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldStyle = oldVnode.data.style || {},
      style = vnode.data.style || {},
      oldHasDel = 'delayed' in oldStyle;
  for (name in style) {
    cur = style[name];
    if (name === 'delayed') {
      for (name in style.delayed) {
        cur = style.delayed[name];
        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
          setNextFrame(elm.style, name, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      elm.style[name] = cur;
    }
  }
}

function applyDestroyStyle(vnode) {
  var style, name, elm = vnode.elm, s = vnode.data.style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}

function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  var name, elm = vnode.elm, idx, i = 0, maxDur = 0,
      compStyle, style = s.remove, amount = 0, applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if(applied.indexOf(props[i]) !== -1) amount++;
  }
  elm.addEventListener('transitionend', function(ev) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

module.exports = {create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle};

},{}],23:[function(require,module,exports){
// jshint newcap: false
/* global require, module, document, Element */
'use strict';

var VNode = require('./vnode');
var is = require('./is');

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }

function emptyNodeAt(elm) {
  return VNode(elm.tagName, {}, [], undefined, elm);
}

var emptyNode = VNode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, map = {}, key;
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

function createRmCb(childElm, listeners) {
  return function() {
    if (--listeners === 0) childElm.parentElement.removeChild(childElm);
  };
}

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function init(modules) {
  var i, j, cbs = {};
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }

  function createElm(vnode, insertedVnodeQueue) {
    var i, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode);
      if (isDef(i = data.vnode)) vnode = i;
    }
    var elm, children = vnode.children, sel = vnode.sel;
    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? document.createElementNS(i, tag)
                                                          : document.createElement(tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          elm.appendChild(createElm(children[i], insertedVnodeQueue));
        }
      } else if (is.primitive(vnode.text)) {
        elm.appendChild(document.createTextNode(vnode.text));
      }
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      elm = vnode.elm = document.createTextNode(vnode.text);
    }
    return vnode.elm;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      parentElm.insertBefore(createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook(vnode) {
    var i = vnode.data, j;
    if (isDef(i)) {
      if (isDef(i = i.hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i, listeners, rm, ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          parentElm.removeChild(ch.elm);
        }
      }
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) { // New element
          parentElm.insertBefore(createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var i, hook;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    if (isDef(i = oldVnode.data) && isDef(i = i.vnode)) oldVnode = i;
    if (isDef(i = vnode.data) && isDef(i = i.vnode)) vnode = i;
    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
    if (oldVnode === vnode) return;
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
    } else if (oldVnode.text !== vnode.text) {
      elm.textContent = vnode.text;
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  return function(oldVnode, vnode) {
    var i;
    var insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
    if (oldVnode instanceof Element) {
      if (oldVnode.parentElement !== null) {
        createElm(vnode, insertedVnodeQueue);
        oldVnode.parentElement.replaceChild(vnode.elm, oldVnode);
      } else {
        oldVnode = emptyNodeAt(oldVnode);
        patchVnode(oldVnode, vnode, insertedVnodeQueue);
      }
    } else {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    }
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode;
  };
}

module.exports = {init: init};

},{"./is":18,"./vnode":24}],24:[function(require,module,exports){
module.exports = function(sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children,
          text: text, elm: elm, key: key};
};

},{}],25:[function(require,module,exports){
var curryN = require('ramda/src/curryN');

function isString(s) { return typeof s === 'string'; }
function isNumber(n) { return typeof n === 'number'; }
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}
function isFunction(f) { return typeof f === 'function'; }
var isArray = Array.isArray || function(a) { return 'length' in a; };

var mapConstrToFn = curryN(2, function(group, constr) {
  return constr === String    ? isString
       : constr === Number    ? isNumber
       : constr === Object    ? isObject
       : constr === Array     ? isArray
       : constr === Function  ? isFunction
       : constr === undefined ? group
                              : constr;
});

function Constructor(group, name, validators) {
  validators = validators.map(mapConstrToFn(group));
  var constructor = curryN(validators.length, function() {
    var val = [], v, validator;
    for (var i = 0; i < arguments.length; ++i) {
      v = arguments[i];
      validator = validators[i];
      if ((typeof validator === 'function' && validator(v)) ||
          (v !== undefined && v !== null && v.of === validator)) {
        val[i] = arguments[i];
      } else {
        throw new TypeError('wrong value ' + v + ' passed to location ' + i + ' in ' + name);
      }
    }
    val.of = group;
    val.name = name;
    return val;
  });
  return constructor;
}

function rawCase(type, cases, action, arg) {
  if (type !== action.of) throw new TypeError('wrong type passed to case');
  var name = action.name in cases ? action.name
           : '_' in cases         ? '_'
                                  : undefined;
  if (name === undefined) {
    throw new Error('unhandled value passed to case');
  } else {
    return cases[name].apply(undefined, arg !== undefined ? action.concat([arg]) : action);
  }
}

var typeCase = curryN(3, rawCase);
var caseOn = curryN(4, rawCase);

function Type(desc) {
  var obj = {};
  for (var key in desc) {
    obj[key] = Constructor(obj, key, desc[key]);
  }
  obj.case = typeCase(obj);
  obj.caseOn = caseOn(obj);
  return obj;
}

module.exports = Type;

},{"ramda/src/curryN":13}]},{},[11]);
