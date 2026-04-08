import { useState } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import Spinner from '../components/Spinner';
import { MedicalIllustration } from '../components/MedicalBackground';
import { HeartPulse, Sparkles, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function OTCFirstAid() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/otc-first-aid', { symptoms });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 relative">
        <MedicalIllustration type="heart" className="absolute -right-4 -top-6 w-32 h-32 opacity-[0.12] animate-float hidden md:block" />
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-sm animate-glow-pulse">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="section-title">OTC & First Aid</h2>
          <p className="section-subtitle text-sm">Get recommendations for over-the-counter medications and home remedies.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Describe your minor symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="input-field h-28 resize-none"
            placeholder="e.g., Mild nausea after chemotherapy session, headache, low-grade fever..."
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {loading ? 'Getting recommendations...' : 'Get Recommendations'}
        </button>
      </form>

      {loading && <Spinner text="Finding OTC recommendations..." />}

      {error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium animate-slide-down">{error}</div>
      )}

      {result && !result.error && (
        <div className="card space-y-5 animate-slide-up">
          <h3 className="text-lg font-bold text-gray-900">Recommendations</h3>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="bg-gradient-to-r from-purple-50 to-violet-50/50 border border-purple-100/60 rounded-xl p-4">
                  <h4 className="font-bold text-purple-700">{rec.remedy}</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{rec.usage_notes}</p>
                </div>
              ))}
            </div>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-amber-800">Warnings</h4>
              </div>
              <ul className="space-y-2">
                {result.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2.5 leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 text-[10px] font-bold">!</span>
                    </div>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.cancer_patient_note && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50/50 border border-red-200/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <h4 className="font-bold text-red-800">Important Note for Cancer Patients</h4>
              </div>
              <p className="text-sm text-red-700 leading-relaxed">{result.cancer_patient_note}</p>
            </div>
          )}

          <Disclaimer />
        </div>
      )}

      {result?.error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
          {result.error}
          <Disclaimer />
        </div>
      )}
    </div>
  );
}
