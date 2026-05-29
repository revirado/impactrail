import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Toolbar,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "@/stores/auth.store";

export default function MerchantLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navValue = location.pathname === "/" ? 0 : 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Comercio
          </Typography>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
          mb: 8,
          maxWidth: 600,
          mx: "auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => {
            navigate(newValue === 0 ? "/" : "/transactions");
          }}
        >
          <BottomNavigationAction
            label="Escanear"
            icon={<QrCodeScannerIcon />}
          />
          <BottomNavigationAction
            label="Transacciones"
            icon={<ReceiptIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
