
module.exports = function on(dispatch) {

  function arrInvoker(arr) {
    return function(ev) {
      dispatch(...arr, ev);
    };
  }

  function fnInvoker(o) {
    return function(ev) {
      dispatch(o.fn, ev);
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
        if (Array.isArray(cur)) {
          elm.addEventListener(name, arrInvoker(cur));
        } else {
          cur = {fn: cur};
          on[name] = cur;
          elm.addEventListener(name, fnInvoker(cur));
        }
      } else if (Array.isArray(old)) {
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

  return {create: updateEventListeners, update: updateEventListeners};
}
