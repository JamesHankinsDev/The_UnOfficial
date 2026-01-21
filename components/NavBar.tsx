"use client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function NavBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "secondary.main" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 4 } }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Logo className="h-12 w-auto" />
          </Link>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            component={Link}
            href="/posts"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Posts
          </Button>
          <Button
            component={Link}
            href="/about"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            About
          </Button>
          <Button
            component={Link}
            href="/merch"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Merch
          </Button>
          {!loading &&
            (user ? (
              <Button
                component={Link}
                href="/dashboard"
                color="inherit"
                startIcon={
                  user.photoURL ? (
                    <Avatar
                      src={user.photoURL}
                      alt="Profile"
                      sx={{
                        width: 32,
                        height: 32,
                        border: "2px solid",
                        borderColor: "success.main",
                      }}
                    />
                  ) : null
                }
                sx={{
                  ml: 2,
                  pl: 2,
                  borderLeft: 1,
                  borderColor: "divider",
                  textTransform: "none",
                }}
              >
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  {user.displayName?.split(" ")[0] || "User"}
                </Typography>
              </Button>
            ) : (
              <Button
                component={Link}
                href="/signin"
                variant="contained"
                color="success"
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                Sign in
              </Button>
            ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
