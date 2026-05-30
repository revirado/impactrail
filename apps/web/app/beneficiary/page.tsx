"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthStore } from "@/stores/auth.store";
import { useBeneficiaryVouchers } from "@/hooks/useBeneficiaryVouchers";

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: "Alimentos",
  PHARMACY: "Farmacia",
  SCHOOL_SUPPLIES: "Útiles Escolares",
  CLOTHING: "Ropa",
  GENERAL: "General",
};

export default function BeneficiaryHome() {
  const { user } = useAuthStore();
  const {
    activeVouchers,
    usedVouchers,
    loading,
    selectedVoucher,
    setSelectedVoucher,
  } = useBeneficiaryVouchers(user?.id);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Mis Vouchers
      </Typography>

      {activeVouchers.length === 0 && usedVouchers.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          No tenés vouchers disponibles
        </Typography>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Activos ({activeVouchers.length})
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {activeVouchers.map((voucher) => (
          <Card
            key={voucher.id}
            onClick={() => setSelectedVoucher(voucher)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h6">
                    ${voucher.amount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {CATEGORY_LABELS[voucher.category] || voucher.category}
                  </Typography>
                </Box>
                <Chip label={voucher.status} color="success" size="small" />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Código: {voucher.qrCode}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {usedVouchers.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Historial ({usedVouchers.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {usedVouchers.map((voucher) => (
              <Card key={voucher.id} sx={{ opacity: 0.6 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="h6">
                        ${voucher.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {CATEGORY_LABELS[voucher.category] || voucher.category}
                      </Typography>
                    </Box>
                    <Chip label="Canjeado" color="default" size="small" />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      <Dialog
        open={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <IconButton
            onClick={() => setSelectedVoucher(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {selectedVoucher && (
            <>
              <Typography variant="h5" gutterBottom>
                ${selectedVoucher.amount.toLocaleString()}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {CATEGORY_LABELS[selectedVoucher.category] || selectedVoucher.category}
              </Typography>

              <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
                <QRCodeSVG
                  value={selectedVoucher.qrCode}
                  size={200}
                  level="H"
                  includeMargin
                />
              </Box>

              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {selectedVoucher.qrCode}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                Mostrá este código en el comercio para canjear tu voucher
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
