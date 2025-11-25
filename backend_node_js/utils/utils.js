
//************************************************************************************
//************************************************************************************

exports.isStringInteger = (str) => {
  const parsedValue = parseInt(str, 10);
  return !isNaN(parsedValue) && Number.isInteger(parsedValue);
}
