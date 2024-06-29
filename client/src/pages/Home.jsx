import Hero from "../components/Hero";
import Category from "../components/Category";
import Testimonial from "../components/Testemonial";
const Home = () => {
  return (
    <section className="container home_container">
      <Hero />
      <Category />
      <Testimonial />
    </section>
  );
};

export default Home;
