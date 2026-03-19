import { useState } from 'react';

type DocType = 'id' | 'passport' | 'license';

interface UploadedFile {
  name: string;
  preview: string;
}

export default function KYCSection() {
  const [docType, setDocType] = useState<DocType>('id');
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null);
  const [backFile, setBackFile] = useState<UploadedFile | null>(null);
  const [selfieFile, setSelfieFile] = useState<UploadedFile | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [kycStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (f: UploadedFile | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setter({ name: file.name, preview: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!frontFile || !selfieFile) return;
    setSubmitted(true);
  };

  const docOptions: { value: DocType; label: string; icon: string }[] = [
    { value: 'id', label: 'National ID', icon: 'ri-id-card-line' },
    { value: 'passport', label: 'Passport', icon: 'ri-passport-line' },
    { value: 'license', label: "Driver's License", icon: 'ri-car-line' },
  ];

  const statusBadge = {
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-600' },
    pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700' },
    verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-700' },
  }[kycStatus];

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

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-time-line text-3xl text-amber-600 w-8 h-8 flex items-center justify-center"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Documents Submitted</h3>
          <p className="text-sm text-gray-500">Your documents are under review. This usually takes 1–3 business days.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5">
            Complete identity verification to unlock full withdrawal access and higher limits.
          </p>

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
                  className={`flex flex-col items-center space-y-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    docType === opt.value
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
              label={docType === 'passport' ? 'Passport Photo Page' : 'Front Side'}
              file={frontFile}
              onChange={e => handleFileChange(e, setFrontFile)}
              icon="ri-image-line"
            />
            {docType !== 'passport' && (
              <UploadBox
                label="Back Side"
                file={backFile}
                onChange={e => handleFileChange(e, setBackFile)}
                icon="ri-image-2-line"
              />
            )}
          </div>

          {/* Selfie Upload */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Selfie Verification
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Take a clear selfie holding your document next to your face. Make sure your face and document are clearly visible.
            </p>
            <UploadBox
              label="Selfie with Document"
              file={selfieFile}
              onChange={e => handleFileChange(e, setSelfieFile)}
              icon="ri-camera-line"
              wide
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

          <button
            onClick={handleSubmit}
            disabled={!frontFile || !selfieFile}
            className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            Submit for Verification
          </button>
        </>
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
      <label className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        file ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50'
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
