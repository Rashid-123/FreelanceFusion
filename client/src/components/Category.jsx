const Category = () => {
  const scrollLeft = () => {
    document.querySelector(".scroll-content").scrollBy({
      left: -200, // Adjust this value based on the width of your items
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    document.querySelector(".scroll-content").scrollBy({
      left: 200, // Adjust this value based on the width of your items
      behavior: "smooth",
    });
  };

  return (
    <section className="scroll-container">
      <button className="scroll-button left" onClick={scrollLeft}>
        &larr;
      </button>
      <div className="scroll-content">
        <div className="scroll-item">Item 1</div>
        <div className="scroll-item">Item 2</div>
        <div className="scroll-item">Item 3</div>
        <div className="scroll-item">Item 4</div>
        <div className="scroll-item">Item 5</div>
        <div className="scroll-item">Item 6</div>
      </div>
      <button className="scroll-button right" onClick={scrollRight}>
        &rarr;
      </button>
    </section>
  );
};

export default Category;
