import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function MainNavbar() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="premium-navbar sticky-top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          SmartReadsML
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto nav-links">
            <Nav.Link as={Link} to="/" className="nav-item-custom">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/Top50" className="nav-item-custom">
              Curated 50 ⭐
            </Nav.Link>
          </Nav>

          {/* Dark/Light Toggle */}
          <div
            className={`theme-toggle ${darkMode ? "dark" : "light"}`}
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="toggle-track">
              <span className="toggle-icon moon">🌙</span>
              <span className="toggle-icon sun">☀️</span>
              <div className="toggle-thumb" />
            </div>
          </div>

          <Button className="logout-btn ms-3" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
