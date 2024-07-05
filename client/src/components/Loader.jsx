import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loader = () => {
  return (
    <div className="loader-container">
      <FontAwesomeIcon icon={faSpinner} className="fa-spin loader-icon" />
    </div>
  );
};

export default Loader;
