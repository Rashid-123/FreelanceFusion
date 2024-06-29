import React from "react";

const Category_Item = ({ categoryName, image }) => {
  return (
    <div className="scroll-item">
      <h3>{categoryName}</h3>
      <img src={image} alt={categoryName} />
    </div>
  );
};

export default Category_Item;
