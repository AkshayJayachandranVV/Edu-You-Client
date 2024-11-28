import { DNA } from 'react-loader-spinner';
import './Spinner2.css';

function Spinner() {
  return (
    <div className="spinner-container">
      <DNA
        visible={true}
        height="350" // Adjust height as needed
        width="350" // Adjust width as needed
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
}

export default Spinner;
