import { useEffect, useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const UserProjects = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  useEffect(() => {
    setIsLoading(true);

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/projects/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, [userId, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="container">
      <div className="profile_projects">
        <h2 className="project_tag">Your Projects</h2>
        <div className="container_2">
          {projects.length > 0 ? (
            projects.map((job) => (
              <Link
                key={job._id}
                to={`/project_details/${job._id}`}
                className="job container_3"
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
                  <span>Budget</span> : {job.budget}
                </p>
                <p className="job_category">{job.category}</p>
              </Link>
            ))
          ) : (
            <p>No ongoing jobs found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProjects;
