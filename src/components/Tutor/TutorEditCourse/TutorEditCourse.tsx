import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { editAddCourse } from "../../../redux/editCourseSlice";
import axios from "axios";
import { tutorEndpoints } from "../../constraints/endpoints/TutorEndpoints";
import { RootState } from "../../../redux/store";

interface CourseFormData {
  courseName: string;
  coursePrice: number;
  discountPrice: number;
  courseDescription: string;
  courseCategory: string;
  courseLevel: string;
  demoURL: string;
  thumbnail: string;
  thumbnailUrl: string;
}

interface AddCourseProps {
  onNext: () => void; // Add a prop for next step
}

const EditCourse: React.FC<AddCourseProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const courseData = useSelector((state: RootState) => state.editCourse.courseDetails);
  const { control, handleSubmit, setValue,getValues, formState: { errors } } = useForm<CourseFormData>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  
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

      // Set existing thumbnail and thumbnail URL values
      const existingThumbnailKey = courseData.thumbnail || ""; // Keep existing thumbnail key
      const existingThumbnailUrl = courseData.thumbnailUrl || null; // Ensure it defaults to null if not present
      setValue("thumbnail", existingThumbnailKey); // Set thumbnail field
      setValue("thumbnailUrl", existingThumbnailUrl || ""); // Set thumbnailUrl in the form state
      setPreviewImage(existingThumbnailUrl); // Set preview image to existing URL if available
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

  const uploadThumbnail = async (existingThumbnailKey: string, existingThumbnailUrl: string): Promise<{ url: string; key: string } | null> => {
    console.log("Entered uploadThumbnail");
  
    // If no new file and no preview image, return the existing thumbnail info
    if (!uploadedFile && !previewImage) {
      alert("Please select a file first!");
      return null;
    }
  
    // If there's a preview image but no new file, use the existing key and URL
    if (previewImage && !uploadedFile) {
      return { url: existingThumbnailUrl, key: existingThumbnailKey }; // Use the existing values
    }
  
    try {
      const fileName = generateFileName(uploadedFile!.name);
  
      const response = await axios.get(tutorEndpoints.getPresignedUrlForUpload, {
        params: {
          filename: fileName,
          fileType: uploadedFile!.type.startsWith('image') ? 'image' : 'video',
        },
      });
  
      const { uploadUrl, viewUrl, key } = response.data;
  
      console.log("S3 key:", key, "View URL:", viewUrl);
  
      setPreviewImage(viewUrl);
  
      const result = await axios.put(uploadUrl, uploadedFile, {
        headers: {
          "Content-Type": uploadedFile!.type,
        },
      });
  
      if (result.status === 200) {
  
        return { url: viewUrl, key };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  
  const onSubmit = async (data: CourseFormData) => {
    try {
      const { 
        courseName, 
        coursePrice, 
        discountPrice, 
        courseDescription, 
        courseCategory, 
        courseLevel, 
        demoURL, 
        thumbnail: existingThumbnailKey, // Extract existing thumbnail key
        thumbnailUrl: existingThumbnailUrl // Extract existing thumbnail URL
      } = data;
  
      // Pass existing thumbnail info to uploadThumbnail to preserve them
      const uploadResult = await uploadThumbnail(existingThumbnailKey, existingThumbnailUrl);
  
      console.log(uploadResult, "Upload result before dispatch");
  
      // Keep existing thumbnail if no new image is uploaded
      const thumbnail = uploadResult?.key || existingThumbnailKey;
      const thumbnailUrl = uploadResult?.url || existingThumbnailUrl;

      // Dispatch with either the new or existing thumbnail values
      dispatch(
        editAddCourse({
          courseName,
          courseDescription,
          coursePrice,
          courseDiscountPrice: discountPrice,
          courseCategory,
          courseLevel,
          demoURL,
          thumbnail, // S3 key
          thumbnailUrl, // URL for display
        })
      );
  
      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#0a0c11" }}>
      <div className="w-full max-w-4xl shadow-lg rounded-lg p-8" style={{ backgroundColor: "#1b2532", marginTop: "20px" }}>
        <h2 className="text-3xl font-semibold text-gray-100 mb-8 text-center">Edit Course</h2>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Course Name */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Course Name</label>
            <Controller
              name="courseName"
              control={control}
              defaultValue=""
              rules={{ required: "Course name is required",
                  minLength: {
                    value: 6,
                    message: 'Course Name must be at least 6 characters',
                  },maxLength:{
                    value: 10,
                    message: 'Course Name must be at least 10 characters',
                  } }}
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
                rules={{
                  required: "Course price is required",
                  min: { value: 0, message: "Price must be a positive number" }
                }}
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
                rules={{
                  required: "Discount price is required",
                  min: { value: 0, message: "Price must be a positive number" },
                  validate: (value) => value < getValues('coursePrice') || "Discount price must be less than course price"
                }}
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
                  className={`w-full h-24 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                    errors.courseDescription ? "border-red-500" : "border-gray-600"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Course Description"
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
                  <input
                    {...field}
                    type="text"
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.courseCategory ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter Course Category"
                  />
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
                  <input
                    {...field}
                    type="text"
                    className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                      errors.courseLevel ? "border-red-500" : "border-gray-600"
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter Course Level"
                  />
                )}
              />
              {errors.courseLevel && <span className="text-red-500">{errors.courseLevel.message}</span>}
            </div>
          </div>

          {/* Demo URL */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Demo URL</label>
            <Controller
              name="demoURL"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="url"
                  className={`w-full h-12 rounded-md bg-gray-700 px-4 py-2 text-gray-200 border ${
                    errors.demoURL ? "border-red-500" : "border-gray-600"
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter Demo URL"
                />
              )}
            />
            {errors.demoURL && <span className="text-red-500">{errors.demoURL.message}</span>}
          </div>

          {/* Thumbnail Upload */}
          <div className="flex flex-col gap-4">
            <label className="text-lg font-medium text-gray-300">Thumbnail</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="h-12 rounded-md bg-blue-500 text-white"
              >
                Upload Thumbnail
              </button>
              {previewImage && (
                <img src={previewImage} alt="Thumbnail Preview" className="mt-4 h-32 w-32 object-cover" />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="h-12 w-1/2 rounded-md bg-green-500 text-white"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
