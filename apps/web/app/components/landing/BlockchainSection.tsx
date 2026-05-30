"use client";

import { Box, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const blocks = [
  {
    hash: "abc123...de4f",
    timestamp: "2026-05-29 21:06",
    type: "Operación creada",
    detail: "TechCorp → Fundación Ayudar",
    status: "Verificado",
  },
  {
    hash: "def456...a1b2",
    timestamp: "2026-05-29 21:07",
    type: "Voucher emitido",
    detail: "Alimentos — $5.000",
    status: "Verificado",
  },
  {
    hash: "ghi789...c3d4",
    timestamp: "2026-05-29 21:08",
    type: "Transacción aprobada",
    detail: "Comercio Don Pedro",
    status: "Verificado",
  },
];

export default function BlockchainSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h3" align="center" sx={{ color: "#1b5e20", mb: 1 }}>
            Trazabilidad verificable
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: "#555", mb: 8, maxWidth: 550, mx: "auto" }}
          >
            Cada operación genera un checkpoint inmutable en Stellar, auditable
            por cualquiera en cualquier momento.
          </Typography>
        </motion.div>

        <Box sx={{ position: "relative", pl: { xs: 3, md: 0 } }}>
          <Box
            component={motion.div}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            sx={{
              position: "absolute",
              left: { xs: 27, md: "50%" },
              top: 0,
              width: 3,
              background: "linear-gradient(180deg, #4caf50, #fdd835, #4caf50)",
              borderRadius: 2,
              transform: { md: "translateX(-50%)" },
            }}
          />

          <Grid container spacing={3} direction="column">
            {blocks.map((block, index) => (
              <Grid item key={block.hash} xs={12}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.3 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", md: index % 2 === 0 ? "row" : "row-reverse" },
                      alignItems: "center",
                      gap: 3,
                      ml: { xs: 5, md: 0 },
                      position: "relative",
                    }}
                  >
                    <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }} />

                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(76,175,80,0)",
                          "0 0 22px rgba(76,175,80,0.35)",
                          "0 0 0px rgba(76,175,80,0)",
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.6 }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          bgcolor: index === 1 ? "#fdd835" : "#4caf50",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: index === 1 ? "#1b1b1b" : "#fff",
                          zIndex: 2,
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircleIcon />
                      </Box>
                    </motion.div>

                    <Box
                      sx={{
                        flex: 1,
                        p: 3,
                        bgcolor: "#f9fafb",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#888", fontFamily: "monospace", mb: 0.5, display: "block" }}>
                        {block.timestamp}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#222" }}>
                        {block.type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {block.detail}
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Typography variant="caption" sx={{ color: "#999", fontFamily: "monospace" }}>
                          {block.hash}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 700 }}>
                          {block.status} ✓
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        >
          <Box
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "#0d1b0d",
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={{ color: "#c8e6c9", lineHeight: 1.8 }}>
              <strong style={{ color: "#fdd835" }}>Stellar</strong> actúa como capa de auditoría:
              almacena hashes criptográficos, timestamps y estados verificables.
              Las imágenes o archivos <strong style={{ color: "#fdd835" }}>NO</strong> se
              almacenan en blockchain. Solo la evidencia de integridad.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
