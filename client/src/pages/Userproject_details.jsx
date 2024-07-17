import { useState, useEffect } from "react";
import { resolvePath, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const Userproject_details = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  // Function to format the date
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
          `${import.meta.env.VITE_BASE_URL}/jobs/details/${id}`
        );
        console.log(response.data);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!jobDetails) {
    return <p>Job details not found.</p>;
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
      <h2 className="project_proposal_label">Proposals</h2>
      <div className="project_proposal_container">
        {jobDetails.proposals.map((item) => (
          <div key={item._id} className="proposal">
            <p>{item.proposalText}</p>
            <p>{item.budget}</p>
            <p>{item.duration}</p>
            <p>{item.status}</p>
            <p>{formatDate(item.createdAt)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Userproject_details;
