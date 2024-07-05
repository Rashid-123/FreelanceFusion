import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-text">
        <h1>
          Welcome to <span className="free">Free</span>lance🎉
        </h1>
        <h2>
          Find freelancers for your project and get a job, all on the same
          platform.
        </h2>
        <div className="hero_btn">
          <Link to="/create_job">Post Job</Link>
          <Link to="/jobs">Find Job</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
