import type { FormValidationError } from '@/types/validation';
import type { FieldValidationError, Result, ValidationError } from 'express-validator';

const mapValidationErrors = (errors: Result<ValidationError>) => {
  const validationErrors = (errors.array() as FieldValidationError[]).reduce(
    (errors, { value, msg, path }: FieldValidationError) => {
      errors[path] = { value, message: msg };
      return errors;
    },
    {} as FormValidationError,
  );

  return validationErrors;
};

export default mapValidationErrors;
