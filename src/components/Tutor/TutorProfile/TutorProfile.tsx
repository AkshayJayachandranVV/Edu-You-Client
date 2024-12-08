import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaUserGraduate,FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { toast } from "sonner";
import axiosInstance from "../../constraints/axios/tutorAxios";
import { tutorEndpoints } from "../../constraints/endpoints/TutorEndpoints";
import Cookies from 'js-cookie';
import profile from '@/assets/images/User/UserHome/Account.png'

export default function TutorProfile() {
  const [tutorData, setTutorData] = useState<any | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  // const [profileImage, setProfileImage] = useState<string>("");
  const navigate = useNavigate();
  const tutorId = localStorage.getItem("tutorId");

  useEffect(() => {
    fetchTutorData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tutorAccessToken");
    Cookies.remove('tutorAccessToken');
    Cookies.remove('tutorRefreshToken');
    navigate("/tutor/login");
  };

  const fetchTutorData = async () => {
    try {
      if (tutorId) {
        const endpoint = `${tutorEndpoints.profileDetails.replace(
          "tutorId",
          tutorId
        )}`;
        const profile = await axiosInstance.get(endpoint);
        setTutorData(profile.data);
        // setProfileImage(profile.data.profile_picture);
      }
    } catch (error) {
      console.error("Error fetching tutor data:", error);
      toast.error("Failed to fetch profile data.");
    }
  };

  const goEditProfile = () => {
    navigate("/tutor/editProfile"); // Redirect to edit profile page
  };

  // const GoDashboard = () => {
  //   navigate("/tutor/dashboard");
  // };

  const openPdfModal = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl);
  };

  const closePdfModal = () => {
    setSelectedPdf(null);
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
        {/* Profile Details */}
        <div className="bg-gray-800 p-10 rounded-xl shadow-lg max-w-screen-lg mx-auto">
          {tutorData ? (
            <>
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-700 pb-10">
                <img
                  src={tutorData.profile_picture || "/placeholder-profile.png"}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-3">
                    {tutorData.tutorname}
                  </h1>
                  <p className="flex items-center justify-center md:justify-start gap-3 text-indigo-400 text-xl mt-2">
                    <FaEnvelope /> {tutorData.email}
                  </p>
                  {tutorData.phone && (
                    <p className="flex items-center justify-center md:justify-start gap-3 text-indigo-400 text-xl mt-2">
                      <FaPhone /> {tutorData.phone}
                    </p>
                  )}
                </div>
                <button
                  onClick={goEditProfile}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded text-lg mt-4 md:mt-0"
                >
                  Edit Profile
                </button>
              </div>

              {/* About Me Section */}
              {tutorData.bio && (
                <div className="mt-10">
                  <h2 className="text-3xl font-semibold border-b border-gray-700 pb-4">
                    About Me
                  </h2>
                  <p className="mt-4 text-lg text-gray-300">{tutorData.bio}</p>
                </div>
              )}

              {/* Expertise Section */}
              <div className="mt-10">
                <h2 className="text-3xl font-semibold border-b border-gray-700 pb-4">
                  Expertise
                </h2>
                {tutorData.expertise && tutorData.expertise.length > 0 ? (
                  <ul className="mt-4 text-lg text-gray-300 list-disc list-inside">
                    {tutorData.expertise.map((exp: string, index: number) => (
                      <li key={index} className="mt-2">
                        {exp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-lg text-gray-400">
                    No expertise added yet.
                  </p>
                )}
              </div>

              {/* Qualifications Section */}
              <div className="mt-10">
                <h2 className="text-3xl font-semibold border-b border-gray-700 pb-4">
                  Qualifications
                </h2>
                {tutorData.qualifications &&
                tutorData.qualifications.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tutorData.qualifications.map(
                      (qual: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-700 p-6 rounded-lg flex flex-col gap-4 shadow-lg"
                        >
                          <p className="flex items-center gap-3 text-xl font-medium">
                            <FaUserGraduate className="text-indigo-500" />
                            {qual.qualification}
                          </p>
                          {qual.certificate ? (
                            <button
                              onClick={() => openPdfModal(qual.certificate)}
                              className="text-indigo-400 hover:underline text-lg"
                            >
                              View Certificate
                            </button>
                          ) : (
                            <p className="text-gray-400">
                              No certificate added.
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-lg text-gray-400">
                    No qualifications added yet.
                  </p>
                )}
              </div>

              <div className="mt-10">
                <h2 className="text-3xl font-semibold border-b border-gray-700 pb-4">
                  Curriculum Vitae (CV)
                </h2>
                {tutorData.cv ? (
                  <button
                    onClick={() => openPdfModal(tutorData.cv)}
                    className="mt-3 text-indigo-400 hover:underline text-lg"
                  >
                    View CV
                  </button>
                ) : (
                  <p className="mt-3 text-lg text-gray-400">No CV added yet.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-xl">Loading profile...</p>
          )}
        </div>
      </div>

      {/* Modal for PDF Viewer */}
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
    </>
  );
}
