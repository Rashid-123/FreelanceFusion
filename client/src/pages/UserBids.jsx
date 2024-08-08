import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
const UserBids = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;
  useEffect(() => {
    setIsLoading(true);

    const fetchBids = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/userBids/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(response.data)) {
          setBids(response.data);
        } else {
          console.error("Unexpected response data format", response.data);
          setError("Unexpected response data format");
        }
      } catch (error) {
        console.error("Error fetching bids:", error); // Log the error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          if (error.response.status === 402) {
            setError("Payment Required to access this resource.");
          } else {
            setError("Failed to fetch bids. Please try again later.");
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          setError("No response received from server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          setError("Failed to fetch bids. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchBids();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!Array.isArray(bids) || bids.length === 0) {
    return <div className="container">No bids found</div>;
  }

  return (
    <section className="container">
      <div className="profile_proposalsend">
        <h2 className="profile_proposal_tag">Your Bids</h2>

        <div className="profile_proposal_container">
          {bids.map((item) => (
            <Link key={item._id} to={`/jobDetails/${item.job}`} className="job">
              <h2>
                {item.job.title && item.job.title.length > 35
                  ? `${item.job.title.slice(0, 35)}...`
                  : item.job.title}
              </h2>
              <p className="job_description">
                {item.proposalText && item.proposalText.length > 100
                  ? `${item.proposalText.slice(0, 100)}...`
                  : item.proposalText}
              </p>
              <p className="job_budget">
                <span>Budget</span> : {item.budget}
              </p>
              <p className="bid_status">
                Status : <span>{item.status}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserBids;
