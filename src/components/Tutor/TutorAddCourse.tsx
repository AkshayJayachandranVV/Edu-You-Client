import React, { useRef, useState } from "react";

const AddCourse: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#0a0c11' }}>
      <div className="w-full max-w-4xl shadow-lg rounded-lg p-8" style={{ backgroundColor: '#1b2532', marginTop: '20px' }}>
        <h2 className="text-3xl font-semibold text-gray-100 mb-8 text-center">Add New Course</h2>

        <form className="space-y-8">
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Course Name</label>
            <input
              type="text"
              className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Course Name"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Course Price</label>
              <input
                type="number"
                className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Course Price"
              />
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Discount Price</label>
              <input
                type="number"
                className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Discount Price"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Course Description</label>
            <textarea
              rows={4}
              className="w-full rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="Write something here..."
            />
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Course Category</label>
              <select className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                <option value="NodeJS">NodeJS</option>
                <option value="React">React</option>
                <option value="JavaScript">JavaScript</option>
                <option value="MongoDB">MongoDB</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Course Level</label>
              <select className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500">
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Demo URL</label>
            <input
              type="text"
              className="w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL"
            />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center items-center mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(event) => {
                  if (event.currentTarget.files && event.currentTarget.files[0]) {
                    const file = event.currentTarget.files[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="bg-blue-600 text-white h-12 rounded-md flex items-center justify-center px-4 hover:bg-blue-700 transition duration-300"
              >
                Upload Thumbnail
              </button>
            </div>
            {previewImage && (
              <img src={previewImage} alt="Thumbnail Preview" className="w-full max-w-md h-auto rounded-md border border-gray-600" />
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
