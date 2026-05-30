"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";

type SystemStatus = "checking" | "serverDown" | "dbDown" | "ok";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [status, setStatus] = useState<SystemStatus>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    checkSystemStatus();
  }, []);

  async function checkSystemStatus() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch("/api/health", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        setStatus("serverDown");
        setErrorMessage(`Servidor no responde (HTTP ${response.status})`);
        return;
      }

      const data = await response.json();

      if (data.status !== "ok") {
        setStatus("serverDown");
        setErrorMessage("El servidor no está funcionando correctamente.");
        return;
      }

      if (!data.databaseConfigured) {
        setStatus("dbDown");
        setErrorMessage("La variable DATABASE_URL no está configurada.");
        return;
      }

      const dbController = new AbortController();
      const dbTimeoutId = setTimeout(() => dbController.abort(), 3000);

      try {
        const dbResponse = await fetch("/api/health/db", { signal: dbController.signal });
        clearTimeout(dbTimeoutId);

        if (!dbResponse.ok) {
          setStatus("dbDown");
          const dbData = await dbResponse.json();
          setErrorMessage(dbData.error || "No se puede conectar con la base de datos.");
          return;
        }

        setStatus("ok");
        setErrorMessage(null);
      } catch {
        clearTimeout(dbTimeoutId);
        setStatus("dbDown");
        setErrorMessage("Timeout al verificar la base de datos.");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus("serverDown");

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          setErrorMessage("Timeout: El servidor no responde en 3 segundos.");
        } else if (err.message.includes("Failed to fetch")) {
          setErrorMessage(
            "No se puede conectar con el servidor. Verifica que esté corriendo con `npm run dev`."
          );
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage("Error desconocido al conectar con el servidor.");
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (status !== "ok") return;

    try {
      await login(email);
      router.push("/");
      router.refresh();
    } catch {
      // Error handled by store
    }
  };

  const quickLogin = async (testEmail: string) => {
    clearError();
    setEmail(testEmail);
    if (status !== "ok") return;

    try {
      await login(testEmail);
      router.push("/");
      router.refresh();
    } catch {
      // Error handled by store
    }
  };

  const isDbError = status === "dbDown";
  const isServerDown = status === "serverDown";

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
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box sx={{ position: "relative", width: 72, height: 72, mx: "auto", mb: 2 }}>
                <Image
                  src="/images/logo.png"
                  alt="IMPACTRAIL Logo"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>
              <Typography variant="h4" gutterBottom>
                IMPACTRAIL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plataforma de distribución auditada de fondos sociales
              </Typography>
            </Box>

            {status === "checking" && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2">Verificando conexión...</Typography>
                </Box>
              </Alert>
            )}

            {(isServerDown || isDbError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  {isServerDown ? "Servidor no disponible" : "Base de datos no disponible"}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {errorMessage}
                </Typography>
                <Box
                  sx={{ mt: 2, p: 2, bgcolor: "rgba(0,0,0,0.04)", borderRadius: 1 }}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Solución rápida:
                  </Typography>
                  <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
                    <li>
                      Asegurate de tener <code>.env.local</code> con:
                      <Box
                        component="pre"
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: "rgba(0,0,0,0.08)",
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        DATABASE_URL=&quot;file:./dev.db&quot;
                      </Box>
                    </li>
                    <li>
                      Ejecutá: <code>npm run db:push</code>
                    </li>
                    <li>
                      Ejecutá: <code>npm run db:seed</code>
                    </li>
                    <li>Reiniciá el servidor</li>
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={checkSystemStatus}
                  sx={{ mt: 2 }}
                >
                  Reintentar
                </Button>
              </Alert>
            )}

            {status === "ok" && error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {status === "ok" && (
              <>
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

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  mb={2}
                >
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

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button
                    component={Link}
                    href="/"
                    variant="text"
                    size="small"
                    sx={{ color: "#4caf50" }}
                  >
                    ← Volver al inicio
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
