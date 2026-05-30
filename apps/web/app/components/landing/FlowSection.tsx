"use client";

import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import BusinessIcon from "@mui/icons-material/Business";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import FaceIcon from "@mui/icons-material/Face";
import StorefrontIcon from "@mui/icons-material/Storefront";

const steps = [
  {
    icon: <BusinessIcon sx={{ fontSize: 32 }} />,
    title: "Empresa",
    snippet: "Distribuye fondos a ONGs. Cada operación genera un checkpoint inmutable en Stellar.",
    color: "#4caf50",
  },
  {
    icon: <VolunteerActivismIcon sx={{ fontSize: 32 }} />,
    title: "ONG",
    snippet: "Genera vouchers digitales con QR único. Cada voucher queda registrado y es trazable.",
    color: "#fdd835",
  },
  {
    icon: <FaceIcon sx={{ fontSize: 32 }} />,
    title: "Beneficiario",
    snippet: "Recibe vouchers digitales. Solo necesita mostrar un QR en el comercio adherido.",
    color: "#81c784",
  },
  {
    icon: <StorefrontIcon sx={{ fontSize: 32 }} />,
    title: "Comercio",
    snippet: "Escanea el QR, valida y procesa el pago. Todo queda registrado en blockchain.",
    color: "#66bb6a",
  },
];

export default function FlowSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f9fafb" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" align="center" sx={{ color: "#1b5e20", mb: 1 }}>
            Cómo funciona
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: "#555", mb: 8 }}
          >
            Un flujo simple con trazabilidad total en cada paso
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "center",
            gap: { xs: 5, md: 0 },
            position: "relative",
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.title}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: { xs: 280, md: "none" },
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.25 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      bgcolor: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: index === 1 ? "#1b1b1b" : "#fff",
                      mb: 2.5,
                      boxShadow: `0 6px 20px ${step.color}66`,
                    }}
                  >
                    {step.icon}
                  </Box>
                </motion.div>

                <Typography variant="h6" align="center" gutterBottom sx={{ color: "#222" }}>
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ color: "#666", maxWidth: 220, lineHeight: 1.7 }}
                >
                  {step.snippet}
                </Typography>
              </motion.div>
            </Box>
          ))}

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: 36,
              left: "12%",
              right: "12%",
              height: 3,
              zIndex: 0,
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, #4caf50, #fdd835, #81c784, #66bb6a)",
                transformOrigin: "left",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
