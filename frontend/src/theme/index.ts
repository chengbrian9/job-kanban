import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.2s ease-in-out',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease-in-out',
        },
      },
    },
  },
});
