export interface FormValidationError {
  [key: string]: {
    value: string;
    message: string;
  };
}
