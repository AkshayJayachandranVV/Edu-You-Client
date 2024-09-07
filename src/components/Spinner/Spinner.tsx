import { DNA } from 'react-loader-spinner';
import './Spinner.css';  // Import the CSS file

function Spinner() {
    return (
        <div className="spinner-container">
            <DNA
                visible={true}
                height="200"
                width="1000"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    );
}

export default Spinner;
