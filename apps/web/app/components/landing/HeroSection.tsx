"use client";

import { useRef, useEffect } from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { motion } from "framer-motion";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      containerRef.current.style.setProperty("--mx", `${x}px`);
      containerRef.current.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const titleLetters = "IMPACTRAIL".split("");

  const ctaText = user ? "Ir al panel" : "Acceder a la plataforma";
  const ctaPath = user
    ? `/dashboard`
    : "/login";

  const handleCTA = () => {
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
    <Box
      ref={containerRef}
      sx={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d1b0d 0%, #1a2f1a 35%, #0f2a0f 65%, #0a150a 100%)",
      }}
    >
      <Box
        component={motion.div}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0], scale: [1, 1.08, 0.94, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%)",
          top: "-15%",
          right: "-15%",
          transform: "translate(var(--mx, 0px), var(--my, 0px))",
          transition: "transform 0.8s ease-out",
        }}
      />
      <Box
        component={motion.div}
        animate={{ x: [0, -40, 50, 0], y: [0, 30, -35, 0], scale: [1, 0.92, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253,216,53,0.07) 0%, transparent 70%)",
          bottom: "-10%",
          left: "-10%",
          transform: "translate(calc(var(--mx, 0px) * -0.6), calc(var(--my, 0px) * -0.6))",
          transition: "transform 0.8s ease-out",
        }}
      />
      <Box
        component={motion.div}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,199,132,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(calc(-50% + var(--mx, 0px)), calc(-50% + var(--my, 0px)))",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.8rem", md: "4.8rem" },
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              mb: 1,
              lineHeight: 1.1,
            }}
          >
            {titleLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            ))}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "#c8e6c9",
              maxWidth: 600,
              mx: "auto",
              mb: 2,
              fontWeight: 400,
              lineHeight: 1.7,
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Distribución auditada de fondos sociales con blockchain Stellar.
            Transparencia, trazabilidad y confianza en cada transacción.
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              color: "#fdd835",
              fontWeight: 600,
              mb: 5,
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            IMPACTRAIL — Cada operación genera un registro criptográfico inmutable.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleCTA}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
                bgcolor: "#fdd835",
                color: "#1b1b1b",
                fontWeight: 700,
                "&:hover": { bgcolor: "#fbc02d" },
                boxShadow: "0 4px 24px rgba(253,216,53,0.25)",
              }}
            >
              {ctaText}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => {
                const el = document.getElementById("problem-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
                borderColor: "#81c784",
                color: "#81c784",
                "&:hover": { borderColor: "#fdd835", color: "#fdd835" },
              }}
            >
              Ver cómo funciona
            </Button>
          </Stack>
        </motion.div>
      </Container>

      <Box
        sx={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDownwardIcon sx={{ color: "#a5d6a7", fontSize: 32 }} />
        </motion.div>
      </Box>
    </Box>
  );
}
