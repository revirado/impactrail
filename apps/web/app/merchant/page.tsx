"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useAuthStore } from "@/stores/auth.store";
import { useMerchantScanner } from "@/hooks/useMerchantScanner";

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "Alimentos",
  PHARMACY: "Farmacia",
  SCHOOL_SUPPLIES: "Útiles Escolares",
  CLOTHING: "Ropa",
  GENERAL: "General",
};

export default function MerchantScanner() {
  const { user } = useAuthStore();
  const {
    qrCode,
    voucher,
    loading,
    processing,
    error,
    success,
    setQrCode,
    searchVoucher,
    approveTransaction,
    clearMessages,
  } = useMerchantScanner();

  const handleApprove = () => {
    if (user) {
      approveTransaction(user.id);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Escanear Voucher
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>{error}</Alert>}
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
              onKeyPress={(e) => e.key === "Enter" && searchVoucher()}
            />
            <Button
              variant="contained"
              onClick={searchVoucher}
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
                {processing ? <CircularProgress size={24} /> : "Aprobar Pago"}
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
