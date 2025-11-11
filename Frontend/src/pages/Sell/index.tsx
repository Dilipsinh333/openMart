import { Link } from "react-router-dom";

const SellItems = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Sell Your Items
      </h1>

      <p className="text-gray-700 mb-4">
        Have your kids outgrown their toys, cycles, or gear? Don’t let them
        collect dust! At <strong>KidsCycle</strong>, you can easily sell
        gently-used kids' items and give them a new life.
      </p>

      <ul className="list-disc list-inside text-gray-700 mb-6">
        <li>
          We accept tricycles, bicycles, ride-ons, walkers, toys, and more.
        </li>
        <li>Items must be clean, safe, and in working condition.</li>
        <li>We handle pickup, quality check, and listing for you.</li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-md mb-6">
        <p className="text-emerald-800 font-medium mb-1">Next Steps:</p>
        <ol className="list-decimal list-inside text-emerald-700">
          <li>Sign in or create an account.</li>
          <li>Fill out our item submission form.</li>
          <li>We’ll get in touch to schedule pickup and approval.</li>
        </ol>
      </div>

      {/* Replace this with a button/form link when form is ready */}
      <Link
        to="/sell/form"
        className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-md transition"
      >
        Submit Your Item
      </Link>
    </div>
  );
};

export default SellItems;
