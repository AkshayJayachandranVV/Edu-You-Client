
interface MyCourseBannerProps {
  MyCourseImg: string;
}

const MyCourseBanner: React.FC<MyCourseBannerProps> = ({ MyCourseImg }) => {
  return (
    <div className="relative bg-black py-8 px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="text-center lg:text-left max-w-full lg:max-w-lg lg:ml-16 mt-8 lg:mt-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Online Education
          </h1>
          <p className="text-gray-300 mt-6 text-base sm:text-lg lg:text-xl">
            Empowering minds from any place, at any time. Online education connects learners globally, offering knowledge and skills for a better future.
          </p>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg text-lg font-bold mt-8">
            Try it Now
          </button>
        </div>

        {/* Image Section */}
        <div className="mt-6 lg:mt-0">
          <img
            src={MyCourseImg}
            alt="Banner"
            className="w-full max-w-[400px] sm:max-w-[600px] lg:max-w-[700px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};
export default MyCourseBanner;
