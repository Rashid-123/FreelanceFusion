import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/userslice";
import ConfirmationPopup from "./ConfirmationPopup";

const Header = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    setShowConfirmation(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <nav>
      <section className="header-section">
        <div className="header">
          <Link to="/" className="logo">
            <span className="free">Free</span>lance
          </Link>
          <div>
            <ul className="header_list">
              {currentUser && (
                <>
                  <li>
                    <Link to="/profile">Rashid</Link>
                  </li>
                  <li>
                    <Link to="/create_job">create</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/jobs">Jobs</Link>
              </li>
            </ul>
            <div>
              {currentUser ? (
                <button onClick={handleLogout} className="logout_btn">
                  Logout
                </button>
              ) : (
                <Link to="/login" className="login_btn">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <ConfirmationPopup
        isOpen={showConfirmation}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </nav>
  );
};

export default Header;
