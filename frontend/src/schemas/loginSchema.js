import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is requried'),
  password: yup
    .string()
    .min(2, 'Password must be at least 2 characters')
    .required('Password is required'),
});
