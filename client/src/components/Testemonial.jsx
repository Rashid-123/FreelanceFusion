import React, { useRef, useEffect, useState } from "react";
import Testimonial_Item from "./Testimonial_Item";
import testimonial1 from "../assets/testimonial1.jpeg";
import testimonial2 from "../assets/testimonial2.jpg";
import testimonial3 from "../assets/testimonial3.jpg";
import testimonial4 from "../assets/testimonial4.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
const Testimonial = () => {
  const scrollContainerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);

  useEffect(() => {
    // Set the item width based on the first item's width
    if (scrollContainerRef.current) {
      const firstItem =
        scrollContainerRef.current.querySelector(".testimonial-item");
      if (firstItem) {
        setItemWidth(
          firstItem.clientWidth +
            parseInt(getComputedStyle(firstItem).marginRight) * 2
        );
      }
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -itemWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: itemWidth,
        behavior: "smooth",
      });
    }
  };

  const testimonials = [
    {
      name: "John Doe",
      image: testimonial1,
      description:
        "This freelancing platform provided an exceptional web development service, delivering a high-quality website that exceeded our expectations. The developer's attention to detail and prompt communication made the entire process smooth and efficient.",
    },
    {
      name: "Jane Smith",
      image: testimonial2,
      description:
        "The platform's graphic design services were outstanding. The designer created visually stunning graphics that perfectly captured our brand's essence. Their creativity and professionalism were evident throughout the project.",
    },
    {
      name: "Sam Johnson",
      image: testimonial3,
      description:
        "The content writing services on this platform were excellent. The writer produced well-researched, engaging, and SEO-friendly articles for our blog. They were timely and communicated effectively, ensuring the project met all our requirements.",
    },
    {
      name: "Sam Altman",
      image: testimonial4,
      description:
        "The content writing services on this platform were excellent. The writer produced well-researched, engaging, and SEO-friendly articles for our blog. They were timely and communicated effectively, ensuring the project met all our requirements.",
    },
  ];

  return (
    <section className="testemonial_container">
      <h2>Happy Clients</h2>
      <div className="testemonial">
        <div className="test_scroll-container">
          <button className="test_scroll-button test_left" onClick={scrollLeft}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{
                color: "#555",
                fontSize: "1.5rem",
              }}
            />
          </button>
          <div className="test_scroll-content" ref={scrollContainerRef}>
            {testimonials.map((testimonial, index) => (
              <Testimonial_Item
                key={index}
                image={testimonial.image}
                name={testimonial.name}
                description={testimonial.description}
              />
            ))}
          </div>
          <button
            className="test_scroll-button test_right"
            onClick={scrollRight}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              style={{ color: "#555", fontSize: "1.5rem" }}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
