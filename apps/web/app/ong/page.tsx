"use client";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import { useAuthStore } from "@/stores/auth.store";
import { useOngDashboard } from "@/hooks/useOngDashboard";

export default function OngDashboard() {
  const { user } = useAuthStore();
  const { totalReceived, activeVouchers, usedVouchers, loading } = useOngDashboard(user?.id);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Resumen de fondos recibidos y vouchers emitidos
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AttachMoneyIcon sx={{ color: "#2e7d32", mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Fondos Recibidos
                </Typography>
              </Box>
              <Typography variant="h4">
                ${totalReceived.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ConfirmationNumberIcon sx={{ color: "#ed6c02", mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Vouchers Activos
                </Typography>
              </Box>
              <Typography variant="h4">{activeVouchers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PeopleIcon sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Vouchers Canjeados
                </Typography>
              </Box>
              <Typography variant="h4">{usedVouchers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
