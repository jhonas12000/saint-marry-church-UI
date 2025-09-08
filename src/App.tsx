
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./auth/AuthProvider";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Committee from "./pages/Comitee";
// import Members from "./pages/Members";
// import Education from "./pages/Education";
// import Finance from "./pages/Finance";
// import AddTransactionForm from "./pages/AddTransactionForm";
// import TransactionDetail from "./pages/TransactionDetail";
// import Settings from "./pages/Setting";
// import SignIn from "./pages/SignIn";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Welcome from "./pages/Welcome";
// import MemberProfile from "./pages/MemberProfile";
// import FinanceOfficerView from "./components/members/FinanceOfficerView";
// import AddMemberForm from "./pages/AddMemberForm";
// import BibleStudyPage from "./pages/BibleStudyPage";
// import TigrignaStudyPage from "./pages/TigrignaStudyPage";
// import ClassroomsPage from "./pages/ClassroomsPage";
// import AddTeacherForm from "./pages/AddTeacherForm";
// import AddClassroomForm from "./pages/AddClassroomForm";
// import EditMemberForm from "./pages/EditMemberForm";
// import InviteSignup from "./pages/InviteSignup";
// import SignupPage from "./pages/SignupPage";

// function App() {
//   const { user } = useAuth();
//   const isAuthenticated = !!user;

//   const Layout = ({ children }: { children: React.ReactNode }) => (
//     <div className="flex">
//       <Sidebar />
//       <div className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</div>
//     </div>
//   );

//   return (
//     <Routes>
//       {/* Public */}
//       <Route
//         path="/signin"
//         element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
//       />
//       <Route
//         path="/invite/:token"
//         element={isAuthenticated ? <Navigate to="/" replace /> : <InviteSignup />}
//       />
//       <Route
//         path="/"
//         element={
//           isAuthenticated ? (
//             <Layout>
//               <Dashboard />
//             </Layout>
//           ) : (
//             <Welcome />
//           )
//         }
//       />

//       {/* Committee */}
//       <Route
//         path="/committee"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Committee />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Members */}
//       <Route
//         path="/members"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Members />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/members/add"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <AddMemberForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/members/:id"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <MemberProfile />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/members/:id/edit"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <EditMemberForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/members/finance-officer"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <FinanceOfficerView />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Education */}
//       <Route
//         path="/education"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Education />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/bible-study"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <BibleStudyPage />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/bible-study/teachers/add"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <AddTeacherForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/tigrigna-study"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <TigrignaStudyPage />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/tigrigna-study/teachers/add"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <AddTeacherForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/classrooms"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <ClassroomsPage />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/classrooms/add"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <AddClassroomForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/classrooms/:id"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <h1 className="p-6 text-2xl">Classroom Detail Page Placeholder</h1>
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/education/classrooms/:id/edit"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <AddClassroomForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Finance */}
//       <Route
//         path="/finance"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Finance />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/finance/add"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <AddTransactionForm />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/finance/:id"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <TransactionDetail />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Settings */}
//       <Route
//         path="/settings"
//         element={
//           <ProtectedRoute>
//             <Layout>
//               <Settings />
//             </Layout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Fallback */}
//       <Route
//         path="*"
//         element={
//           isAuthenticated ? (
//             <Navigate to="/" replace />
//           ) : (
//             <Navigate to="/signin" replace />
//           )
//         }
//       />

//       <Route path="/signup" element={<SignupPage />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
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


function App() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );

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
      <Route
        path="/invite/:token"
        element={isAuthenticated ? <Navigate to="/" replace /> : <InviteSignup />}
      />

      {/* Root → Members by default when authenticated */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <Layout>
                <Members />
              </Layout>
            </ProtectedRoute>
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
            <Layout>
              <Committee />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Members */}
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Layout>
              <Members />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddMemberForm />
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
      <Route
        path="/members/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <EditMemberForm />
            </Layout>
          </ProtectedRoute>
        }
      />
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

      {/* Education */}
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
              <BibleStudyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/bible-study/teachers/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddTeacherForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/tigrigna-study"
        element={
          <ProtectedRoute>
            <Layout>
              <TigrignaStudyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/tigrigna-study/teachers/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddTeacherForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms"
        element={
          <ProtectedRoute>
            <Layout>
              <ClassroomsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddClassroomForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <h1 className="p-6 text-2xl">Classroom Detail Page Placeholder</h1>
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/education/classrooms/:id/edit"
        element={
          <ProtectedRoute>
            <Layout>
              <AddClassroomForm />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Finance */}
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
        element={
          <ProtectedRoute>
            <Layout>
              <AddTransactionForm />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionDetail />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Settings */}
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

      {/* Fallback */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />

      <Route path="/admin/invites" element={<CreateInvitePage />} />

      
      <Route path="/pizza-family" element={<PizzaFamilyPage />} />

      <Route path="/pizza-family/add" element={<PizzaFamilyAddPage />} />

      <Route path="/pizza-family/manage/:telephone" element={<PizzaFamilyManagePage />} />

      <Route path="/pizza-family/edit/:id" element={<PizzaContributionEditPage />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>

   
  );
}

export default App;
