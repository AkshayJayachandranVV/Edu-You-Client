
interface CheckoutBannerProps {
    bannerImage: string;
  }

  const CheckoutBanner: React.FC<CheckoutBannerProps> = ({ bannerImage }) => {
  return (
    <div className="relative bg-black p-4 sm:p-6">
      {/* Main Container - Stack on mobile, side by side on larger screens */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-6 max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-right py-4 md:py-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 sm:mb-4 md:mb-6 tracking-tight">
            Checkout
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl md:ml-auto">
            Complete your purchase quickly and securely.
          </p>
          
        </div>

        {/* Image Container */}
        <div className="w-full md:w-1/2">
          <img
            src={bannerImage}
            alt="Checkout Banner"
            className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutBanner
