"use client";

import { useRef } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { motion, useInView } from "framer-motion";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import VerifiedIcon from "@mui/icons-material/Verified";

const stats = [
  {
    label: "Fondos distribuidos",
    value: 75000,
    prefix: "$",
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
  },
  {
    label: "Vouchers emitidos",
    value: 3,
    prefix: "",
    icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} />,
  },
  {
    label: "Transacciones verificadas",
    value: 1,
    prefix: "",
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
  },
];

function AnimatedStat({
  value,
  prefix,
  label,
  icon,
  index,
}: {
  value: number;
  prefix: string;
  label: string;
  icon: React.ReactNode;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <Box ref={ref} sx={{ textAlign: "center" }}>
        <Box sx={{ color: "#fdd835", mb: 1 }}>{icon}</Box>
        <Typography variant="h3" fontWeight={800} sx={{ color: "#ffffff" }}>
          {prefix}
          {isInView ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {value.toLocaleString()}
            </motion.span>
          ) : (
            "0"
          )}
        </Typography>
        <Typography variant="body1" sx={{ color: "#a5d6a7", mt: 1 }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background: "linear-gradient(135deg, #0a1f0a 0%, #1b5e20 50%, #0d2e0d 100%)",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, i) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <AnimatedStat {...stat} index={i} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
