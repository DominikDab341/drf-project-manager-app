import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import { UserProvider } from './context/UserContext.jsx';


function App() {
  return (
    <>
    <UserProvider>
      <main>
        <Routes>
          {/* Not protected ulrs */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected urls */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
            </Route>
          </Route>
        </Routes>
      </main>
      </UserProvider>
    </>
  );
}

export default App;
