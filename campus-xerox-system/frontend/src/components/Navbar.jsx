import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="brand">Campus Xerox</span>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/place-order">Place Order</NavLink>
          <NavLink to="/track">Track Order</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
