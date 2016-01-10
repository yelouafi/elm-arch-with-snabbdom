import Result from './Result';

const users = [
  { name: 'admin', password: 'admin', admin: true},
  { name: 'guest', password: 'guest'}
];

function isDuplicate(name, exceptIdx) {
  return users.some( (user, idx) => user.name === name && idx !== exceptIdx );
}

export function getUsers() {
  return users.slice(1);
}

export function login(name, password) {
  const user = users.find(user => user.name === name && user.password === password);
  return user  ?
      Result.Ok('')
    : Result.Error('Invalid username/password');
}

export function addUser(name, password, admin) {
  if(!isDuplicate(name)) {
    users.push({name, password, admin});
    return Result.Ok(`${users.length}`);
  } else {
    return Result.Error('Duplicate user');
  }
}

export function updateUser(user) {
  const idx = users.findIndex( u => u.name === user.name );
  if(idx < 0)
    return Result.Error('Invalid user id');
  else if(isDuplicate(user.name, idx))
    return Result.Error('Duplicate user name');
  else {
    users[idx] = user;
    return Result.Ok('');
  }
}

export function removeUser(user) {
  const idx = users.findIndex( u => u.name === user.name );
  if(idx < 0)
    return Result.Error('Unkown user!');

  if(idx === 0)
    return Result.Error('Can not remove this one!');

  else {
    users.splice(idx, 1);
    return Result.Ok();
  }
}
