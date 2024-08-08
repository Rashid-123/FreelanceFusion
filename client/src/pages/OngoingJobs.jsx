import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const OngoingJobs = () => {
  const [liveJobs, setLiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  useEffect(() => {
    if (!userId || !token) return;
    setIsLoading(true);
    const fetchOngoingJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/ongoingJobs/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLiveJobs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching ongoing jobs:", error);
      }
    };

    fetchOngoingJobs();
  }, [userId, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="container">
      <h2>Ongoing Jobs</h2>
      <div className="container_2">
        {liveJobs.length > 0 ? (
          liveJobs.map((job) => (
            <Link
              key={job._id}
              className="container_3"
              to={`/ongoingJob_details/${job._id}`}
            >
              <h2 className="job_title">
                {job.title.length > 35
                  ? `${job.title.slice(0, 35)}...`
                  : job.title}
              </h2>
              <p className="job_description">
                {job.description.length > 100
                  ? `${job.description.slice(0, 100)}...`
                  : job.description}
              </p>
              <p className="job_budget">
                <span>Budget</span>: {job.amount}
              </p>
              <p className="job_status">
                Progress: <span>Milestone {job.milestones.length + 1}</span>
              </p>
            </Link>
          ))
        ) : (
          <p>No ongoing jobs found.</p>
        )}
      </div>
    </section>
  );
};

export default OngoingJobs;
