import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav>
      <section className="header-section">
        <div className="header">
          <Link to="/" className="logo">
            <span className="free">Free</span>lance
          </Link>
          <div>
            <ul className="header_list">
              <li>
                <Link>Rashid</Link>
              </li>
              <li>
                <Link>Jobs</Link>
              </li>
            </ul>
            <div>
              <Link to="/login" className="login_btn">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Header;
