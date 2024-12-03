import * as yup from 'yup';

export const signupSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup
    .string()
    .oneOf(['tester', 'owner'], 'Invalid role')
    .required('Role is required'),
  company_name: yup.string().when('role', {
    is: 'owner',
    then: () => yup.string().required('Company name is required'),
    otherwise: () => yup.string().notRequired(), // `.notRequired()` for clarity
  }),
});
