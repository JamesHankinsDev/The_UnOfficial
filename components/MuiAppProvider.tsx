"use client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme } from "../lib/muiThemes";

export default function MuiAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
