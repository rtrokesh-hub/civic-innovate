import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { PinPicker } from '../../components/map/PinPicker';
import { 
  Upload, MapPin, Sparkles, CheckCircle, ArrowRight, AlertCircle, 
  Layers, Camera, ChevronRight, ArrowLeft 
} from 'lucide-react';

export const ReportIssuePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DRAINAGE_AND_FLOODING');
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [address, setAddress] = useState('Bengaluru Center, Karnataka');
  const [city] = useState('Bengaluru');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedIssue, setSubmittedIssue] = useState<any>(null);

  const navigate = useNavigate();

  const categories = [
    { id: 'DRAINAGE_AND_FLOODING', label: 'Drainage & Urban Flooding', icon: '🌊' },
    { id: 'ROADS_AND_POTHOLES', label: 'Road Hazards & Potholes', icon: '🚧' },
    { id: 'SOLID_WASTE', label: 'Solid Waste & Illegal Dumping', icon: '🗑️' },
    { id: 'TRAFFIC_CONGESTION', label: 'Traffic Bottlenecks & Signals', icon: '🚦' },
    { id: 'WATER_CONTAMINATION', label: 'Water Contamination & Supply', icon: '💧' },
    { id: 'STREET_LIGHTING', label: 'Power Grid & Street Lighting', icon: '💡' },
  ];

  const handleLocationSelect = (lat: number, lng: number, addr: string) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(addr);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('address', address);
      formData.append('city', city);
      if (imageFile) {
        formData.append('images', imageFile);
      }

      const res = await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmittedIssue(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit civic issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedIssue) {
    const aiAnalysis = submittedIssue.aiAnalysis ? JSON.parse(submittedIssue.aiAnalysis) : null;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-navy-950">Civic Problem Logged Successfully</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Your report has been written to the municipal PostgreSQL ledger and instantly triaged by the Gemini AI engine.
            </p>
          </div>

          {aiAnalysis && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-left space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/70 gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Gemini AI Triage Diagnostics</span>
                </span>
                <span className="text-xs font-bold text-navy-950 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                  Urgency Score: <span className="text-rose-600 font-extrabold">{aiAnalysis.urgencyScore}/100</span> ({aiAnalysis.urgencyLevel})
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Engineering Branches</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {aiAnalysis.recommendedDepartments?.map((dept: string) => (
                    <span key={dept} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Generated Challenge Problem Statement</span>
                <p className="text-xs sm:text-sm text-slate-800 font-medium mt-1 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                  {aiAnalysis.suggestedProblemStatement}
                </p>
              </div>

              {aiAnalysis.rootCauses && aiAnalysis.rootCauses.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identified Root Causes</span>
                  <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-0.5">
                    {aiAnalysis.rootCauses.map((rc: string, i: number) => (
                      <li key={i}>{rc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/citizen/dashboard')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition shadow-sm border border-navy-800 flex items-center space-x-1.5"
            >
              <span>View in My Reports</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedIssue(null);
                setTitle('');
                setDescription('');
                setImageFile(null);
                setImagePreview(null);
              }}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition"
            >
              Report Another Problem
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link to="/citizen/dashboard" className="hover:text-navy-900 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>Citizen Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Report Problem</span>
          </div>
          <h1 className="text-2xl font-extrabold text-navy-950 tracking-tight">Report Municipal Issue</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log an infrastructure failure, road damage, or urban hazard for automated AI triage and student hackathon conversion.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Wizard */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8 space-y-8">
        {/* Step 1: Category Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-navy-900 text-teal-400 font-bold text-xs flex items-center justify-center">1</span>
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Select Issue Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`p-3.5 rounded-xl border text-left flex items-start space-x-3 transition ${
                  category === c.id
                    ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-xl flex-shrink-0">{c.icon}</span>
                <div>
                  <span className={`text-xs font-bold block ${category === c.id ? 'text-teal-900' : 'text-slate-800'}`}>
                    {c.label}
                  </span>
                  <span className="text-[10px] text-slate-400">Accredited municipal problem stream</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Problem Description */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-navy-900 text-teal-400 font-bold text-xs flex items-center justify-center">2</span>
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Describe the Situation</h2>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Issue Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Severe Stormwater Drain Obstruction & Flooding at Indiranagar 100ft Rd"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Detailed Description & Observation
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is broken, how long it has been an issue, pedestrian risk, and any nearby landmark..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm text-slate-900 transition resize-none"
            />
          </div>
        </div>

        {/* Step 3: Map Pin Picker */}
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-navy-900 text-teal-400 font-bold text-xs flex items-center justify-center">3</span>
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Pin Location on City Map</h2>
          </div>
          <PinPicker initialLat={latitude} initialLng={longitude} onLocationSelect={handleLocationSelect} />
        </div>

        {/* Step 4: Photo Evidence Upload */}
        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-navy-900 text-teal-400 font-bold text-xs flex items-center justify-center">4</span>
            <h2 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Photo Evidence (Optional)</h2>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-500 transition cursor-pointer relative bg-slate-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="space-y-2">
                <img src={imagePreview} alt="Preview" className="h-32 mx-auto rounded-lg object-cover shadow-sm" />
                <p className="text-xs text-teal-700 font-semibold">Click to replace photo</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Camera className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs font-semibold text-slate-700">Drop an on-site photograph or click to browse</p>
                <p className="text-[11px] text-slate-400">PNG, JPG, or WEBP up to 25MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/citizen/dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm flex items-center space-x-2 disabled:opacity-50 border border-teal-500"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Submit & Run AI Triage</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
