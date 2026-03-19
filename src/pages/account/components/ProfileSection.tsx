import { useState, useRef } from 'react';

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'johndoe@email.com',
    username: 'johndoe123',
    phone: '',
  });
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(() => {
    return localStorage.getItem('userAvatar') || null;
  });
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setProfile({ ...form });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setAvatarError('File size must be less than 2MB');
      return;
    }

    // Clear any previous errors
    setAvatarError(null);

    // Read and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      localStorage.setItem('userAvatar', base64String);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <i className="ri-user-line text-orange-600 w-5 h-5 flex items-center justify-center"></i>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleAvatarClick}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors"
          >
            <i className="ri-camera-line text-white text-xs w-4 h-4 flex items-center justify-center"></i>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{profile.fullName}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF • Max 2MB</p>
        </div>
      </div>

      {/* Avatar Error Message */}
      {avatarError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <i className="ri-error-warning-line text-red-600 w-5 h-5 flex items-center justify-center"></i>
          <span className="text-sm text-red-700">{avatarError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name', key: 'fullName', icon: 'ri-user-line' },
          { label: 'Username', key: 'username', icon: 'ri-at-line' },
          { label: 'Email Address', key: 'email', icon: 'ri-mail-line' },
          { label: 'Phone Number', key: 'phone', icon: 'ri-phone-line', placeholder: 'Not set' },
        ].map(({ label, key, icon, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            {isEditing ? (
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <i className={`${icon} text-gray-400 w-4 h-4 flex items-center justify-center`}></i>
                <span className="text-sm text-gray-900">
                  {form[key as keyof typeof form] || <span className="text-gray-400">{placeholder || 'Not set'}</span>}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex space-x-3 mt-5">
          <button
            onClick={() => { setForm({ ...profile }); setIsEditing(false); }}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      )}

      {saved && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2">
          <i className="ri-checkbox-circle-line text-emerald-600 w-5 h-5 flex items-center justify-center"></i>
          <span className="text-sm text-emerald-700 font-medium">Profile updated successfully!</span>
        </div>
      )}
    </div>
  );
}