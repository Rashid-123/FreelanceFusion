import Hero from "../components/Hero";
import Category from "../components/Category";
import Testimonial from "../components/Testemonial";
import Loader from "../components/Loader";
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
