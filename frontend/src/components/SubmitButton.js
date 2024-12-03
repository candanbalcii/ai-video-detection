import { Button } from '@mui/material';

const SubmitButton = ({ text, ...props }) => {
  return (
    <Button
      sx={{
        backgroundColor: '#4682B4',
        width: '100%',
        padding: '12px',
        marginTop: '16px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#355C7D ',
        },
        display: 'flex',
        justifyContent: 'center',
      }}
      type="submit"
      variant="contained"
      color="primary"
      {...props}
    >
      {text}
    </Button>
  );
};

export default SubmitButton;
