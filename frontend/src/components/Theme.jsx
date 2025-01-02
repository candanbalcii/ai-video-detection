import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // veya 'dark'
    primary: {
      main: '#3f51b5', // Ana renk
    },
    secondary: {
      main: '#f50057', // İkinci renk
    },
  },
});
