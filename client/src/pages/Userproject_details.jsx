import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import ProjectProposalContainer from "../components/ProjectProposalContainer";

const Userproject_details = () => {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setJobDetails(response.data);
        console.log(jobDetails);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, []);
  console.log(jobDetails);
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
          <span className="skill">
            {jobDetails.category || "Not specified"}
          </span>
        </p>
        <p className="status">
          Status :<span>{jobDetails.status}</span>
        </p>
        <p className="job_details_duration">
          <span>Total Bids : </span> {jobDetails.proposals?.length || 0}
        </p>
      </div>
      <h2 className="project_proposal_label">Proposals</h2>
      <ProjectProposalContainer jobDetails={jobDetails} />
    </section>
  );
};

export default Userproject_details;
