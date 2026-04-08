import { useState } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import Spinner from '../components/Spinner';
import { MedicalIllustration } from '../components/MedicalBackground';
import { Pill, Plus, X, ShieldCheck, ShieldAlert, ShieldOff, Search } from 'lucide-react';

const riskConfig = {
  Safe: { bg: 'bg-emerald-50', border: 'border-emerald-200/60', text: 'text-emerald-700', icon: ShieldCheck, dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
  Moderate: { bg: 'bg-amber-50', border: 'border-amber-200/60', text: 'text-amber-700', icon: ShieldAlert, dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  High: { bg: 'bg-red-50', border: 'border-red-200/60', text: 'text-red-700', icon: ShieldOff, dot: 'bg-red-400', badge: 'bg-red-100 text-red-700' },
};

export default function DrugChecker() {
  const [medications, setMedications] = useState(['', '']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMed = () => setMedications([...medications, '']);
  const removeMed = (idx) => {
    if (medications.length <= 2) return;
    setMedications(medications.filter((_, i) => i !== idx));
  };
  const updateMed = (idx, val) => {
    const copy = [...medications];
    copy[idx] = val;
    setMedications(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meds = medications.filter((m) => m.trim());
    if (meds.length < 2) {
      setError('Please enter at least 2 medications.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/drug-interaction', { medications: meds });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const overallRisk = result?.overall_risk || '';
  const riskStyle = riskConfig[overallRisk] || riskConfig.Safe;
  const RiskIcon = riskStyle.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 relative">
        <MedicalIllustration type="capsule" className="absolute -right-4 -top-6 w-32 h-32 opacity-[0.12] animate-float hidden md:block" />
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center shadow-sm animate-glow-pulse">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="section-title">Drug Interaction Checker</h2>
          <p className="section-subtitle text-sm">Enter your medications to check for adverse interactions.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <label className="block text-sm font-semibold text-gray-600">Medications</label>
        <div className="space-y-2">
          {medications.map((med, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-surface-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
              </div>
              <input
                type="text"
                value={med}
                onChange={(e) => updateMed(idx, e.target.value)}
                className="input-field"
                placeholder={`Medication ${idx + 1} (e.g., ${idx === 0 ? 'Tamoxifen' : 'Ibuprofen'})`}
              />
              {medications.length > 2 && (
                <button type="button" onClick={() => removeMed(idx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addMed} className="btn-secondary text-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Medication
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Search className="w-4 h-4" />
          {loading ? 'Checking...' : 'Check Interactions'}
        </button>
      </form>

      {loading && <Spinner text="Checking drug interactions..." />}

      {error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium animate-slide-down">{error}</div>
      )}

      {result && !result.error && (
        <div className="card space-y-5 animate-slide-up">
          <h3 className="text-lg font-bold text-gray-900">Interaction Results</h3>

          {overallRisk && (
            <div className={`flex items-center gap-3 border rounded-xl px-5 py-4 ${riskStyle.bg} ${riskStyle.border}`}>
              <div className={`w-3 h-3 rounded-full ${riskStyle.dot} animate-pulse-soft`} />
              <RiskIcon className={`w-6 h-6 flex-shrink-0 ${riskStyle.text}`} />
              <div>
                <span className={`font-bold text-lg ${riskStyle.text}`}>Overall Risk: {overallRisk}</span>
                {result.summary && <p className="text-sm text-gray-600 mt-0.5">{result.summary}</p>}
              </div>
            </div>
          )}

          {result.interactions && result.interactions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Detailed Interactions</h4>
              {result.interactions.map((item, i) => {
                const itemRisk = riskConfig[item.risk_level] || riskConfig.Safe;
                const ItemIcon = itemRisk.icon;
                return (
                  <div key={i} className={`border rounded-xl p-4 ${itemRisk.bg} ${itemRisk.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <ItemIcon className={`w-4 h-4 ${itemRisk.text}`} />
                      <span className={`font-bold ${itemRisk.text}`}>{item.drug_pair}</span>
                      <span className={`badge text-[10px] ${itemRisk.badge}`}>{item.risk_level}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.explanation}</p>
                  </div>
                );
              })}
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
