import { useState, useRef, useEffect } from 'react';

export default function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: 'Loading...',
    email: '',
    phone: '',
    profile_image_url: null,
  });
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchProfile = async () => {
    if (!token) {
      setError('Not authenticated');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      const data = await response.json();
      if (response.ok) {
        const user = data.user || data;
        setProfile({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          profile_image_url: user.profile_image_url,
        });
        setForm({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          profile_image_url: user.profile_image_url,
        });
      } else {
        setError(data.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setProfile({ ...profile, name: form.name, phone: form.phone });
        // Update local user data for sidebar etc.
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          localStorage.setItem('user', JSON.stringify({ ...u, name: form.name, phone: form.phone }));
        }
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

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

    setAvatarError(null);
    setIsSaving(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        const newUrl = data.user?.profile_image_url || data.profile_image_url;
        setProfile(p => ({ ...p, profile_image_url: newUrl }));
        setForm(f => ({ ...f, profile_image_url: newUrl }));
        // Update local user data for sidebar etc.
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          localStorage.setItem('user', JSON.stringify({ ...u, profile_image_url: newUrl }));
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setAvatarError(data.message || 'Failed to upload image');
      }
    } catch (err) {
      setAvatarError('Connection error during upload');
    } finally {
      setIsSaving(false);
    }
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
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt="Profile avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
              {(profile.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleAvatarClick}
            disabled={isSaving}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-700 transition-colors disabled:opacity-50"
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
          <p className="font-semibold text-gray-900">{profile.name}</p>
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
          { label: 'Full Name', key: 'name', icon: 'ri-user-line', editable: true },
          { label: 'Email Address', key: 'email', icon: 'ri-mail-line', editable: false },
          { label: 'Phone Number', key: 'phone', icon: 'ri-phone-line', placeholder: 'Not set', editable: true },
        ].map(({ label, key, icon, placeholder, editable }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
            {isEditing && editable ? (
              <input
                type="text"
                value={form[key as keyof typeof form] || ''}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <i className={`${icon} text-gray-400 w-4 h-4 flex items-center justify-center`}></i>
                <span className="text-sm text-gray-900">
                  {profile[key as keyof typeof profile] || <span className="text-gray-400">{placeholder || 'Not set'}</span>}
                </span>
                {!editable && isEditing && (
                  <i className="ri-lock-line text-gray-300 w-3 h-3 flex items-center justify-center ml-auto"></i>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex space-x-3 mt-5">
          <button
            onClick={() => { setForm({ ...profile }); setIsEditing(false); }}
            disabled={isSaving}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSaving && <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>}
            <span>Save Changes</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-600">
          <i className="ri-error-warning-line flex-shrink-0 w-5 h-5 flex items-center justify-center"></i>
          <span>{error}</span>
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