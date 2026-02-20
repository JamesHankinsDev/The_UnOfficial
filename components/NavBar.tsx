"use client";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Link from "next/link";

const navLinks = [
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
  { href: "/merch", label: "Merch" },
];

export default function NavBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        {/* Desktop nav */}
        <Box display="flex" alignItems="center" gap={2} sx={{ display: { xs: "none", sm: "flex" } }}>
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Button
                key={href}
                component={Link}
                href={href}
                color="inherit"
                aria-current={active ? "page" : undefined}
                sx={{
                  textTransform: "none",
                  fontWeight: active ? 700 : 400,
                  borderBottom: active ? "2px solid" : "2px solid transparent",
                  borderColor: active ? "success.main" : "transparent",
                  borderRadius: 0,
                  pb: "2px",
                }}
              >
                {label}
              </Button>
            );
          })}
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

        {/* Mobile hamburger */}
        <IconButton
          color="inherit"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={24} height={24}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </IconButton>

        {/* Mobile drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 220 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
              {navLinks.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <ListItem key={href} disablePadding>
                    <ListItemButton component={Link} href={href} selected={active}>
                      <ListItemText primary={label} primaryTypographyProps={{ fontWeight: active ? 700 : 400 }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            <Divider />
            <List>
              {!loading && (user ? (
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/dashboard">
                    {user.photoURL && (
                      <Avatar src={user.photoURL} alt="Profile" sx={{ width: 24, height: 24, mr: 1 }} />
                    )}
                    <ListItemText primary={user.displayName?.split(" ")[0] || "Dashboard"} />
                  </ListItemButton>
                </ListItem>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/signin">
                    <ListItemText primary="Sign in" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
