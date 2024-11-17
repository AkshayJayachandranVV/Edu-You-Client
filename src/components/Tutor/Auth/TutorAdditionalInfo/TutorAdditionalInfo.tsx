import React, { useState, ChangeEvent, FormEvent } from "react";
// import profileImage from '../../../../assets/images/User/UserHome/Account.png'
import iconimage from "../../../../assets/images/User/UserHome/Account.png";
import axios from "axios";
import { tutorEndpoints } from "../../../constraints/endpoints/TutorEndpoints";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaUserGraduate,
  FaFileAlt,
  FaCheckCircle,
  FaFilePdf,
} from "react-icons/fa";
import { toast } from "sonner";

interface Qualification {
  id: number;
  qualification: string;
  certificate: File | null;
  certificatePreviewUrl: string | null;
  certificateKey:string | null;
}

interface FormData {
  profilePicture: File | null;
  bio: string;
  cv: File | null;
  cvKey:string | null;
  profilePreviewUrl: string | null;
  profileKey: string | null;
  cvPreviewUrl: string | null;
}

const TutorAdditionalInfo = () => {
    const [qualifications, setQualifications] = useState<Qualification[]>([
        {
          id: 1,
          qualification: "",
          certificate: null,
          certificatePreviewUrl: null,
          certificateKey:null
        },
      ]);
      const [expertise, setExpertise] = useState<string[]>([""]);
      const [formData, setFormData] = useState<FormData>({
        profilePicture: null,
        bio: "",
        cv: null,
        profilePreviewUrl: null,
        cvPreviewUrl: null,
        cvKey:null,
        profileKey:null
      });
      const [profileImage, setProfileImage] = useState<string>(iconimage);
      const navigate = useNavigate()
      const tutorId  = localStorage.getItem("tutorId")

  const handleAddQualification = () => {
    const lastQualification = qualifications[qualifications.length - 1];
    if (lastQualification.qualification.length < 3) {
      toast.info("Each qualification must be longer than two characters.");
    } else {
      setQualifications([
        ...qualifications,
        {
          id: qualifications.length + 1,
          qualification: "",
          certificate: null,
          certificatePreviewUrl: null,
          certificateKey:null,
        },
      ]);
    }
  };

  const handleAddExpertise = () => {
    const lastExpertise = expertise[expertise.length - 1];
    if (lastExpertise && lastExpertise.length < 3) {
      toast.info("Each expertise entry must be longer than two characters.");
    } else {
      setExpertise([...expertise, ""]); // Add a new empty input for expertise
    }
  };

  const uploadProfile = async (file: File) => {
    if (!file) {
      alert("Please select a file first!");
      return null;
    }

    try {
      const fileName = generateFileName(file.name);

      const response = await axios.get(
        tutorEndpoints.getPresignedUrlForUpload,
        {
          params: {
            filename: fileName,
            fileType: file.type.startsWith("image") ? "image" : "pdf",
          },
        }
      );

      const { uploadUrl, viewUrl, key } = response.data;

      const result = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (result.status === 200) {
        console.log("File uploaded successfully:", viewUrl);
        toast.success("File uploaded successfully");
        return { url: viewUrl, key };
      } else {
        console.log("Upload failed");
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };


  const generateFileName = (originalName: string): string => {
    const extension = originalName.split(".").pop();
    return `${Math.random().toString(36).substring(2, 15)}.${extension}`;
  };

  const handleQualificationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications[index][field] = value;
    setQualifications(updatedQualifications);
  };

  const handleExpertiseChange = (index: number, value: string) => {
    const updatedExpertise = [...expertise];
    updatedExpertise[index] = value;
    setExpertise(updatedExpertise);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (file) {
      // Check if file is PDF and has content
      if (file.type === "application/pdf" && file.size > 0) {
        const uploadResult = await uploadProfile(file);
        if (uploadResult) {
          setFormData((prev) => ({
            ...prev,
            [name]: file,
            [`${name}PreviewUrl`]: uploadResult.url,
            [`${name}Key`]: uploadResult.key, // Store S3 key
          }));
        }
      } else {
        alert("Please select a valid PDF file with content for your CV.");
      }
    }
  };



  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  // Bio validation on blur
  const handleBioBlur = () => {
    if (formData.bio.length < 5) {
      toast.info("Bio must be more than 5 characters.");
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const uploadResult = await uploadProfile(file);
      if (uploadResult) {
        setProfileImage(uploadResult.url);
        setFormData((prev) => ({
          ...prev,
          profilePicture: file,
          profilePreviewUrl: uploadResult.url,
          profileKey: uploadResult.key, // Store S3 key
        }));
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleCertificateUpload = async (index: number, file: File) => {
    // Check if file is a PDF
    if (file && file.type === "application/pdf") {
      const uploadResult = await uploadProfile(file);
      if (uploadResult) {
        const updatedQualifications = [...qualifications];
        updatedQualifications[index].certificate = file;
        updatedQualifications[index].certificatePreviewUrl = uploadResult.url;
        updatedQualifications[index].certificateKey = uploadResult.key; // Store S3 key
        setQualifications(updatedQualifications);
      }
    } else {
      toast.info("Please select a PDF file for the certificate.");
    }
  };



const handleSubmit =async (e: FormEvent) => {
    e.preventDefault();

    // Check required fields
    if (!formData.cv) {
      alert("Please upload your CV.");
      return;
    }

    const payload = {
      id:tutorId,
      profilePicture: formData.profileKey,
      bio: formData.bio,
      cv: formData.cvKey,
      expertise: expertise.filter((exp) => exp.length > 2), // Filter out empty or short values
      qualifications: qualifications.map((qual) => ({
        qualification: qual.qualification,
        certificate: qual.certificateKey
      })),
    };

    console.log("Form submitted successfully", payload);

    const response = await axios.post(tutorEndpoints.addInformation,payload)

    console.log(response)

    if(response){
       navigate("/tutor/login")
    }else{
      toast.error("Something went wrong")
    }

    // Submit `payload` to the API here...
  };




  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <div className="flex max-w-5xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Left Side with Decorative Images */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-t from-blue-600 to-blue-400 p-6 w-1/3 relative">
          <img
            src="/images/education1.png"
            alt="Education"
            className="w-32 h-32 object-cover rounded-full shadow-lg mb-4"
          />
          <img
            src="/images/education2.png"
            alt="Learning"
            className="w-32 h-32 object-cover rounded-full shadow-lg mb-4"
          />
          <p className="text-white font-semibold text-center px-4">
            Enhance your profile to attract more students!
          </p>
          <img
            src="/images/books_background.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        </div>

        {/* Right Side with Form Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Header Section */}
          <div className="text-center bg-blue-500 text-white py-4 rounded-md">
            <h1 className="text-2xl font-bold">Edu-You Tutor Verification</h1>
            <p className="text-sm mt-1">
              Verification helps build trust in your profile.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload with Preview */}
            <div>
              <div className="profile-image-container">
                <label htmlFor="imageUpload" className="profile-image-label">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="profile-image"
                  />
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  style={{ display: "none" }} // Hide the input
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Expertise Section */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                <FaFileAlt className="inline mr-2 text-blue-500" /> Expertise
              </label>
              {expertise.map((exp, index) => (
                <input
                  key={index}
                  type="text"
                  value={exp}
                  onChange={(e) => handleExpertiseChange(index, e.target.value)}
                  className="mt-2 p-2 border border-blue-300 rounded-md w-full mb-2"
                  placeholder="Enter your expertise"
                />
              ))}
              <button
                type="button"
                onClick={handleAddExpertise}
                className="mt-2 flex items-center text-blue-500 hover:text-blue-600 font-semibold"
              >
                <FaPlus className="mr-2" /> Add More Expertise
              </button>
            </div>

            {/* Qualifications Section */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                <FaCheckCircle className="inline mr-2 text-blue-500" />{" "}
                Qualifications
              </label>
              {qualifications.map((qualification, index) => (
                <div key={qualification.id} className="mb-4">
                  {/* Qualification Input */}
                  <input
                    type="text"
                    value={qualification.qualification}
                    onChange={(e) =>
                      handleQualificationChange(
                        index,
                        "qualification",
                        e.target.value
                      )
                    }
                    className="mt-2 p-2 border border-blue-300 rounded-md w-full mb-2"
                    placeholder="Enter a qualification"
                  />

                  {/* Certificate Upload */}
                  <label className="block text-blue-600 font-semibold mb-2">
                    Upload Certificate (PDF only)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      handleCertificateUpload(index, e.target.files[0])
                    }
                    className="mt-2 p-2 border border-blue-300 rounded-md w-full"
                  />

                  {/* Certificate Preview */}
                  {qualification.certificatePreviewUrl && (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <FaFilePdf className="text-red-500 text-3xl" />
                        <p className="text-gray-700">
                          {qualification.certificate.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQualification}
                className="mt-2 flex items-center text-blue-500 hover:text-blue-600 font-semibold"
              >
                <FaPlus className="mr-2" /> Add More Qualifications
              </button>
            </div>

            {/* Bio Section */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                onBlur={handleBioBlur}
                className="mt-2 p-2 border border-blue-300 rounded-md w-full h-24"
                placeholder="Briefly introduce yourself"
              ></textarea>
            </div>

            {/* CV Upload with PDF Icon Preview */}
            <div>
              <label className="block text-blue-700 font-semibold mb-2">
                <FaFileAlt className="inline mr-2 text-blue-500" /> CV
              </label>
              <input
                type="file"
                name="cv"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full p-2 border border-blue-300 rounded-md"
              />
              {formData.cv && (
                <div className="mt-4 flex items-center space-x-2">
                  <FaFilePdf className="text-red-500 text-3xl" />
                  <p className="text-gray-700">{formData.cv.name}</p>
                </div>
              )}
            </div>

            {/* Submit and Skip Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 shadow-md"
              >
                Submit
              </button>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 font-semibold"
              >
                Skip for Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorAdditionalInfo;
