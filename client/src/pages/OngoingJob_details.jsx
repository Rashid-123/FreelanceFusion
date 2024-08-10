import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const OngoingJob_details = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    description: "",
  });

  const { id } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/ongoingjob_details/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, token]);

  const handleMilestoneChange = (e) => {
    setNewMilestone({ ...newMilestone, [e.target.name]: e.target.value });
  };

  const addMilestone = async () => {
    if (jobDetails?.milestones.length >= 3) {
      alert("You can have a maximum of 3 milestones");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/addMilestone/${id}`,
        newMilestone,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobDetails(response.data);
      setNewMilestone({ description: "" });
    } catch (error) {
      console.error("Error adding milestone:", error);
    }
  };

  const confirmMilestone = async (milestoneIndex) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/users/confirmMilestone/${id}`,
        { milestoneIndex },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobDetails(response.data);
    } catch (error) {
      console.error("Error confirming milestone:", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!jobDetails) {
    return <h1>Job Details not found</h1>;
  }

  const formattedJobDate = formatDate(jobDetails.createdAt);

  return (
    <section className="container">
      <div className="job_details_container">
        <div>
          <p className="job_details_date">{formattedJobDate}</p>
          <h1>{jobDetails.title}</h1>
        </div>
        <p className="job-details_description">{jobDetails.description}</p>
        <p className="job_details_budget">
          <span>Budget : </span>
          {jobDetails.amount}
        </p>
        <p className="job_details_duration">
          <span>Duration : </span> {jobDetails.duration}
        </p>
        <p className="status">
          Status :<span>{jobDetails.status}</span>
        </p>
      </div>
      {/* Milestones Section */}
      {userId === jobDetails.client && (
        <div className="milestones">
          <h3>Milestones</h3>
          <ul>
            {jobDetails.milestones.map((milestone, index) => (
              <li key={index}>
                <p>{milestone.description}</p>
                <p>
                  Status: {milestone.confirmed ? "Confirmed" : "Not Confirmed"}
                </p>
                {userId === jobDetails.client && !milestone.confirmed && (
                  <button onClick={() => confirmMilestone(index)}>
                    Confirm Milestone
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {userId === jobDetails.freelancer && jobDetails.milestones.length < 3 && (
        <div className="add-milestone">
          <h4>Add Milestone</h4>
          <input
            type="text"
            name="description"
            placeholder="Milestone Description"
            value={newMilestone.description}
            onChange={handleMilestoneChange}
          />
          <button onClick={addMilestone}>Add Milestone</button>
        </div>
      )}
    </section>
  );
};

export default OngoingJob_details;
