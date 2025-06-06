const validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
}

const validateProfileEditData = (data) => {
  let errors = {};

  const allowedEditFields = ['name',  'age'];

  const isEditAllowed = Object.keys(data).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
}
export default { validateProfileEditData, validateSignupData };