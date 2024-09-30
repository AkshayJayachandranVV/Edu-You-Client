import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-links">
        <div className="footer-category">
          <span className="category-title">COMPANY</span>
          <ul className="subtopics">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div className="footer-category">
          <span className="category-title">HELP CENTER</span>
          <ul className="subtopics">
            <li>Support</li>
            <li>FAQs</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-category">
          <span className="category-title">RESOURCES</span>
          <ul className="subtopics">
            <li>Blog</li>
            <li>Guides</li>
            <li>Webinars</li>
          </ul>
        </div>
        <div className="footer-category">
          <span className="category-title">PRODUCTS</span>
          <ul className="subtopics">
            <li>Features</li>
            <li>Pricing</li>
            <li>Reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
