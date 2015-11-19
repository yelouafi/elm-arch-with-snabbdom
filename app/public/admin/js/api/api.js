
import * as users from './users';
import Result from './Result';

const makeApiCall = method =>
  (...args) =>  {
    return new Promise((res, rej) => {
      setTimeout(() => {
          Result.case({
            Ok: res,
            Error: rej
          }, method(...args));
      }, 200);
    });
  }

const obj = {};
for (var key in users) {
  obj[key] = makeApiCall(users[key]);
}

export default obj;
