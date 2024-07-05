import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const jobCategories = [
  "web development",
  "mobile app development",
  "graphic design",
  "digital marketing",
  "content writing",
  "data entry",
  "customer support",
  "sales",
  "accounting",
  "video production",
  "photography",
];

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState(jobCategories[0]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/jobs/createJob`,
        {
          title,
          description,
          budget,
          category,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }
      );

      if (response.status === 201) {
        setSuccess("Job created successfully!");
        setTitle("");
        setDescription("");
        setBudget("");
        setCategory(jobCategories[0]);
      }
    } catch (error) {
      setError("Failed to create job. Please try again.");
    }
  };

  return (
    <section className="container create_job_container">
      <h1>Post a New Job</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="create_job_form">
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            rows={3}
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input
            type="text"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {jobCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Job</button>
      </form>
    </section>
  );
};

export default CreateJob;
