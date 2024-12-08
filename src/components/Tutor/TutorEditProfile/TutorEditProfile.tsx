import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setTutor } from "../../../../src/redux/tutorSlice";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import Cookies from 'js-cookie';
import profile from '../../../assets/images/User/UserHome/Account.png'
interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  about: string;
  expertise: string[];
}

interface Qualification {
  title: string;
  fileKey: string;
  fileUrl: string;
  file?: File;
}

export default function EditTutorProfile() {
  const dispatch = useDispatch();
  const [tutorData, setTutorData] = useState<any | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvKey, setCvKey] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string>("");
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [expertiseList, setExpertiseList] = useState<string[]>([]);
  const navigate = useNavigate()

  const [editQualificationIndex, setEditQualificationIndex] = useState<
    number | null
  >(null);
  const [editQualification, setEditQualification] =
    useState<Qualification | null>(null);

  const [isEditingCv, setIsEditingCv] = useState(false); // Tracks if the CV is being edited

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      about: "",
    },
  });

  const tutorId = localStorage.getItem("tutorId");

  const handleLogout = () => {
    localStorage.removeItem("tutorAccessToken");
    Cookies.remove('tutorAccessToken');
    Cookies.remove('tutorRefreshToken');
    navigate("/tutor/login");
  };


  useEffect(() => {
    fetchTutorData();
  }, []);

  const fetchTutorData = async () => {
    try {
      if (tutorId) {
        const endpoint = `${tutorEndpoints.profileDetails.replace(
          "tutorId",
          tutorId
        )}`;
        const profile = await axiosInstance.get(endpoint);
        console.log("Fetched profile data:", profile);

        setTutorData(profile.data);
        setExpertiseList(profile.data.expertise)
        setProfileImage(profile.data.profile_picture);
        setCvUrl(profile.data.cv);
        setCvKey(profile.data.cv_key);

        // Populate form fields with fetched data
        setValue("name", profile.data.tutorname);
        setValue("email", profile.data.email);
        setValue("phone", profile.data.phone || "");
        setValue("about", profile.data.about || "");

        console.log(
          "Formatted qualifications:",
          profile.data.qualifications.map((q: any) => ({
            title: q.qualification,
            fileKey: q.certificate_key,
            fileUrl: q.certificate,
          }))
        );

        console.log("Fetched qualifications:", profile.data.qualifications);

        setQualifications(
          profile.data.qualifications.map((q: any) => ({
            title: q.qualification,
            fileKey: q.certificate_key,
            fileUrl: q.certificate,
          }))
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch profile data.");
    }
  };



  const startEditQualification = (index: number, qual: Qualification) => {
    setEditQualificationIndex(index);
    setEditQualification({ ...qual }); // Load current qualification for editing
  };

  const handleSaveQualification = async (index: number) => {
    if (!editQualification) return; // Ensure editQualification is not null

    const updatedQualifications = [...qualifications];

    // Check if a file is being edited
    if (editQualification.file) {
      const uploadedFile = await uploadFile(editQualification.file); // Ensure file exists on the type
      if (uploadedFile) {
        updatedQualifications[index] = {
          title: editQualification.title, // Title from editQualification
          fileKey: uploadedFile.fileKey, // Uploaded fileKey
          fileUrl: uploadedFile.fileUrl, // Uploaded fileUrl
        };
      }
    } else {
      updatedQualifications[index] = editQualification;
    }

    setQualifications(updatedQualifications);
    setEditQualificationIndex(null);
    setEditQualification(null); // Reset to null
  };

  const cancelEditQualification = () => {
    setEditQualificationIndex(null);
    setEditQualification(null);
  };

  const handleRemoveQualification = (index: any) => {
    const updatedQualifications = qualifications.filter(
      (_, qualIndex) => qualIndex !== index
    );

    setQualifications(updatedQualifications);
  };

  const startEditCv = () => {
    setIsEditingCv(true); // Enable CV editing mode
  };

  const saveCv = () => {
    if (cvFile) {
      // Replace current CV URL with the new file (in real apps, upload logic would go here)
      const newCvUrl = URL.createObjectURL(cvFile);
      setCvUrl(newCvUrl);
    }

    setIsEditingCv(false); // Exit CV editing mode
  };

  const uploadFile = async (file: File) => {
    try {
      const fileName = `${Math.random()
        .toString(36)
        .substring(2, 15)}.${file.name.split(".").pop()}`;
      const { data } = await axios.get(
        tutorEndpoints.getPresignedUrlForUpload,
        {
          params: {
            filename: fileName,
            fileType: file.type.startsWith("image") ? "image" : "file",
          },
        }
      );

      const { uploadUrl, viewUrl, key } = data;
      console.log("viewUrl", viewUrl);
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      return { fileUrl: viewUrl, fileKey: key };
    } catch (error) {
      console.log(error);
      toast.error("File upload failed.");
      return null;
    }
  };

  const onSubmitProfile = async (data: ProfileFormInputs) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("about", data.about);

    if (expertiseList.length === 0) {
      toast.error("Please add at least one expertise.");
      return;
    }

    // Process qualifications
    const updatedQualifications = await Promise.all(
      qualifications.map(async (qual) => {
        if (qual.fileKey) {
          console.log("1");
          console.log("qual.fileKey:", qual.fileKey);
          return {
            title: qual.title,
            fileKey: qual.fileKey, // Store only fileKey
          };
        } else if (qual.file) {
          console.log("2");
          // New file uploaded for qualification
          const uploadedQual = await uploadFile(qual.file);
          if (uploadedQual) {
            return {
              title: qual.title,
              fileKey: uploadedQual.fileKey, // Store fileKey
            };
          }
        }
        return qual; // Fallback to original qualification data
      })
    );
    formData.append("qualifications", JSON.stringify(updatedQualifications));

    formData.append("expertise", JSON.stringify(expertiseList));


    if (profileImageFile) {
      const profilePic = await uploadFile(profileImageFile);
      if (profilePic) formData.append("profile_picture", profilePic.fileKey); // Store fileKey
    } else if (tutorData?.profile_key) {
      formData.append("profile_picture", tutorData.profile_key); // Existing fileKey
    }

    // Process CV
    if (cvFile) {
      const uploadedCv = await uploadFile(cvFile);
      if (uploadedCv) formData.append("cv", uploadedCv.fileKey); // Store fileKey
    } else if (tutorData?.cvKey || cvUrl) {
      formData.append("cv", cvKey || cvUrl); // Existing fileKey or URL
    }

    try {
      const response = await axiosInstance.put(
        tutorEndpoints.editProfile,
        formData
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        dispatch(setTutor(response.data));
      } else {
        toast.error("Profile update failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating profile.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      setProfileImageFile(e.target.files[0]);
    }
  };

  const openPdfModal = (pdfUrl: string) => {
    console.log("lalalalal");
    console.log(pdfUrl);
    setSelectedPdf(pdfUrl);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
  };

  const cancelEditCv = () => {
    setIsEditingCv(false);
    setCvFile(null); // Reset file input
  };

  const handleAddQualification = () => {
    setQualifications([
      ...qualifications,
      {
        title: "", // Default empty title
        fileKey: "", // Empty fileKey as a placeholder
        fileUrl: "", // Default empty URL
        file: undefined, // Explicitly set file as undefined
      },
    ]);
  };

  const handleAddExpertise = () => {
    const expertiseInput = document.getElementById("expertiseInput") as HTMLInputElement;
  
    if (expertiseInput && expertiseInput.value.trim()) {
      const newExpertise = expertiseInput.value.trim();
      if (expertiseList.includes(newExpertise)) {
        toast.error("Expertise already added.");
      } else {
        setExpertiseList([...expertiseList, newExpertise]);
        expertiseInput.value = ""; // Clear input field
      }
    }
  };
  
  
  const handleRemoveExpertise = (index: number) => {
    const newExpertiseList = expertiseList.filter((_, i) => i !== index);
    setExpertiseList(newExpertiseList);
  };

  return (
    <>
    <nav className="bg-gray-900 text-white p-6 shadow-lg">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <img
            src={profile} // Replace with your logo
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-2xl font-bold text-indigo-500">Tutor Profile</h1>
        </div>

        {/* Navbar Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/tutor/dashboard")}
            className="flex items-center gap-2 text-lg text-indigo-400 hover:text-indigo-500"
          >
            <FaHome />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/tutor/editProfile")}
            className="flex items-center gap-2 text-lg text-indigo-400 hover:text-indigo-500"
          >
            <FaUser />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-lg text-indigo-400 hover:text-indigo-500"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
    <div className="bg-gray-900 text-white min-h-screen p-10">
  <div className="max-w-4xl mx-auto p-8 bg-gray-950 text-gray-200 rounded-lg shadow-xl">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
      Edit Profile
    </h2>
    <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
      {/* Profile Picture */}
      <div>
        <label htmlFor="imageUpload" className="block mb-2 text-gray-300">
          Profile Picture
        </label>
        <div className="profile-image-container">
          <label htmlFor="imageUpload">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Name, Email, Phone, About */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-gray-300">Name</label>
          <input
            {...register("name", {
              required: "Name is required.",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters.",
              },
            })}
            className="block w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
            placeholder="Enter your name"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">Name is required.</span>
          )}
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Enter a valid email.",
              },
            })}
            className="block w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
            placeholder="Enter your email"
            readOnly
          />
          {errors.email && (
            <span className="text-red-500 text-sm">Email is required.</span>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-1 text-gray-300">Phone</label>
        <input
          {...register("phone", { required: true })}
          className="block w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <span className="text-red-500 text-sm">
            Phone number is required.
          </span>
        )}
      </div>

      <div>
        <label className="block mb-1 text-gray-300">About</label>
        <textarea
          {...register("about")}
          className="block w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
          placeholder="Write about yourself"
          rows={4}
        ></textarea>
      </div>

      {/* Expertise */}
      <div>
            <label htmlFor="expertise" className="block mb-1 text-gray-300">
              Expertise
            </label>
            <div className="flex space-x-2">
            <input
    id="expertiseInput"
    {...register("expertise", {
      validate: () => expertiseList.length > 0 || "Please add at least one expertise.",
    })}
    className="block w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
    placeholder="Enter your expertise"
  />
              <button
                type="button"
                onClick={handleAddExpertise}
                className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {errors.expertise && (
              <span className="text-red-500 text-sm">{errors.expertise.message}</span>
            )}
          </div>

          {/* Expertise List */}
          {expertiseList.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg text-gray-300">Your Expertise:</h3>
              <ul className="list-disc list-inside">
                {expertiseList.map((exp, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{exp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpertise(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

      {/* Qualifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Qualifications
        </h3>

        {qualifications.map((qual, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 bg-gray-800 p-3 rounded mb-2 border border-gray-700"
          >
            {editQualificationIndex === index ? (
              <>
                {/* Editing Mode */}
                <div>
                  <label className="block mb-1 text-gray-300">
                    Qualification Title
                  </label>
                  <input
                    type="text"
                    value={editQualification?.title || ""}
                    onChange={(e) =>
                      setEditQualification((prev) => ({
                        ...(prev || {
                          title: "",
                          fileKey: "",
                          fileUrl: "",
                        }),
                        title: e.target.value,
                      }))
                    }
                    className="block w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-300">
                    Upload File
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setEditQualification((prev: any) => ({
                        ...prev,
                        file: e.target.files ? e.target.files[0] : null,
                      }))
                    }
                    className="block w-full text-gray-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveQualification(index)}
                  className="text-green-400 hover:text-green-500"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEditQualification}
                  className="text-red-400 hover:text-red-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{qual.title}</span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                    onClick={() => openPdfModal(qual.fileUrl)}
                  >
                    View
                  </a>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => startEditQualification(index, qual)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveQualification(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQualification}
          className="text-blue-400 hover:text-blue-500 mt-4"
        >
          + Add More Qualification
        </button>
      </div>

      {/* CV */}
      <div>
        <label className="block mb-1 text-gray-300">Upload CV</label>
        {isEditingCv ? (
          <div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                e.target.files && setCvFile(e.target.files[0])
              }
              className="block w-full text-gray-200"
            />
            <button
              type="button"
              onClick={saveCv}
              className="text-green-400 hover:text-green-500 mt-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEditCv}
              className="text-red-400 hover:text-red-500 mt-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {cvUrl && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500"
                onClick={() => openPdfModal(cvUrl)}
              >
                View Current CV
              </a>
            )}
            <button
              type="button"
              onClick={startEditCv}
              className="text-yellow-400 hover:text-yellow-500 mt-2"
            >
              Edit CV
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
      >
        Update Profile
      </button>
    </form>
  </div>
  {selectedPdf && (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg max-w-4xl w-full">
        <embed
          src={selectedPdf}
          className="w-full h-96"
          type="application/pdf"
        />
        <button
          onClick={closePdfModal}
          className="absolute top-0 right-0 p-2 text-white bg-red-600 hover:bg-red-700 rounded-full"
        >
          X
        </button>
      </div>
    </div>
  )}
</div>
</>
  );
}
