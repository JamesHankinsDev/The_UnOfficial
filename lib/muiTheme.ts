import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#172A3A", // Brand primary
    },
    secondary: {
      main: "#004346", // Brand secondary
    },
    success: {
      main: "#09BC8A", // Brand tertiary
    },
    info: {
      main: "#508991", // Brand accent
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
    text: {
      primary: "#172A3A",
      secondary: "#004346",
    },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
