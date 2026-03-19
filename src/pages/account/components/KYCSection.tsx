import { useState, useEffect } from 'react';

type DocType = 'passport' | 'national_id' | 'driving_license';

interface UploadedFile {
  file: File;
  name: string;
  preview: string;
}

export default function KYCSection() {
  const [docType, setDocType] = useState<DocType>('national_id');
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    country: '',
    id_number: '',
    address: '',
  });
  const [idFile, setIdFile] = useState<UploadedFile | null>(null);
  const [selfieFile, setSelfieFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified');
  const [kycData, setKycData] = useState<any>(null);

  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchKycStatus = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/user/kyc-status`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      const data = await response.json();
      if (response.ok) {
        setKycStatus(data.status);
        setKycData(data.kyc);
      }
    } catch (err) {
      console.error('Failed to fetch KYC status');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: UploadedFile | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setter({ file, name: file.name, preview: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFile || !selfieFile || !token) return;

    setIsSubmitting(true);
    setError(null);

    const body = new FormData();
    body.append('full_name', formData.full_name);
    body.append('date_of_birth', formData.date_of_birth);
    body.append('country', formData.country);
    body.append('id_type', docType);
    body.append('id_number', formData.id_number);
    body.append('address', formData.address);
    body.append('id_document', idFile.file);
    body.append('selfie', selfieFile.file);

    try {
      const response = await fetch(`${API_BASE_URL}/user/kyc-submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body,
      });
      const data = await response.json();
      if (response.ok) {
        setKycStatus('pending');
      } else {
        setError(data.message || 'Failed to submit KYC. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const docOptions: { value: DocType; label: string; icon: string }[] = [
    { value: 'national_id', label: 'National ID', icon: 'ri-id-card-line' },
    { value: 'passport', label: 'Passport', icon: 'ri-passport-line' },
    { value: 'driving_license', label: "Driver's License", icon: 'ri-car-line' },
  ];
  const statusBadge = {
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-600' },
    pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700' },
    verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  }[kycStatus] || { label: 'Unverified', color: 'bg-gray-100 text-gray-600' };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <i className="ri-shield-check-line text-orange-600 w-5 h-5 flex items-center justify-center"></i>
          </div>
          <h2 className="text-lg font-bold text-gray-900">KYC Verification</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
          {statusBadge.label}
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <i className="ri-loader-4-line animate-spin text-3xl text-orange-500 mb-4"></i>
          <p className="text-sm text-gray-500">Loading identity status...</p>
        </div>
      ) : kycStatus === 'pending' || kycStatus === 'verified' ? (
        <div className="text-center py-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${kycStatus === 'verified' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
            <i className={`${kycStatus === 'verified' ? 'ri-checkbox-circle-line text-emerald-600' : 'ri-time-line text-amber-600'} text-3xl w-8 h-8 flex items-center justify-center`}></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {kycStatus === 'verified' ? 'Verification Complete' : 'Documents Submitted'}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {kycStatus === 'verified'
              ? 'Your identity has been verified. You now have full access to all platform features.'
              : 'Your documents are under review. This usually takes 1–3 business days.'}
          </p>
          {kycData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl inline-block text-left">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Verified Details</p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{kycData.full_name}</p>
                <p className="text-xs text-gray-500">{kycData.id_type} • {kycData.id_number}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-gray-500 mb-6">
            Complete identity verification to unlock full withdrawal access and higher limits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Enter your full legal name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={e => setFormData(p => ({ ...p, date_of_birth: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                  placeholder="e.g. United Kingdom"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">ID Number</label>
                <input
                  type="text"
                  required
                  value={formData.id_number}
                  onChange={e => setFormData(p => ({ ...p, id_number: e.target.value }))}
                  placeholder="Enter your document number"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Address</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  placeholder="Street address, city, postcode"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Document Type */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Select Document Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {docOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDocType(opt.value)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${docType === opt.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <i className={`${opt.icon} text-2xl ${docType === opt.value ? 'text-orange-600' : 'text-gray-400'} w-7 h-7 flex items-center justify-center`}></i>
                  <span className={`text-xs font-medium whitespace-nowrap ${docType === opt.value ? 'text-orange-700' : 'text-gray-600'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Document Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <UploadBox
              label="Identity Document"
              file={idFile}
              onChange={e => handleFileChange(e, setIdFile)}
              icon="ri-image-line"
            />
            <UploadBox
              label="Selfie Verification"
              file={selfieFile}
              onChange={e => handleFileChange(e, setSelfieFile)}
              icon="ri-camera-line"
            />
          </div>


          {/* Guidelines */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
            <p className="text-xs font-semibold text-amber-800 mb-2">📋 Upload Guidelines</p>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>Documents must be valid and not expired</li>
              <li>All four corners of the document must be visible</li>
              <li>Images must be clear, well-lit, and in focus</li>
              <li>Accepted formats: JPG, PNG, PDF (max 5MB)</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-600">
              <i className="ri-error-warning-line flex-shrink-0 w-5 h-5 flex items-center justify-center"></i>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !idFile || !selfieFile}
            className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer flex items-center justify-center space-x-2"
          >
            {isSubmitting && <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center"></i>}
            <span>Submit for Verification</span>
          </button>
        </form>
      )}
    </div>
  );
}

function UploadBox({
  label,
  file,
  onChange,
  icon,
  wide = false,
}: {
  label: string;
  file: UploadedFile | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'col-span-full' : ''}>
      <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>
      <label className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50'
        } ${wide ? 'h-36' : 'h-32'}`}>
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={onChange} />
        {file ? (
          <div className="flex flex-col items-center space-y-2 px-4 text-center">
            <i className="ri-checkbox-circle-fill text-2xl text-emerald-500 w-7 h-7 flex items-center justify-center"></i>
            <span className="text-xs text-emerald-700 font-medium truncate max-w-full">{file.name}</span>
            <span className="text-xs text-emerald-500">Tap to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <i className={`${icon} text-2xl text-gray-400 w-7 h-7 flex items-center justify-center`}></i>
            <span className="text-xs text-gray-500">Click to upload</span>
          </div>
        )}
      </label>
    </div>
  );
}
