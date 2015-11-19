import Type from 'union-type';

const Result = Type({
  Ok: [String],
  Error: [String]
});

export default Result;
