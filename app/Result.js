import Type from 'union-type';

const T = () => true;
const F = () => false;

const Result = Type({
  Success: [T],
  Error  : [T]
});

Result.isSuccess = Result.case({Success: T, _ : F});
Result.isError = Result.case({Error: T, _ : F});

export default Result;
