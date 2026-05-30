"use client";

import { Box, Typography, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function CTASection() {
  const router = useRouter();
  const { user } = useAuthStore();

  const label = user ? "Ir al panel" : "Acceder a la plataforma";

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
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        background: "linear-gradient(135deg, #0d1b0d 0%, #1a2f1a 100%)",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" sx={{ color: "#ffffff", mb: 2 }}>
            ¿Listo para empezar?
          </Typography>
          <Typography
            sx={{ color: "#c8e6c9", mb: 5, lineHeight: 1.7, fontSize: "1.1rem" }}
          >
            Transformá la distribución de fondos sociales con trazabilidad
            verificable y transparencia total.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 4px 24px rgba(253,216,53,0.2)",
                "0 4px 40px rgba(253,216,53,0.4)",
                "0 4px 24px rgba(253,216,53,0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ borderRadius: 12, display: "inline-block" }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleClick}
              sx={{
                px: 8,
                py: 2,
                fontSize: "1.2rem",
                borderRadius: 3,
                fontWeight: 700,
                bgcolor: "#fdd835",
                color: "#1b1b1b",
                "&:hover": { bgcolor: "#fbc02d" },
              }}
            >
              {label}
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
