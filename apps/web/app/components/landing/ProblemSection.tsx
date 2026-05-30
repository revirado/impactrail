"use client";

import { Box, Card, CardContent, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import HubIcon from "@mui/icons-material/Hub";
import GppBadIcon from "@mui/icons-material/GppBad";

const problems = [
  {
    icon: <SearchOffIcon sx={{ fontSize: 44, color: "#4caf50" }} />,
    title: "Baja trazabilidad",
    description:
      "Los sistemas actuales no permiten verificar si los fondos distribuidos realmente llegan a los beneficiarios esperados.",
  },
  {
    icon: <HubIcon sx={{ fontSize: 44, color: "#4caf50" }} />,
    title: "Procesos fragmentados",
    description:
      "Cada organización opera con su propia base de datos. No existe una fuente común de verdad entre los actores.",
  },
  {
    icon: <GppBadIcon sx={{ fontSize: 44, color: "#4caf50" }} />,
    title: "Falta de confianza compartida",
    description:
      "Auditar la cadena de distribución es costoso, lento y muchas veces imposible sin registros inmutables.",
  },
];

export default function ProblemSection() {
  return (
    <Box id="problem-section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ color: "#1b5e20", mb: 1 }}
          >
            El desafío actual
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: "#555", mb: 6, maxWidth: 600, mx: "auto", lineHeight: 1.7 }}
          >
            Las organizaciones enfrentan barreras reales al distribuir fondos sociales.
            Impactrail las resuelve con tecnología verificable.
          </Typography>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {problems.map((problem, index) => (
            <Grid item xs={12} md={4} key={problem.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #e0e0e0",
                    "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,0.08)" },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Box sx={{ mb: 2 }}>{problem.icon}</Box>
                    <Typography variant="h5" gutterBottom sx={{ color: "#222" }}>
                      {problem.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
                      {problem.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
