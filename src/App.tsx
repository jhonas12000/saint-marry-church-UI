import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext"; 
import Sidebar from "./components/Sidebar"; 
import Dashboard from "./pages/Dashboard";
import Committee from "./pages/Comitee"; 
import Members from "./pages/Members"; 
import Education from "./pages/Education";
import Finance from "./pages/Finance";
import Settings from "./pages/Setting";
import SignIn from "./pages/SignIn";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Welcome from "./pages/Welcome";
import MemberProfile from "./pages/MemberProfile";
import FinanceOfficerView from "./components/members/FinanceOfficerView"; 
import AddMemberForm from "./pages/AddMemberForm"
import AddTransactionForm from "./pages/AddTransactionForm";
import BibleStudyPage from "./pages/BibleStudyPage";
import TigrignaStudyPage from "./pages/TigrignaStudyPage"; 
import ClassroomsPage from "./pages/ClassroomsPage";
import AddTeacherForm from "./pages/AddTeacherForm";
import AddClassroomForm from "./pages/AddClassroomForm";


function App() {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  // Layout wrapper (assuming this is correct)
  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/"
          element={isAuthenticated ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Welcome />
          )}
        />

        {/* Protected routes that use the Layout */}
        <Route
          path="/committee"
          element={
            <ProtectedRoute>
              <Layout>
                <Committee />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* --- MAIN MEMBERS HUB --- */}
        {/* This route renders the Members component which contains the List/Table/Finance buttons */}
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Layout>
                <Members /> {/* This component just shows the buttons */}
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/members/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <MemberProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Route for the Finance Officer View */}
        <Route
          path="/members/finance-officer"
          element={
            <ProtectedRoute>
              <Layout>
                <FinanceOfficerView />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education"
          element={
            <ProtectedRoute>
              <Layout>
                <Education />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/bible-study"
          element={
            <ProtectedRoute>
              <Layout>
                <BibleStudyPage /> {/* New component */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/bible-study/teachers/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddTeacherForm /> {/* New component for adding teacher */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/tigrigna-study"
          element={
            <ProtectedRoute>
              <Layout>
                <TigrignaStudyPage /> {/* New component */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/tigrigna-study/teachers/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddTeacherForm /> {/* Re-use AddTeacherForm for Tigrigna */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/classrooms"
          element={
            <ProtectedRoute>
              <Layout>
                <ClassroomsPage /> {/* New component */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/classrooms/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddClassroomForm /> {/* New component for adding classroom */}
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/education/classrooms/:id"
          element={
            <ProtectedRoute>
              <Layout>
                {/* You'll create this ClassroomDetail component later */}
                {/* For now, you can temporarily point it to ClassroomsPage or a simple placeholder */}
                {/* <ClassroomDetail /> */}
                <h1 className="p-6 text-2xl">Classroom Detail Page Placeholder</h1>
              </Layout>
            </ProtectedRoute>
          }
        />
      {/* NEW: Route for updating a specific classroom */}
        <Route
          path="/education/classrooms/:id/edit"
          element={
            <ProtectedRoute>
              <Layout>
                {/* You can reuse AddClassroomForm for updates or create a dedicated one */}
                <AddClassroomForm /> 
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <Layout>
                <Finance />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/add"
          element={ // Consider what roles can add transactions (e.g., ADMIN, FINANCE_OFFICER)
            <ProtectedRoute>
              <Layout>
                <AddTransactionForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Route for adding a new parent (protected) */}
        <Route
          path="/members/add"
          element={ // Consider what roles can add parents (e.g., ADMIN, or authenticated())
            <ProtectedRoute>
              <Layout>
                <AddMemberForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route: redirects to home if authenticated, otherwise to signin */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;