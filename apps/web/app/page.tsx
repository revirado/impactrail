"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      switch (user.role) {
        case "CORPORATE":
          router.replace("/corporate");
          break;
        case "ONG":
          router.replace("/ong");
          break;
        case "BENEFICIARY":
          router.replace("/beneficiary");
          break;
        case "MERCHANT":
          router.replace("/merchant");
          break;
        default:
          router.replace("/login");
      }
    }
  }, [user, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Cargando...
      </Typography>
    </Box>
  );
}
