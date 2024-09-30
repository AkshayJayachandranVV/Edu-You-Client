import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css'; // Import the CSS file
import errorImage from '../../../../src/assets/images/Tutor/404/Designer tutor.jpeg'; // Replace with your image path

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/tutor/dashboard');
  };

  return (
    <div className="error-page-tutor">
      <div className="error-image-container-tutor">
        <img src={errorImage} alt="404 Error" className="error-image-tutor" />
      </div>
      <div className="error-content-tutor">
        <h1 className="error-title-tutor">404</h1>
        <p className="error-subtitle-tutor">Oops! Page Not Found</p>
        <p className="error-message-tutor">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={handleGoHome} className="error-button-tutor">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
