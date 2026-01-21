"use client";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import { createContext, useCallback, useContext, useState } from "react";

interface SnackbarContextType {
  showMessage: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
  showMessage: () => {},
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export default function MuiSnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  const showMessage = useCallback((msg: string, sev: AlertColor = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const handleClose = (_: any, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
