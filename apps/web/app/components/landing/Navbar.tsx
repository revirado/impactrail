"use client";

import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
} from "@mui/material";
import Image from "next/image";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useAuthStore } from "@/stores/auth.store";

interface NavbarProps {
  onScrollToTop: () => void;
}

function useScrolled() {
  return useScrollTrigger({
    disableHysteresis: true,
    threshold: 80,
  });
}

export default function Navbar({ onScrollToTop }: NavbarProps) {
  const router = useRouter();
  const scrolled = useScrolled();
  const { user } = useAuthStore();

  const handleText = user ? "Ir al panel" : "Ingresar";
  const handleClick = () => {
    if (user) {
      switch (user.role) {
        case "CORPORATE": router.push("/corporate"); break;
        case "ONG": router.push("/ong"); break;
        case "BENEFICIARY": router.push("/beneficiary"); break;
        case "MERCHANT": router.push("/merchant"); break;
        default: router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 3 : 0}
      sx={{
        background: scrolled ? "#0d1b0d" : "transparent",
        transition: "background 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            onClick={onScrollToTop}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <Box sx={{ position: "relative", width: 36, height: 36 }}>
              <Image
                src="/images/logo.png"
                alt="Impactrail"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={handleClick}
            sx={{
              bgcolor: "#fdd835",
              color: "#1b1b1b",
              fontWeight: 700,
              "&:hover": { bgcolor: "#fbc02d" },
            }}
          >
            {handleText}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
