import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); // State to manage selected category
  const [categories, setCategories] = useState([]); // State to manage unique categories

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/jobs`
        );
        setJobs(response.data);
        setIsLoading(false);

        // Extract unique categories from jobs
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
    <section className="container ">
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

      <div className="job_container">
        {filteredJobs.map((job) => (
          <Link key={job._id} className="job" to={`/jobDetails/${job._id}`}>
            <h2>{job.title}</h2>
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
