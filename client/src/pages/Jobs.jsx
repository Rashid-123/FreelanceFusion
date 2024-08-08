import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
// import Job from "../components/Job";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/jobs`
        );
        setJobs(response.data);
        setIsLoading(false);

        const uniqueCategories = [
          ...new Set(response.data.map((job) => job.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.log("error in Fetching jobs", error);
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredJobs = selectedCategory
    ? jobs.filter((job) => job.category === selectedCategory)
    : jobs;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="container">
      <div className="category_filter">
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="container_2">
        {filteredJobs.map((job) => (
          <Link
            key={job._id}
            to={`/jobDetails/${job._id}`}
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
        ))}
      </div>
    </section>
  );
};

export default Jobs;
