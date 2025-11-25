
//************************************************************************************
//************************************************************************************

exports.isStringInteger = (str) => {
  const parsedValue = parseInt(str, 10);
  return !isNaN(parsedValue) && Number.isInteger(parsedValue);
}


//************************************************************************************
//************************************************************************************


exports.isValidDateYYYYMMDD = (dateString) => {
  // 1. Regular expression to check the format yyyy-mm/dd
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  const ok = dateString.trim().match(regex);

  if (!ok) {
    return false; // Format is incorrect
  }

  let match = dateString.split('-')

  // Extract year, month, and day from the matched groups
  const year = parseInt(match[0], 10);
  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);

// 2. Basic range checks for month and day
  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) { // Max 31 for any month
    return false;
  }

  // 3. Create a Date object and check for validity and consistency
  // Month is 0-indexed in Date constructor (0 for January, 11 for December)
  const date = new Date(year, month - 1, day);

  // Check if the Date object's values match the input values
  // This handles invalid dates like "2023-02/30" (February 30th)
  // because new Date(2023, 1, 30) would effectively become March 2nd, 2023
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 && // Compare with 0-indexed month
    date.getDate() === day
  );
}

