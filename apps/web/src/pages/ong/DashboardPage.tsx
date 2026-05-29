import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import { operationService } from "@/services/operation.service";
import { voucherService } from "@/services/voucher.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Operation, Voucher } from "@impactrail/shared-types";

export default function OngDashboard() {
  const { user } = useAuthStore();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ops, vouchs] = await Promise.all([
          operationService.getAll({ ongId: user?.id }),
          voucherService.getAll({ ongId: user?.id }),
        ]);
        setOperations(ops);
        setVouchers(vouchs);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalReceived = operations.reduce((sum, op) => sum + op.amount, 0);
  const activeVouchers = vouchers.filter((v) => v.status === "ACTIVE").length;
  const usedVouchers = vouchers.filter((v) => v.status === "USED").length;

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
