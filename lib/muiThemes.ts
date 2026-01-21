import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#172A3A" },
    secondary: { main: "#004346" },
    success: { main: "#09BC8A" },
    info: { main: "#508991" },
    background: { default: "#fff", paper: "#fff" },
    text: { primary: "#172A3A", secondary: "#004346" },
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
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#172A3A" },
    secondary: { main: "#004346" },
    success: { main: "#09BC8A" },
    info: { main: "#508991" },
    background: { default: "#111827", paper: "#1a2233" },
    text: { primary: "#fff", secondary: "#09BC8A" },
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
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
});

export { lightTheme, darkTheme };
