import { useState } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import Spinner from '../components/Spinner';
import { MedicalIllustration } from '../components/MedicalBackground';
import { Stethoscope, AlertCircle, CheckCircle, AlertTriangle, Search, UserCheck, Brain } from 'lucide-react';

const urgencyConfig = {
  Low: { bg: 'bg-emerald-50', border: 'border-emerald-200/60', text: 'text-emerald-700', icon: CheckCircle, dot: 'bg-emerald-400' },
  Medium: { bg: 'bg-amber-50', border: 'border-amber-200/60', text: 'text-amber-700', icon: AlertTriangle, dot: 'bg-amber-400' },
  High: { bg: 'bg-red-50', border: 'border-red-200/60', text: 'text-red-700', icon: AlertCircle, dot: 'bg-red-400' },
};

export default function SymptomTriage() {
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
      const res = await api.post('/symptom-triage', { symptoms });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const urgency = result?.urgency || '';
  const uConfig = urgencyConfig[urgency] || urgencyConfig.Low;
  const UrgencyIcon = uConfig.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 relative">
        <MedicalIllustration type="shield" className="absolute -right-4 -top-6 w-32 h-32 opacity-[0.12] animate-float hidden md:block" />
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm animate-glow-pulse">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="section-title">Symptom Triage</h2>
          <p className="section-subtitle text-sm">Describe your symptoms to get specialist and urgency recommendations.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Describe your symptoms</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="e.g., I've had persistent headaches for 2 weeks, along with unexplained weight loss of about 5kg..."
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Search className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </form>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium animate-slide-down">{error}</div>
      )}

      {result && !result.error && (
        <div className="card space-y-5 animate-slide-up">
          <h3 className="text-lg font-bold text-gray-900">Triage Results</h3>

          {urgency && (
            <div className={`flex items-center gap-3 border rounded-xl px-5 py-4 ${uConfig.bg} ${uConfig.border}`}>
              <div className={`w-3 h-3 rounded-full ${uConfig.dot} animate-pulse-soft`} />
              <UrgencyIcon className={`w-5 h-5 flex-shrink-0 ${uConfig.text}`} />
              <span className={`font-bold text-lg ${uConfig.text}`}>Urgency: {urgency}</span>
            </div>
          )}

          {result.recommended_specialist && (
            <div className="bg-surface-50/60 rounded-xl p-4 border border-gray-100/60">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Specialist</span>
              </div>
              <p className="font-bold text-gray-900 text-lg">{result.recommended_specialist}</p>
            </div>
          )}

          {result.potential_causes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Potential Causes</span>
              </div>
              <div className="space-y-2">
                {result.potential_causes.map((cause, i) => (
                  <div key={i} className="flex items-start gap-3 text-gray-700 bg-surface-50/40 rounded-lg px-3 py-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                    <span className="text-sm leading-relaxed">{cause}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.explanation && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/40">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Explanation</span>
              <p className="text-gray-700 mt-1.5 text-sm leading-relaxed">{result.explanation}</p>
            </div>
          )}

          <Disclaimer />
        </div>
      )}

      {result?.error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
          {result.error}
          {result.raw_response && <p className="mt-2 text-xs opacity-70">{result.raw_response}</p>}
          <Disclaimer />
        </div>
      )}
    </div>
  );
}
