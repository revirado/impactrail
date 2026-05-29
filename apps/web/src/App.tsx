import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/auth.store";
import LoginPage from "./pages/auth/LoginPage";
import CorporateLayout from "./layouts/CorporateLayout";
import OngLayout from "./layouts/OngLayout";
import BeneficiaryLayout from "./layouts/BeneficiaryLayout";
import MerchantLayout from "./layouts/MerchantLayout";
import CorporateDashboard from "./pages/corporate/DashboardPage";
import CorporateOperations from "./pages/corporate/OperationsPage";
import OngDashboard from "./pages/ong/DashboardPage";
import OngVouchers from "./pages/ong/VouchersPage";
import BeneficiaryHome from "./pages/beneficiary/HomePage";
import MerchantScanner from "./pages/merchant/ScannerPage";
import MerchantTransactions from "./pages/merchant/TransactionsPage";

function App() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />

      {user.role === "CORPORATE" && (
        <Route element={<CorporateLayout />}>
          <Route path="/" element={<CorporateDashboard />} />
          <Route path="/operations" element={<CorporateOperations />} />
        </Route>
      )}

      {user.role === "ONG" && (
        <Route element={<OngLayout />}>
          <Route path="/" element={<OngDashboard />} />
          <Route path="/vouchers" element={<OngVouchers />} />
        </Route>
      )}

      {user.role === "BENEFICIARY" && (
        <Route element={<BeneficiaryLayout />}>
          <Route path="/" element={<BeneficiaryHome />} />
        </Route>
      )}

      {user.role === "MERCHANT" && (
        <Route element={<MerchantLayout />}>
          <Route path="/" element={<MerchantScanner />} />
          <Route path="/transactions" element={<MerchantTransactions />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
