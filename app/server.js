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
    Success : msg => response.send(msg),
    Error   : err => response.status(status).send(err)
  });


const app = express();
app.use('/api', expressJwt({secret}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) =>
  Result.case({
    Success : ({id, name})  => {
      const token = jwt.sign({id, name}, secret, { expiresIn: 60*5 });
      res.json({token});
    },
    Error   : err => res.status(401).send(err)
  }, login(req.body)));

app.get('/', (req, res) => res.redirect('/login'));
app.get('/api/*', (req, res, next) => {
  if(isAdmin(req.user))
    return next();
  else
    res.status(401).send('Unauthorized access');
});
app.get ('/admin/list'  , (req, res) => res.json(getUsers()));
app.post('/admin/add'   , (req, res) => sendR(res, addUser(req.body)));
app.post('/admin/update', (req, res) => sendR(res, updateUser(req.body)));
app.post('/admin/remove', (req, res) => sendR(res, removeUser(req.body)));

app.use( (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid token');
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Listening on '+process.IP + ':' + process.env.PORT)
);
