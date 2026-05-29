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
import { operationService } from "@/services/operation.service";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Operation, User } from "@impactrail/shared-types";

export default function CorporateOperations() {
  const { user } = useAuthStore();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [ongs, setOngs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ongId: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      const [ops, ongList] = await Promise.all([
        operationService.getAll({ donorId: user?.id }),
        authService.getUsers("ONG"),
      ]);
      setOperations(ops);
      setOngs(ongList);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!user || !formData.ongId || !formData.amount) return;
    setCreating(true);
    setError(null);
    try {
      await operationService.create({
        donorId: user.id,
        ongId: formData.ongId,
        amount: parseFloat(formData.amount),
        description: formData.description,
      });
      setDialogOpen(false);
      setFormData({ ongId: "", amount: "", description: "" });
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear operación");
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
        <Typography variant="h4">Operaciones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Nueva Operación
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>ONG</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Stellar Ref</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operations.map((op) => (
              <TableRow key={op.id}>
                <TableCell>
                  {new Date(op.createdAt).toLocaleDateString("es-AR")}
                </TableCell>
                <TableCell>{(op as any).ong?.name || op.ongId}</TableCell>
                <TableCell align="right">
                  ${op.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={op.status}
                    color={op.status === "COMPLETED" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                    {op.stellarTxRef || "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {operations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay operaciones
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Operación de Fondos</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="ONG Destino"
            value={formData.ongId}
            onChange={(e) => setFormData({ ...formData, ongId: e.target.value })}
            sx={{ mt: 1, mb: 2 }}
          >
            {ongs.map((ong) => (
              <MenuItem key={ong.id} value={ong.id}>
                {ong.name}
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
            fullWidth
            label="Descripción"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !formData.ongId || !formData.amount}
          >
            {creating ? <CircularProgress size={24} /> : "Crear Operación"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
