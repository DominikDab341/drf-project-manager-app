import { Link, useNavigate } from 'react-router-dom';
import '../css/navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">Home</Link>
      </div>
      
      <div className="navbar-center">
        <span className="navbar-title">Project Manager</span>
      </div>
      
      <div className="navbar-actions">
        <button className="navbar-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;