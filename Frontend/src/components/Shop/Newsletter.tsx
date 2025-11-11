// Newsletter.tsx
const Newsletter = () => {
  return (
    <section className="bg-emerald-100 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Stay in the loop!</h2>
      <p className="text-gray-700 mb-4">
        Get updates on new arrivals and exclusive offers.
      </p>
      <form className="flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-l-md border border-gray-300"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-700"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
