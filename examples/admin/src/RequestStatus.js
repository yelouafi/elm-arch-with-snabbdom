import Type from 'union-type';

const T = () => true;

const Status = Type({
  Empty   : [],
  Pending : [],
  Success : [T],
  Error   : [T]
});

Status.isPending = Status.case({
  Pending: () => true,
  _: () => false
});

Status.isSuccess = Status.case({
  Success: () => true,
  _: () => false
});

Status.isError = Status.case({
  Error: () => true,
  _: () => false
});

export default Status;
