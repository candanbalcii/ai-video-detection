// import React from 'react';
// import {
//   Box,
//   Checkbox,
//   FormControlLabel,
//   Grid,
//   Link,
//   Typography,
// } from '@mui/material';
// import { Form, Formik } from 'formik';
// import FormInput from '../components/FormInput';
// import SubmitButton from '../components/SubmitButton';
// import { signupSchema } from '../schemas/signupSchema';

// const Signup = () => {
//   const handleSubmit = (values, { setSubmitting, setErrors }) => {
//     setSubmitting(true);
//     console.log('Logging in with values:', values);

//     // Simulating a login process (no backend interaction)
//     setTimeout(() => {
//       if (
//         values.email === 'test@example.com' &&
//         values.password === 'password123'
//       ) {
//         console.log('Login successful!');
//       } else {
//         setErrors({ email: 'Invalid email or password.' });
//         console.error('Login failed: Invalid credentials.');
//       }
//       setSubmitting(false);
//     }, 1000); // Simulate network delay
//   };

//   return (
//     <Grid
//       container
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         background: 'linear-gradient(90deg, #000, #4B0082)', // Arka plan degrade
//         minHeight: '100vh', // Tam ekran yüksekliği
//         alignItems: 'center', // Dikeyde ortalama
//       }}
//     >
//       {/* Form bölümü */}
//       <Grid
//         item
//         xs={12}
//         sm={7}
//         md={5}
//         sx={{
//           padding: 3,
//           background: 'transparent', // Çevreleyen kutuyu kaldırdık
//           borderRadius: '0', // Köşe yuvarlama kaldırıldı
//           color: '#fff', // Yazı rengini beyaz yaptık
//           marginBottom: '150px', // Formu yukarıya çekmek için margin ekledik
//         }}
//       >
//         <Box sx={{ textAlign: 'center' }}>
//           <Typography
//             variant="h2"
//             gutterBottom
//             sx={{ color: '#fff', fontWeight: 'bold' }}
//           >
//             Get Started With Us
//           </Typography>
//         </Box>

//         <Formik
//           initialValues={{ email: '', password: '', keepLoggedIn: false }}
//           validationSchema={signupSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, handleChange, errors, touched, isSubmitting }) => (
//             <Form>
//               {/* Name and Surname Inputs side by side */}
//               <Grid container spacing={2}>
//                 <Grid item xs={12} sm={6}>
//                   <FormInput
//                     label="Name"
//                     name="name"
//                     value={values.name}
//                     onChange={handleChange}
//                     error={touched.name && Boolean(errors.name)}
//                     helperText={touched.name && errors.name}
//                     sx={{
//                       '& .MuiInputLabel-root': {
//                         color: '#fff', // Label text color
//                       },
//                       '& .MuiInputBase-root': {
//                         color: '#fff', // Input text color
//                       },
//                       '& .MuiOutlinedInput-root': {
//                         borderColor: '#fff', // Border color
//                       },
//                       '& .MuiOutlinedInput-root.Mui-focused': {
//                         borderColor: '#4B0082', // Focused border color
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <FormInput
//                     label="Surname"
//                     name="surname"
//                     value={values.surname}
//                     onChange={handleChange}
//                     error={touched.surname && Boolean(errors.surname)}
//                     helperText={touched.surname && errors.surname}
//                     sx={{
//                       '& .MuiInputLabel-root': {
//                         color: '#fff', // Label text color
//                       },
//                       '& .MuiInputBase-root': {
//                         color: '#fff', // Input text color
//                       },
//                       '& .MuiOutlinedInput-root': {
//                         borderColor: '#fff', // Border color
//                       },
//                       '& .MuiOutlinedInput-root.Mui-focused': {
//                         borderColor: '#4B0082', // Focused border color
//                       },
//                     }}
//                   />
//                 </Grid>
//               </Grid>

//               {/* Email Input */}
//               <FormInput
//                 label="Email"
//                 name="email"
//                 value={values.email}
//                 onChange={handleChange}
//                 error={touched.email && Boolean(errors.email)}
//                 helperText={touched.email && errors.email}
//                 sx={{
//                   '& .MuiInputLabel-root': {
//                     color: '#fff', // Label text color
//                   },
//                   '& .MuiInputBase-root': {
//                     color: '#fff', // Input text color
//                   },
//                   '& .MuiOutlinedInput-root': {
//                     borderColor: '#fff', // Border color
//                   },
//                   '& .MuiOutlinedInput-root.Mui-focused': {
//                     borderColor: '#4B0082', // Focused border color
//                   },
//                 }}
//               />

//               {/* Password Input */}
//               <FormInput
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={values.password}
//                 required
//                 onChange={handleChange}
//                 error={touched.password && Boolean(errors.password)}
//                 helperText={touched.password && errors.password}
//                 sx={{
//                   '& .MuiInputLabel-root': {
//                     color: '#fff', // Label text color
//                   },
//                   '& .MuiInputBase-root': {
//                     color: '#fff', // Input text color
//                   },
//                   '& .MuiOutlinedInput-root': {
//                     borderColor: '#fff', // Border color
//                   },
//                   '& .MuiOutlinedInput-root.Mui-focused': {
//                     borderColor: '#4B0082', // Focused border color
//                   },
//                 }}
//               />

//               {/* Keep me logged in */}
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   color: '#fff', // Adjusting text color
//                 }}
//               >
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       name="keepLoggedIn"
//                       checked={values.keepLoggedIn}
//                       onChange={handleChange}
//                       color="primary"
//                     />
//                   }
//                   label="Keep me logged in"
//                   sx={{ color: '#fff' }} // Ensuring checkbox label is white
//                 />
//                 <Link href="#" variant="body2" sx={{ color: '#fff' }}>
//                   Forgot password?
//                 </Link>
//               </Box>

//               {/* Submit Button */}
//               <SubmitButton text="Signup" disabled={isSubmitting} />
//             </Form>
//           )}
//         </Formik>
//       </Grid>
//     </Grid>
//   );
// };

// export default Signup;
import Form from '../components/Form';

function Register() {
  return <Form route="/api/user/register/" method="register" />;
}

export default Register;
