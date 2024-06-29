import React from "react";

const Testimonial_Item = ({ image, name, description }) => {
  return (
    <div className="testimonial-item">
      <img src={image} alt={name} className="testimonial-image" />
      <h3 className="testimonial-name">{name}</h3>
      <p className="testimonial-description">{description}</p>
    </div>
  );
};

export default Testimonial_Item;
