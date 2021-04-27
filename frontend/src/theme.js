import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';

// This allows us to wrap the entire application in our custom theme
export default createMuiTheme({
  palette: {
    primary: colors.lightBlue,
    secondary: {
      light: colors.green[300],
      main: colors.green[600],
      dark: colors.green[700],
    },
    background: {
      default: '#f1f1f1',
    },
    brand: {
      primary: '#206093',
      secondary: '#215d39',
    }
  },
  typography: {
    useNextVariants: true,
  },
});
