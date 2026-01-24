"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [expanded, setExpanded] = useState(false);

  return (
    <footer>
      <Box
        sx={{
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "primary.main",
          mt: "auto",
          py: { xs: 2, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Accordion
            expanded={expanded}
            onChange={() => setExpanded((prev) => !prev)}
            sx={{ boxShadow: "none", bgcolor: "primary.main", mb: 0 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="footer-content"
              id="footer-toggle"
              sx={{ px: 0, bgcolor: "primary.main", borderRadius: 1 }}
            >
              <Typography
                variant="subtitle1"
                color="text.primary"
                fontWeight={700}
              >
                {expanded ? "Hide Site Info & Links" : "Show Site Info & Links"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ px: 0, bgcolor: "primary.main", borderRadius: 1 }}
            >
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }}
                gap={8}
              >
                {/* Brand Section */}
                <Box>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    fontWeight={700}
                    mb={1}
                  >
                    The UnOfficial
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Serious Fans, UnSerious Takes.
                  </Typography>
                </Box>
                {/* Quick Links */}
                <nav aria-label="Footer navigation">
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                    mb={1}
                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                  >
                    Quick Links
                  </Typography>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li>
                      <Link
                        href="/"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ "&:hover": { color: "success.main" } }}
                        >
                          Home
                        </Typography>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/posts"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ "&:hover": { color: "success.main" } }}
                        >
                          Articles
                        </Typography>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/about"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ "&:hover": { color: "success.main" } }}
                        >
                          About
                        </Typography>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/dashboard"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ "&:hover": { color: "success.main" } }}
                        >
                          Dashboard
                        </Typography>
                      </Link>
                    </li>
                  </ul>
                </nav>
                {/* Connect */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight={600}
                    mb={1}
                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}
                  >
                    Connect
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Real fans, real talk. Join the conversation about the game
                    we love.
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Divider sx={{ my: 2, display: expanded ? "block" : "none" }} />
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            gap={4}
          >
            <Typography variant="body2" color="text.secondary">
              © {currentYear} The UnOfficial. All rights reserved.
            </Typography>
            <nav aria-label="Footer secondary navigation">
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  gap: 16,
                }}
              >
                <li>
                  <Link
                    href="/posts"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ "&:hover": { color: "success.main" } }}
                    >
                      Latest Posts
                    </Typography>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ "&:hover": { color: "success.main" } }}
                    >
                      About Us
                    </Typography>
                  </Link>
                </li>
              </ul>
            </nav>
          </Box>
        </Container>
      </Box>
    </footer>
  );
}
