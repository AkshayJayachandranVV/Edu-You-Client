import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { saveAddCourse } from "../../../src/redux/courseSlice";
import axios from "axios";
import { tutorEndpoints } from "../../components/constraints/endpoints/TutorEndpoints";

interface CourseFormData {
  courseName: string;
  coursePrice: number;
  discountPrice: number;
  courseDescription: string;
  courseCategory: string;
  courseLevel: string;
  demoURL: string;
  thumbnail: string;
}

interface AddCourseProps {
  onNext: () => void; // Add a prop for next step
}

const AddCourse: React.FC<AddCourseProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const courseData = useSelector((state: any) => state.course.courseDetails);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<CourseFormData>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    // Populate the form fields with data from Redux if it exists
    if (courseData) {
      setValue("courseName", courseData.courseName || "");
      setValue("coursePrice", courseData.coursePrice || 0);
      setValue("discountPrice", courseData.courseDiscountPrice || 0);
      setValue("courseDescription", courseData.courseDescription || "");
      setValue("courseCategory", courseData.courseCategory || "");
      setValue("courseLevel", courseData.courseLevel || "");
      setValue("demoURL", courseData.demoURL || "");
      setPreviewImage(courseData.thumbnail || null);
    }
  }, [courseData, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // Preview the image if needed
      };
      reader.readAsDataURL(file); // Convert file to base64 for preview
      setUploadedFile(file); // Set the uploaded file
    } else {
      alert("Please select a valid file.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const generateFileName = (originalName: string) => {
    const extension = originalName.split(".").pop();
    return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
  };

const uploadThumbnail = async (): Promise<string | null> => {
  console.log("Entered to uploadThumbnail");

  // Check if there's a previously uploaded image (previewImage)
  if (!uploadedFile && !previewImage) {
    alert("Please select a file first!");
    return null;
  }

  // If the image was already uploaded (previewImage exists), skip the upload
  if (previewImage && !uploadedFile) {
    return previewImage; // Use the existing image URL
  }

  try {
    const fileName = generateFileName(uploadedFile!.name); // Ensure uploadedFile is defined
    const response = await axios.get(tutorEndpoints.getPresignedUrlForUpload, {
      params: {
        filename: fileName,
        fileType: uploadedFile!.type.startsWith('image') ? 'image' : 'video',
      },
    });

    console.log(response, "API Gateway result");

    const { url, key } = response.data; // Get the presigned URL and the S3 key

    console.log(url, key, "S3 presigned URL and key");

    // Upload the file to S3 using the presigned URL
    const result = await axios.put(url, uploadedFile, {
      headers: {
        "Content-Type": uploadedFile!.type, // Ensure correct content type
      },
    });

    console.log("Upload result:", result);

    if (result.status === 200) {
      setUploadStatus(`Upload successful! File stored at key: ${key}`);

      // Construct and return the public URL
      const publicUrl = `https://edu-you-uploads.s3.amazonaws.com/${key}`;
      return publicUrl;
    } else {
      setUploadStatus("Upload failed.");
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    setUploadStatus("Error uploading file.");
    return null;
  }
};


  const onSubmit = async (data: CourseFormData) => {
    const { courseName, coursePrice, discountPrice, courseDescription, courseCategory, courseLevel, demoURL } = data;

    // Upload thumbnail to S3
    const s3Key = await uploadThumbnail();

    if (s3Key || previewImage) {
      // Dispatch Redux action with the form data and the S3 thumbnail key
      dispatch(
        saveAddCourse({
          courseName,
          courseDescription,
          coursePrice,
          courseDiscountPrice: discountPrice,
          courseCategory,
          courseLevel,
          demoURL,
          thumbnail: s3Key || previewImage, // Save the S3 key for the uploaded thumbnail or use existing
        })
      );

      // Move to the next step in the course creation process
      onNext();
    } else {
      console.error("Failed to upload thumbnail. No S3 key returned.");
    }
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#0a0c11" }}>
      <div className="w-full max-w-4xl shadow-lg rounded-lg p-8" style={{ backgroundColor: "#1b2532", marginTop: "20px" }}>
        <h2 className="text-3xl font-semibold text-gray-100 mb-8 text-center">Add New Course</h2>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Course Name */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Course Name</label>
            <Controller
              name="courseName"
              control={control}
              defaultValue=""
              rules={{ required: "Course name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                    errors.courseName ? "border-red-500" : "border-gray-600"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Course Name"
                />
              )}
            />
            {errors.courseName && <span className="text-red-500">{errors.courseName.message}</span>}
          </div>

          {/* Course Price and Discount Price */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course Price */}
            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Course Price</label>
              <Controller
                name="coursePrice"
                control={control}
                defaultValue={0}
                rules={{ required: "Course price is required", min: { value: 0, message: "Price must be a positive number" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.coursePrice ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter Course Price"
                  />
                )}
              />
              {errors.coursePrice && <span className="text-red-500">{errors.coursePrice.message}</span>}
            </div>

            {/* Discount Price */}
            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Discount Price</label>
              <Controller
                name="discountPrice"
                control={control}
                defaultValue={0}
                rules={{ required: "Discount price is required", min: { value: 0, message: "Price must be a positive number" } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.discountPrice ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter Discount Price"
                  />
                )}
              />
              {errors.discountPrice && <span className="text-red-500">{errors.discountPrice.message}</span>}
            </div>
          </div>

          {/* Course Description */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Course Description</label>
            <Controller
              name="courseDescription"
              control={control}
              defaultValue=""
              rules={{ required: "Course description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className={`w-full rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                    errors.courseDescription ? "border-red-500" : "border-gray-600"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Write something here..."
                />
              )}
            />
            {errors.courseDescription && <span className="text-red-500">{errors.courseDescription.message}</span>}
          </div>

          {/* Course Category and Level */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Course Category */}
            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Course Category</label>
              <Controller
                name="courseCategory"
                control={control}
                defaultValue=""
                rules={{ required: "Course category is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.courseCategory ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Category</option>
                    <option value="NodeJS">NodeJS</option>
                    <option value="React">React</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="MongoDB">MongoDB</option>
                  </select>
                )}
              />
              {errors.courseCategory && <span className="text-red-500">{errors.courseCategory.message}</span>}
            </div>

            {/* Course Level */}
            <div className="flex-1 flex flex-col gap-4">
              <label className="text-lg font-medium text-gray-300">Course Level</label>
              <Controller
                name="courseLevel"
                control={control}
                defaultValue=""
                rules={{ required: "Course level is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.courseLevel ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                )}
              />
              {errors.courseLevel && <span className="text-red-500">{errors.courseLevel.message}</span>}
            </div>
          </div>

          {/* Demo Video URL */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Demo Video URL</label>
            <Controller
              name="demoURL"
              control={control}
              defaultValue=""
              rules={{ required: "Demo URL is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                    errors.demoURL ? "border-red-500" : "border-gray-600"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter demo video URL"
                />
              )}
            />
            {errors.demoURL && <span className="text-red-500">{errors.demoURL.message}</span>}
          </div>

          {/* Course Thumbnail */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Course Thumbnail</label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Upload Thumbnail
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>

            {previewImage && (
              <div className="mt-4">
                <img src={previewImage} alt="Thumbnail Preview" className="w-64 h-40 object-cover" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md"
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
