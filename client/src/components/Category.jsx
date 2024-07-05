import Category_Item from "./Category_Item";
import web from "../assets/web.webp";
import app from "../assets/app.jpeg";
import content from "../assets/content.jpg";
import customer from "../assets/customer.png";
import digital from "../assets/digital.webp";
import graphic from "../assets/graphic.jpeg";
import photography from "../assets/photography.jpeg";
import sales from "../assets/sales.webp";
import data from "../assets/data.webp";
import accounting from "../assets/accounting.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
const Category = () => {
  const scrollLeft = () => {
    document.querySelector(".scroll-content").scrollBy({
      left: -700, // Adjust this value based on the width of your items
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.querySelector(".scroll-content").scrollBy({
      left: 700, // Adjust this value based on the width of your items
      behavior: "smooth",
    });
  };

  const categories = [
    { name: "Web Development", image: web },
    { name: "App Development", image: app },
    { name: "Data Entry", image: data },
    { name: "Customer Support", image: customer },
    { name: "Sales", image: sales },
    { name: "Accounting", image: accounting },
    { name: "Graphic Design", image: graphic },
    { name: "Digital Marketing", image: digital },
    { name: "Content Writing", image: content },
    { name: "Photography", image: photography },
  ];

  return (
    <section className="category">
      <h1 className="popular">Popular services</h1>
      <div className="scrollable-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            style={{
              color: "#555",
              fontSize: "1.5rem",
            }}
          />
        </button>
        <div className="scroll-content">
          {categories.map((category, index) => (
            <Category_Item
              key={index}
              categoryName={category.name}
              image={category.image}
            />
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ color: "#555", fontSize: "1.5rem" }}
          />
        </button>
      </div>
    </section>
  );
};

export default Category;
