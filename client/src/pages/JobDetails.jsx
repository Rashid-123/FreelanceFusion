import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const JobDetails = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);
  const [bidDescription, setBidDescription] = useState("");
  const [bidBudget, setBidBudget] = useState("");
  const [bidDuration, setBidDuration] = useState("");
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(null);

  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/jobs/details/${id}`
        );
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError(null);
    setBidSuccess(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/jobs/add_proposal/${id}`,
        {
          freelancerId: userId,
          proposalText: bidDescription,
          budget: bidBudget,
          duration: bidDuration,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setBidSuccess("Bid placed successfully!");
        setBidDescription("");
        setBidBudget("");
        setBidDuration("");
      }
    } catch (error) {
      setBidError(error.response.data.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!jobDetails) {
    return <div>Job not found</div>;
  }

  const formattedDate = new Date(jobDetails.createdAt).toLocaleDateString(
    undefined,
    {
      weekday: "long", // 'long' for the full name, 'short' for abbreviated
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <section className="container">
      <div className="job_details_container">
        <div>
          <p className="job_details_date">{formattedDate}</p>
          <h1>{jobDetails.title}</h1>
        </div>

        <p className="job-details_description">{jobDetails.description}</p>
        <p className="job_details_budget">
          <span>Budget : </span>
          {jobDetails.budget}
        </p>
        <p className="job_details_duration">
          <span>Duration : </span> {jobDetails.duration}
        </p>
        <p className="job_details_category">
          <span>Skill required : </span>
          <span className="skill">{jobDetails.category}</span>
        </p>
        <p className="status">
          Status :<span>{jobDetails.status}</span>
        </p>
        <p className="job_details_duration">
          <span>Total Bids : </span> {jobDetails.proposals.length}
        </p>
      </div>
      {jobDetails.client != userId ? (
        <div className="bid_container">
          <h2>Place your bid</h2>
          <form onSubmit={handleBidSubmit} className="bid_details">
            <div className="bid-group">
              <label htmlFor="bidDescription">Description</label>
              <textarea
                rows={3}
                id="bidDescription"
                value={bidDescription}
                onChange={(e) => setBidDescription(e.target.value)}
                required
              />
            </div>
            <div className="bid-group">
              <label htmlFor="bidBudget">Budget</label>
              <div className="bid-budget-container">
                <span className="dollar-sign">$ (USD) </span>
                <input
                  type="number"
                  id="bidBudget"
                  value={bidBudget}
                  onChange={(e) => setBidBudget(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="bid-group">
              <label htmlFor="bidDuration">Duration</label>
              <input
                type="text"
                id="bidDuration"
                value={bidDuration}
                onChange={(e) => setBidDuration(e.target.value)}
                required
              />
            </div>
            {bidError && <p className="bid-error">{bidError}</p>}
            {bidSuccess && <p className="bid-success">{bidSuccess}</p>}
            <button type="submit" className="bid-submit">
              Place Bid
            </button>
          </form>
        </div>
      ) : (
        <h2 className="bid_container">
          This is your Project , you can't bid on this{" "}
        </h2>
      )}
    </section>
  );
};

export default JobDetails;
