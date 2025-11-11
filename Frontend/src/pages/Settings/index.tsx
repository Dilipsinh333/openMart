import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Account Settings
      </h1>

      <p className="text-gray-600 mb-6">
        Manage your account details and preferences. More features coming soon.
      </p>

      <div className="space-y-4">
        <div
          className="p-4 border rounded-md shadow-sm bg-white cursor-pointer"
          onClick={() => {
            navigate("/settings/personal-info");
          }}
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Personal Information
          </h2>
          <p className="text-sm text-gray-600">
            Update your name, email address, and contact number.
          </p>
          {/* Future: Add personal info form */}
        </div>

        <div
          className="p-4 border rounded-md shadow-sm bg-white cursor-pointer"
          onClick={() => {
            navigate("/settings/addresses");
          }}
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Update/Add Addresses
          </h2>
          <p className="text-sm text-gray-600">
            Update or add another address.
          </p>
          {/* Future: Add personal info form */}
        </div>

        <div
          className="p-4 border rounded-md shadow-sm bg-white cursor-pointer"
          onClick={() => {
            navigate("/settings/reset-password");
          }}
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Password & Security
          </h2>
          <p className="text-sm text-gray-600">
            Change your password and manage security settings.
          </p>
          {/* Future: Add password change form */}
        </div>
      </div>
    </div>
  );
};

export default Settings;
