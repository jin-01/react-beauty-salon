import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './slider.css';

function ImageSlider({ slides }) {
  const sliderSettings = {
    fade: true,
    interval: 2000, // Set the desired interval between slides
    controls: false, // Hide the default arrow controls
    pauseOnHover: false, // Disable pausing on hover
    indicators: true, // Show slide indicators (dots)
  };

  return (
    <div className="slider-container">
      <Carousel {...sliderSettings}>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={`http://localhost:8088/images/` + slide.image}  alt={`Image ${index + 1}`} />
            <Carousel.Caption>
              {/* <h3>{slide.title}</h3>
              <p>{slide.description}</p> */}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
