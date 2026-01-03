import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";
import EventChat from "./pages/EventChat";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />

        {/* ---------- AUTHENTICATED AREA ---------- */}
        <Route element={<ProtectedRoute />}>

          {/* ---------- LAYOUT ---------- */}
          <Route element={<MainLayout />}>

            {/* ========== ADMIN ROUTES ========== */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* ======== ORGANIZER ROUTES ======== */}
            <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
              <Route
                path="/organizer"
                element={<OrganizerDashboard />}
              />
            </Route>

            {/* ============ USER ROUTES ============ */}
            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route path="/user" element={<UserDashboard />} />
            </Route>

            {/* ======= SHARED CHAT ROUTE ======= */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["organizer", "user"]} />
              }
            >
              <Route path="/event/:eventId/chat" element={<EventChat />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
