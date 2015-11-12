
export function contract(model) {
  const actions = {};
  for (let type in model) {
      if(type !== 'init')
        actions[type] = (...args) => ({type, args});
  }
  return [updater(model), actions];
}

function updater(model) {
  return (state, {type, args}) => {
    const handler = model[type];
    if(handler)
      return handler(state, ...args);
    else
      throw 'Unkown action ' + type;
  }
}

export function pipe(...fns) {
  return function(arg) {
    let res = arg;
    for (var i = 0; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };
};

export function bind(fn, ...bargs) {
  return (...args) => fn(...bargs, ...args);
}

const ident = x => x;

export function withContext(ctxAction, getState=ident, ...args) {
  return action => {
    if(typeof action === 'function') {
      return (dispatch, state) => action(a => dispatch(ctxAction(...args, a)), getState(state));
    } else {
      return ctxAction(...args, action);
    }
  }
}

export function getter(path) {
  var parts = path.split('/');
  return obj => {
    var res = obj;
    for (var i = 1; i < parts.length; i++) {
      var prop = parts[i];
      if(Array.isArray(res))
        res = res.find(it => it.id == prop)
      else if(res && prop in res)
        res = res[prop];
      else
        return undefined;
    }
    return res;
  }
}
