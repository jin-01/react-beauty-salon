import React from 'react';
import './aboutus.css';

function AboutUs() {
  return (
    <div className="aboutUsPage">
    <div className="aboutUsContent">
      <h1 className="aboutUsTitle">About Salon GO</h1>
      <div className="missionVision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            At Salon GO, we are dedicated to enhancing your natural beauty through exceptional salon
            services and personalized care. Our mission is to provide a warm and welcoming
            environment where every client is pampered and valued. We aim to exceed expectations by
            delivering innovative and trendsetting beauty solutions, leaving you feeling confident
            and beautiful.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            Our vision is to be the leading beauty salon, setting new standards for creativity,
            excellence, and customer satisfaction. We strive to be the preferred choice for our
            clients, offering a diverse range of premium services that cater to individual styles
            and preferences. Through continuous growth and collaboration, we aim to inspire
            confidence and empower you to embrace your unique beauty.
          </p>
        </div>
      </div>
      <div className="whyChooseUs">
        <h2>Why Choose Salon GO?</h2>
        <div className="whyChooseUsContent">
          <div className="whyChooseUsItem">
            <span className="featureIcon">👩‍🎨</span>
            <span className="featureTitle">Expert Stylists</span>
            <p>
              Our team of highly skilled and experienced stylists are passionate about their craft and stay updated with the latest trends and techniques.
            </p>
          </div>
          <div className="whyChooseUsItem">
            <span className="featureIcon">🌟</span>
            <span className="featureTitle">Premium Products</span>
            <p>
              We use only the finest salon-grade products to ensure optimal results for your hair and skin without compromising on quality.
            </p>
          </div>
          <div className="whyChooseUsItem">
            <span className="featureIcon">🌿</span>
            <span className="featureTitle">Relaxing Atmosphere</span>
            <p>
              Step into our salon and experience a luxurious and calming ambiance that will make your visit a delightful escape from everyday stress.
            </p>
          </div>
          <div className="whyChooseUsItem">
            <span className="featureIcon">💁‍♀️</span>
            <span className="featureTitle">Personalized Services</span>
            <p>
              We believe in understanding your unique needs and preferences to offer tailored beauty solutions that accentuate your individual style.
            </p>
          </div>
          <div className="whyChooseUsItem">
            <span className="featureIcon">📅</span>
            <span className="featureTitle">Easy Booking</span>
            <p>
              With our user-friendly Salon GO app, scheduling your favorite beauty treatments is just a few taps away, making your salon experience seamless and convenient.
            </p>
          </div>
          <div className="whyChooseUsItem">
            <span className="featureIcon">💖</span>
            <span className="featureTitle">Exceptional Customer Care</span>
            <p>
              At Salon GO, you are not just a customer, but part of our salon family. We go above and beyond to ensure your satisfaction and provide personalized attention to every detail of your salon journey.
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AboutUs;
