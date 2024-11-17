import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setTutor } from "../../../../src/redux/tutorSlice";
import axiosInstance from "../../../components/constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../../components/constraints/endpoints/TutorEndpoints";

interface ProfileFormInputs {
  name: string;
  email: string;
  phone: string;
  about: string;
}

interface Qualification {
  title: string;
  fileKey: string;
  fileUrl: string;
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

  const [editQualificationIndex, setEditQualificationIndex] = useState(null); // Tracks the index of the qualification being edited
  const [editQualification, setEditQualification] = useState({}); // Tracks the qualification being edited

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
        setProfileImage(profile.data.profile_picture);
        setCvUrl(profile.data.cv);
        setCvKey(profile.data.cv_key)

        // Populate form fields with fetched data
        setValue("name", profile.data.tutorname);
        setValue("email", profile.data.email);
        setValue("phone", profile.data.phone || "");
        setValue("about", profile.data.bio || "");


        console.log("Formatted qualifications:", profile.data.qualifications.map((q: any) => ({
          title: q.qualification,
          fileKey: q.certificate_key,
          fileUrl: q.certificate,
        })));

        console.log("Fetched qualifications:", profile.data.qualifications);


        setQualifications(
          profile.data.qualifications.map((q: any) => ({
            title: q.qualification,
            fileKey: q.certificate_key,
            fileUrl: q.certificate
            ,
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to fetch profile data.");
    }
  };

  

  const startEditQualification = (index: number, qual: Qualification) => {
    setEditQualificationIndex(index);
    setEditQualification({ ...qual }); // Load current qualification for editing
};

const handleSaveQualification = async (index: number) => {
    const updatedQualifications = [...qualifications];
    if (editQualification.file) {
        const uploadedFile = await uploadFile(editQualification.file);
        if (uploadedFile) {
            updatedQualifications[index] = {
                title: editQualification.title,
                fileKey: uploadedFile.fileKey,
                fileUrl: uploadedFile.fileUrl,
            };
        }
    } else {
        updatedQualifications[index] = editQualification;
    }
    setQualifications(updatedQualifications);
    setEditQualificationIndex(null);
    setEditQualification({});
};


  const cancelEditQualification = () => {
    setEditQualificationIndex(null);
    setEditQualification({});
  };

  const handleRemoveQualification = (index) => {
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
      console.log("viewUrl",viewUrl)
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
      return { fileUrl: viewUrl, fileKey: key };
    } catch (error) {
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

    // Process qualifications
    const updatedQualifications = await Promise.all(
      qualifications.map(async (qual) => {
          if (qual.fileKey) {
            console.log("1")
            console.log("qual.fileKey:",qual.fileKey)
              return {
                  title: qual.title,
                  fileKey: qual.fileKey, // Store only fileKey
              };
          } else if (qual.file) {
            console.log("2")
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
    console.log("lalalalal")
    console.log(pdfUrl)
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
      { title: "", file: null, fileUrl: "" }, // Add empty qualification object
    ]);
  };

  return (
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
                        value={editQualification.title}
                        onChange={(e) =>
                          setEditQualification((prev) => ({
                            ...prev,
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
                          setEditQualification((prev) => ({
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
          <div className="bg-gray-900 p-8 rounded-lg w-11/12 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-indigo-500">
              Document Viewer
            </h2>
            <iframe
              src={selectedPdf}
              className="w-full h-96 border-0"
              title="Document Viewer"
            ></iframe>
            <button
              onClick={closePdfModal}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
