import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { voucherService } from "@/services/voucher.service";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { VoucherCategory } from "@impactrail/shared-types";
import type { Voucher, User } from "@impactrail/shared-types";

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "Alimentos",
  PHARMACY: "Farmacia",
  SCHOOL_SUPPLIES: "Útiles Escolares",
  CLOTHING: "Ropa",
  GENERAL: "General",
};

export default function OngVouchers() {
  const { user } = useAuthStore();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    beneficiaryId: "",
    amount: "",
    category: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const [vouchs, bens] = await Promise.all([
        voucherService.getAll({ ongId: user?.id }),
        authService.getUsers("BENEFICIARY"),
      ]);
      setVouchers(vouchs);
      setBeneficiaries(bens);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!user || !formData.beneficiaryId || !formData.amount || !formData.category) return;
    setCreating(true);
    setError(null);
    try {
      await voucherService.create({
        ongId: user.id,
        beneficiaryId: formData.beneficiaryId,
        amount: parseFloat(formData.amount),
        category: formData.category as VoucherCategory,
      });
      setDialogOpen(false);
      setFormData({ beneficiaryId: "", amount: "", category: "" });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear voucher");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Vouchers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Nuevo Voucher
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Beneficiario</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>QR Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  {new Date(v.createdAt).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell>{(v as any).beneficiary?.name || v.beneficiaryId}</TableCell>
                <TableCell align="right">
                  ${v.amount.toLocaleString()}
                </TableCell>
                <TableCell>{CATEGORY_LABELS[v.category] || v.category}</TableCell>
                <TableCell>
                  <Chip
                    label={v.status}
                    color={
                      v.status === "ACTIVE"
                        ? "success"
                        : v.status === "USED"
                        ? "default"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                    {v.qrCode}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {vouchers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay vouchers
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Voucher</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Beneficiario"
            value={formData.beneficiaryId}
            onChange={(e) => setFormData({ ...formData, beneficiaryId: e.target.value })}
            sx={{ mt: 1, mb: 2 }}
          >
            {beneficiaries.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Monto"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={
              creating ||
              !formData.beneficiaryId ||
              !formData.amount ||
              !formData.category
            }
          >
            {creating ? <CircularProgress size={24} /> : "Crear Voucher"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
