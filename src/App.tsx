import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import Committee from "./pages/Committee";
import Members from "./pages/Members";
import Education from "./pages/Education";
import Finance from "./pages/Finance";
import AddTransactionForm from "./pages/AddTransactionForm";
import TransactionDetail from "./pages/TransactionDetail";
import Settings from "./pages/Setting";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import MemberProfile from "./pages/MemberProfile";
import FinanceOfficerView from "./components/members/FinanceOfficerView";
import AddMemberForm from "./pages/AddMemberForm";
import BibleStudyPage from "./pages/BibleStudyPage";
import TigrignaStudyPage from "./pages/TigrignaStudyPage";
import ClassroomsPage from "./pages/ClassroomsPage";
import AddTeacherForm from "./pages/AddTeacherForm";
import AddClassroomForm from "./pages/AddClassroomForm";
import EditMemberForm from "./pages/EditMemberForm";
import InviteSignup from "./pages/InviteSignup";
import SignupPage from "./pages/SignupPage";
import CreateInvitePage from "./pages/CreateInvitePage";
import PizzaFamilyPage from "./pages/PizzaFamilyPage";
import PizzaFamilyAddPage from "./pages/PizzaFamilyAddPage";
import PizzaFamilyManagePage from "./pages/PizzaFamilyManagePage";
import PizzaContributionEditPage from "./pages/PizzaContributionEditPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CommitteeProfilePage from "./pages/CommitteeProfilePage";
import Dashboard from "./pages/Dashboard";
import TeachersList from "./pages/TeachersList";

// 🔹 Use the new Layout with hamburger + drawer
import AppLayout from "./layout/Layout";

function App() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
      />
      {/* <Route
        path="/invite"
        element={isAuthenticated ? <Navigate to="/" replace /> : <InviteSignup />}
      /> */}
      <Route path="/invite" element={<InviteSignup />} />
      {/* <Route
        path="/invite/:token"
        element={isAuthenticated ? <Navigate to="/" replace /> : <InviteSignup />}
      /> */}
      <Route path="/invite/:token" element={<InviteSignup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Root → Members by default when authenticated */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout title="Dashboard">
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Welcome />
          )
        }
      />

      {/* Committee */}
      <Route
        path="/committee"
        element={
          <ProtectedRoute>
            <AppLayout title="Committee">
              <Committee />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/me"
        element={
          <ProtectedRoute>
            <AppLayout title="My Profile">
              <CommitteeProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/:id"
        element={
          <ProtectedRoute roles={["ADMIN", "CHAIRPERSON"]}>
            <AppLayout title="Edit Member">
              <CommitteeProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Members */}
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <AppLayout title="Members">
              <Members />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/add"
        element={
          <ProtectedRoute>
            <AppLayout title="Add Member">
              <AddMemberForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/:id"
        element={
          <ProtectedRoute>
            <AppLayout title="Member Profile">
              <MemberProfile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout title="Edit Member">
              <EditMemberForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/finance-officer"
        element={
          <ProtectedRoute>
            <AppLayout title="Finance Officer">
              <FinanceOfficerView />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Education */}
      <Route
        path="/education"
        element={
          <ProtectedRoute>
            <AppLayout title="Education">
              <Education />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/education/teachers"
        element={
          <ProtectedRoute>
            <AppLayout title="Teachers List">
              <TeachersList />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/education/bible-study"
        element={
          <ProtectedRoute>
            <AppLayout title="Bible Study">
              <BibleStudyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/bible-study/teachers/add"
        element={
          <ProtectedRoute>
            <AppLayout title="Add Teacher">
              <AddTeacherForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/tigrigna-study"
        element={
          <ProtectedRoute>
            <AppLayout title="Tigrigna Study">
              <TigrignaStudyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/tigrigna-study/teachers/add"
        element={
          <ProtectedRoute>
            <AppLayout title="Add Teacher">
              <AddTeacherForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms"
        element={
          <ProtectedRoute>
            <AppLayout title="Classrooms">
              <ClassroomsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms/add"
        element={
          <ProtectedRoute>
            <AppLayout title="Add Classroom">
              <AddClassroomForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms/:id"
        element={
          <ProtectedRoute>
            <AppLayout title="Classroom">
              <h1 className="p-6 text-2xl">Classroom Detail Page Placeholder</h1>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms/:id/edit"
        element={
          <ProtectedRoute>
            <AppLayout title="Edit Classroom">
              <AddClassroomForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Finance */}
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <AppLayout title="Finance">
              <Finance />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/add"
        element={
          <ProtectedRoute>
            <AppLayout title="Add Transaction">
              <AddTransactionForm />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/:id"
        element={
          <ProtectedRoute>
            <AppLayout title="Transaction">
              <TransactionDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout title="Settings">
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Invites */}
      <Route
        path="/admin/invites"
        element={
          <ProtectedRoute>
            <AppLayout title="Invites">
              <CreateInvitePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Pizza Family (wrap in layout if you want the hamburger here too) */}
      <Route
        path="/pizza-family"
        element={
          <AppLayout title="Pizza Family">
            <PizzaFamilyPage />
          </AppLayout>
        }
      />
      <Route
        path="/pizza-family/add"
        element={
          <AppLayout title="Add Family">
            <PizzaFamilyAddPage />
          </AppLayout>
        }
      />
      <Route
        path="/pizza-family/manage/:telephone"
        element={
          <AppLayout title="Manage Family">
            <PizzaFamilyManagePage />
          </AppLayout>
        }
      />
      <Route
        path="/pizza-family/edit/:id"
        element={
          <AppLayout title="Edit Contribution">
            <PizzaContributionEditPage />
          </AppLayout>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />
        }
      />
    </Routes>
  );
}

export default App;

