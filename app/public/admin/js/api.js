
export function login(name, password) {
  return fetch('/login', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, password})
  })
  .then(resp =>
    resp.json().then( data => {
      if(resp.ok) {
        window.sessionStorage.token = data.token;
        return data;
      } else {
          delete window.sessionStorage.token;
          return Promise.reject(data);
      }
    }));
}

export function get(url) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${window.sessionStorage.token}`}
  })
  .then(resp =>
    resp.json().then( data => resp.ok ? data : Promise.reject(data) ));
}

export function post(url, data) {
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.sessionStorage.token}`
    },
    body: JSON.stringify(data)
  })
  .then(resp =>
    resp.json().then( data => resp.ok ? data : Promise.reject(data) ));
}
