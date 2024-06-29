import { Link } from "react-router-dom";

import Hero_img from "../assets/Hero.jpg";
const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero">
        <div className="hero_image_box">
          <img src={Hero_img} alt="Hero" />
        </div>
        <div className="hero-text">
          <h1>
            Welcome to <span className="free">Free</span>lance🎉
          </h1>
          <h2>
            Find freelancers for your project and get a job, all on the same
            platform.
          </h2>
          <div className="hero_btn">
            <Link>Post Job</Link>
            <Link>Find Job</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
