import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Atharv Sharma",
    email: "atharv@example.com",
    phone: "+91 98765 43210",
    location: "Pune, India",
    bio: "Computer Science Student",
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <main className="mx-auto max-w-[900px] px-6 py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-1 text-gray-600">Manage your profile information</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Profile Picture */}
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={editData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 border-t border-gray-200 pt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="mt-1 text-lg font-medium text-gray-900">{profileData.fullName}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-500">Email</p>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">{profileData.email}</p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-500">Phone</p>
              <div className="mt-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">{profileData.phone}</p>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-gray-500">Location</p>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <p className="text-gray-900">{profileData.location}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Bio</p>
              <p className="mt-1 text-gray-900">{profileData.bio}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
