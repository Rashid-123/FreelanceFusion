import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const OngoingProjects = () => {
  const [LiveProjects, setLiveProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;
  const token = currentUser?.token;

  useEffect(() => {
    if (!userId || !token) return;
    setIsLoading(true);
    const fetchOngoingProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/ongoingProjects/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);

        setLiveProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOngoingProjects();
  }, [userId, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="container">
      <h2>Ongoing Projects</h2>
      <div className="container_2">
        {LiveProjects?.length > 0 ? (
          LiveProjects.map((item) => (
            <Link
              key={item._id}
              className="container_3"
              to={`/ongoingProject_details/${item._id}`}
            >
              <h2 className="job_title">
                {item.title.length > 35
                  ? `${item.title.slice(0, 35)}...`
                  : item.title}
              </h2>
              <p className="job_description">
                {item.description.length > 100
                  ? `${item.description.slice(0, 100)}...`
                  : item.description}
              </p>
              <p className="job_budget">
                <span>Budget</span> : {item.amount}
              </p>
              <p className="job_status">
                progress : <span>mileston {item.milestones.length + 1}</span>
              </p>
            </Link>
          ))
        ) : (
          <p>No ongoing projects found.</p>
        )}
      </div>
    </section>
  );
};

export default OngoingProjects;
