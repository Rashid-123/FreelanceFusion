const ConfirmationPopup = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="confirmation-content">
            <p>Are you sure you want to logout?</p>
            <div className="button-container">
              <button className="confirm-btn" onClick={onConfirm}>
                Logout
              </button>
              <button className="cancel-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationPopup;
