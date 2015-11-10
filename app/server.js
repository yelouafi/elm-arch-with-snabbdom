import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import Result from './Result';
import { isAdmin, login, getUsers, addUser, updateUser, removeUser } from './users';

const secret = 'dont tell anyone';
const sendR = (response, status=400) =>
  Result.case({
    Success : data => response.json(data),
    Error   : error => response.status(status).json({error})
  });


const app = express();
app.use('/api', expressJwt({secret}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) =>
  Result.case({
    Success : userData => {
      const token = jwt.sign(userData, secret, { expiresIn: 60*5 });
      res.json({token});
    },
    Error   : error => res.status(401).json({error})
  }, login(req.body)));

app.get('/', (req, res) => res.redirect('/login'));
app.get('/api/*', (req, res, next) => {
  if(isAdmin(req.user))
    return next();
  else
    res.status(401).json({error: `Unauthorized access for ${req.user.name}`});
});
app.get ('/api/list'  , (req, res) => res.json(getUsers()));
app.post('/api/add'   , (req, res) => sendR(res, addUser(req.body)));
app.post('/api/update', (req, res) => sendR(res, updateUser(req.body)));
app.post('/api/remove', (req, res) => sendR(res, removeUser(req.body)));
/*
app.use(function(err, req, res, next){
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error: 'Invalid token'});
  } else {
     res.status(400).json({error: err});
  }
});*/

app.listen(process.env.PORT || 3000, () =>
  console.log('Listening on '+process.IP + ':' + process.env.PORT)
);
