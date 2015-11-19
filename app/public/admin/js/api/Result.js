import Type from 'union-type';

const T = () => true;
const Result = Type({
  Ok: [T],
  Error: [T]
});

export default Result;
