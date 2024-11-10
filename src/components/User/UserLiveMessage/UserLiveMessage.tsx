import React from 'react';


export default function LiveStreamModal({ show, onGoLive, onCancel }) {
    if (!show) return null; // Don't render the modal if 'show' is false

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold">Live Stream Available</h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <span className="text-2xl font-bold">&times;</span>
                    </button>
                </div>
                <div className="mt-4">
                    <p>The tutor has started a live stream. Would you like to join?</p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        onClick={onCancel} 
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onGoLive} 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go Live
                    </button>
                </div>
            </div>
        </div>
    );
}
