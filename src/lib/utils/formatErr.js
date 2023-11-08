export const formatAndTipWagmiError = (error) => {
  if (!error) {
    return ''
  }
  const errorArr = error.split('\n');
  let retErr = ''
  if (errorArr.length >= 2 && errorArr[1]) {
    retErr = errorArr[1]
  } else {
    retErr = errorArr[0]
  }
  if (retErr.indexOf(':') > -1) {
    return retErr.split(':')[1]
  }
  return retErr
}