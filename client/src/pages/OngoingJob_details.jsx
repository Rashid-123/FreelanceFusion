import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const OngoingJob_details = () => {
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
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
        console.log(jobDetails);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, token]);
  console.log(jobDetails);
  if (isLoading) {
    return <Loader />;
  }

  const formattedJobDate = formatDate(jobDetails?.createdAt);

  return (
    <section className="container">
      {jobDetails ? (
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
      ) : (
        <h1>Job Details not found</h1>
      )}
    </section>
  );
};

export default OngoingJob_details;
