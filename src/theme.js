import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = responsiveFontSizes(createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 1164,
            lg: 1280,
            xl: 1920,
        },
    },
    palette: {
        // type: 'light',
        primary: {
            main: '#7114ea'
        },
        secondary: {
            main: '#26a69a'
        },
        default: {
            main: 'black',
            borderColor: '#fff'
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#f3f3f3',
        },
        action: {
            disabled: 'black'
        }
    }
}));

export default theme;