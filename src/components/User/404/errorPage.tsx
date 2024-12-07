import React from 'react';
import { useNavigate } from 'react-router-dom';
import './errorPage.css'; // Import the CSS file
import errorImage from '../../../../src/assets/images/User/404Page/Designer.jpeg'; // Replace with your image path

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="error-page">
      <div className="error-image-container">
        <img src={errorImage} alt="404 Error" className="error-image" />
      </div>
      <div className="error-content">
        <h1 className="error-title">404</h1>
        <p className="error-subtitle">Oops! Page Not Found</p>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={handleGoHome} className="error-button">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
