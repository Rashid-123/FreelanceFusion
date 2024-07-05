import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobDetails = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!jobDetails) {
    return <div>Job not found</div>;
  }

  return (
    <section className="container">
      <div>
        <h2>{jobDetails.title}</h2>
        <p>{jobDetails.description}</p>
        <p>{jobDetails.budget}</p>
        <p>{jobDetails.category}</p>
        <p>{jobDetails.status}</p>
      </div>
    </section>
  );
};

export default JobDetails;
