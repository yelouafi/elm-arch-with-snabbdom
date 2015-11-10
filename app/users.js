import Result from './Result';

const users = [
  {id: 1, name: 'admin', password: 'admin', admin: true},
  {id: 2, name: 'guest', password: 'guest'},
];
var nextId = 3;

export function isAdmin(user) {
  return user.admin;
}

function isDuplicate(name, exceptId) {
  return users.some( user => user.name === name && user.id !== exceptId );
}

export function getUsers() {
  return users.slice(1);
}

export function login({name, password}) {
  const user = users.find(user => user.name === name && user.password === password);
  return user  ?
      Result.Success({name, admin: user.admin})
    : Result.Error('Invalid username/password');
}

export function addUser({name, password}) {
  console.log('adding '+name)
  if(!isDuplicate(name)) {
    const newUser = {id: nextId, name, password};
    users.push(newUser);
    nextId++;
    return Result.Success({id: newUser.id});
  } else {
    return Result.Error('Duplicate user');
  }
}

export function updateUser(user) {
  const idx = users.findIndex( u => u.id === user.id );
  if(idx < 0)
    return Result.Error('Invalid user id');
  else if(isDuplicate(user.name, user.id))
    return Result.Error('Duplicate user name');
  else {
    users[idx] = user;
    return Result.Success({});
  }
}

export function removeUser({id}) {
  if(id === 1)
    return Result.Error('Can not remove this one');

  const idx = users.findIndex( user => user.id === id );
  if(idx < 0)
    return Result.Error('Invalid user id');
  else {
    delete users[idx];
    return Result.Success({});
  }
}
