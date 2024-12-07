import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Import the DotLottieReact component
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();
  const handleRoleSelection = (role: string) => {
    if (role === "user") {
      navigate("/login");
    } else {
      navigate("/tutor/login");
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#002D49] to-[#1F4E79] text-white min-h-screen flex justify-center items-center px-4 py-16">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-[#00D1B2] tracking-tight">
          Choose Your Role to Get Started
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 justify-center">
          {/* User Role Card with Lottie animation */}
          <div
            onClick={() => handleRoleSelection("user")}
            className="bg-[#1E3A58] p-8 rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-36 h-36 mb-6 mx-auto">
              <DotLottieReact
                src="https://lottie.host/fc0874fb-39e5-4abb-a6cf-3fce7aa6b670/gBmtfMlLRa.lottie" // Lottie animation URL for User role
                loop
                autoplay
                className="w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[#00D1B2]">
              Start as User
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              Explore top-quality courses, learn at your own pace, and achieve your goals.
            </p>
            <button className="px-8 py-2 bg-[#00D1B2] text-white font-semibold rounded-lg hover:bg-[#00B29A] transition duration-300">
              Join as User
            </button>
          </div>

          {/* Tutor Role Card with Lottie animation */}
          <div
            onClick={() => handleRoleSelection("tutor")}
            className="bg-[#2B3A42] p-8 rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-36 h-36 mb-6 mx-auto">
              <DotLottieReact
                src="https://lottie.host/d846168e-4bbb-4069-a2bd-3f07ca4edcea/K9CJGpnUzk.lottie" // Lottie animation URL for Tutor role
                loop
                autoplay
                className="w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[#FF8C00]">
              Start as Tutor
            </h2>
            <p className="text-lg text-gray-300 mb-4">
              Share your knowledge, inspire others, and become a mentor in your field.
            </p>
            <button className="px-8 py-2 bg-[#FF8C00] text-white font-semibold rounded-lg hover:bg-[#e67400] transition duration-300">
              Join as Tutor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;
