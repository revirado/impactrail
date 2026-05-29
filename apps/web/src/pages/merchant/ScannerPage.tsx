import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { voucherService } from "@/services/voucher.service";
import { transactionService } from "@/services/transaction.service";
import { useAuthStore } from "@/stores/auth.store";
import type { Voucher } from "@impactrail/shared-types";

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "Alimentos",
  PHARMACY: "Farmacia",
  SCHOOL_SUPPLIES: "Útiles Escolares",
  CLOTHING: "Ropa",
  GENERAL: "General",
};

export default function MerchantScanner() {
  const { user } = useAuthStore();
  const [qrCode, setQrCode] = useState("");
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSearch() {
    if (!qrCode.trim()) return;
    setLoading(true);
    setError(null);
    setVoucher(null);
    try {
      const data = await voucherService.getByQr(qrCode.trim().toUpperCase());
      setVoucher(data);
    } catch (err) {
      setError("Voucher no encontrado");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!voucher || !user) return;
    setProcessing(true);
    setError(null);
    try {
      await transactionService.process({
        voucherId: voucher.id,
        merchantId: user.id,
      });
      setSuccess(`Transacción aprobada: $${voucher.amount.toLocaleString()}`);
      setVoucher(null);
      setQrCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Escanear Voucher
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="Código QR"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              placeholder="Ej: IR-SEED0001"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading || !qrCode.trim()}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : <QrCodeScannerIcon />}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Ingresá el código del voucher manualmente (en producción se usaría la cámara)
          </Typography>
        </CardContent>
      </Card>

      {voucher && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Voucher Encontrado
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Beneficiario
              </Typography>
              <Typography variant="body1">
                {(voucher as any).beneficiary?.name || voucher.beneficiaryId}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Monto
              </Typography>
              <Typography variant="h5">
                ${voucher.amount.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Categoría
              </Typography>
              <Chip
                label={CATEGORY_LABELS[voucher.category] || voucher.category}
                size="small"
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Estado
              </Typography>
              <Chip
                label={voucher.status}
                color={voucher.status === "ACTIVE" ? "success" : "default"}
                size="small"
              />
            </Box>

            {voucher.status === "ACTIVE" && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                size="large"
                onClick={handleApprove}
                disabled={processing}
              >
                {processing ? (
                  <CircularProgress size={24} />
                ) : (
                  "Aprobar Pago"
                )}
              </Button>
            )}

            {voucher.status !== "ACTIVE" && (
              <Alert severity="warning">
                Este voucher no está activo (estado: {voucher.status})
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
