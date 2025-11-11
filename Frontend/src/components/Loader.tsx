import loadingImage from "./../assets/bouncing-circles.svg";

const Loader = () => {
  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="flex items-center justify-center absolute inset-0 z-30 bg-white/40 backdrop-blur-sm pointer-events-none">
      <img src={loadingImage} className="w-25 h-25" alt="Loading..." />
    </div>
  );
};

export default Loader;
