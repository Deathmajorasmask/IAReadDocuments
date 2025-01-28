async function validateFieldWithoutResponse(
  fieldValue,
  fieldName,
  errors,
  errorMessage
) {
  if (!fieldValue) {
    errors.push(errorMessage || `Please provide a valid ${fieldName} field!`);
    return false;
  }
  return true;
}

async function validateHeadersResponse(
  headersValue,
  fieldName,
  errors,
  errorMessage
) {
  let sentence = JSON.stringify(headersValue);
  let word = fieldName;
  if (!sentence.includes(word)) {
    errors.push(errorMessage || `Please request isn't ${fieldName}!`);
    return false;
  }
  return true;
}

export { validateFieldWithoutResponse, validateHeadersResponse };
