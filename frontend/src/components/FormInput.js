import { TextField } from '@mui/material';

const FormInput = ({ label, value, onChange, type = 'text', ...props }) => {
  const customInputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#77B3D4',
      },
      '&:hover fieldset': {
        borderColor: '#1A5B8B',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1A5B8B',
      },
    },
  };
  return (
    <TextField
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      margin="normal"
      value={value}
      onChange={onChange}
      sx={customInputStyles}
      {...props}
    />
  );
};

export default FormInput;
