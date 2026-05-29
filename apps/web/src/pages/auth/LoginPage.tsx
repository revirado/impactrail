import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email);
    navigate("/");
  };

  const quickLogin = async (testEmail: string) => {
    clearError();
    setEmail(testEmail);
    await login(testEmail);
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Impactrail
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary" mb={4}>
              Plataforma de distribución auditada de fondos sociales
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ mb: 3 }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Ingresar"}
              </Button>
            </form>

            <Typography variant="body2" color="text.secondary" align="center" mb={2}>
              Acceso rápido (demo):
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("admin@techcorp.com")}
                disabled={isLoading}
              >
                Empresa (TechCorp)
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("admin@ayudar.org")}
                disabled={isLoading}
              >
                ONG (Fundación Ayudar)
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("maria@email.com")}
                disabled={isLoading}
              >
                Beneficiario (María)
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => quickLogin("donpedro@comercio.com")}
                disabled={isLoading}
              >
                Comercio (Don Pedro)
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
