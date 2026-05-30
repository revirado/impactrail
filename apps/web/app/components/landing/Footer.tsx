"use client";

import { Box, Typography, Container } from "@mui/material";
import Link from "next/link";

export default function Footer() {
  return (
    <Box sx={{ py: 4, bgcolor: "#0a150a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#6b8b6b" }}>
            &copy; {new Date().getFullYear()} IMPACTRAIL. Todos los derechos reservados.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#4caf50" }}>
                Ingresar
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
