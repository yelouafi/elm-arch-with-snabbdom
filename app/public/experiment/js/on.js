
function pipe(...fns) {
  return function(arg) {
    let res = arg;
    for (var i = 0; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };
};

module.exports = function(dispatch) {

  function fnInvoker(o) {
    return function(ev) {
      if(Array.isArray(o.fn)) {
        var res = ev;
        for (var i = 0; i < o.fn.length; i++) {
          res = o.fn[i](res);
        }
        dispatch(res);
      } else
        dispatch(o.fn(ev));
    };
  }

  function updateEventListeners(oldVnode, vnode) {
    var name, cur, old, elm = vnode.elm,
        oldOn = oldVnode.data.on || {}, on = vnode.data.on;

    if (!on) return;
    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      if (old === undefined) {
        cur = {fn: cur};
        on[name] = cur;
        elm.addEventListener(name, fnInvoker(cur));
      } else {
        old.fn = cur;
        on[name] = old
      }
    }
  }

  return {
    create: updateEventListeners,
    update: updateEventListeners
  };
}
