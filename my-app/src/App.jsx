import { useState } from 'react';
import Onboarding from './pages/Onboarding';
import Login from './pages/login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/dashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ROLE_DASHBOARDS = {
  job_seeker: StudentDashboard,
  employer: EmployerDashboard,
  recruiter: RecruiterDashboard,
  admin: AdminDashboard,
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('onboarding');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('onboarding');
  }

  if (user) {
    const DashboardComponent = ROLE_DASHBOARDS[user.role];

    if (!DashboardComponent) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Unrecognized account role: {user.role}</h2>
          <button onClick={handleLogout}>Back to login</button>
        </div>
      );
    }

    return <DashboardComponent onLogout={handleLogout} studentName={user.name} user={user} />;
  }

  if (page === 'login') {
    return (
      <Login
        onLogin={(loggedInUser) => setUser(loggedInUser)}
        onNavigateSignup={() => setPage('signup')}
      />
    );
  }

  if (page === 'signup') {
    return (
      <Signup
        onSignup={(newUser) => setUser(newUser)}
        onNavigateLogin={() => setPage('login')}
      />
    );
  }

  return (
    <Onboarding
      onLogin={() => setPage('login')}
      onRegister={() => setPage('signup')}
    />
  );
}