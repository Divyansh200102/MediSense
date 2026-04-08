import { useState } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import Spinner from '../components/Spinner';
import { MedicalIllustration } from '../components/MedicalBackground';
import {
  Shield, AlertTriangle, AlertCircle, CheckCircle, Activity,
  User, Heart, Search, ChevronDown, ChevronUp, Microscope,
  Stethoscope, ShieldCheck, TrendingUp, BarChart3, ClipboardList,
} from 'lucide-react';

const riskConfig = {
  low: { bg: 'bg-emerald-50', border: 'border-emerald-200/60', text: 'text-emerald-700', barColor: 'bg-emerald-500', icon: CheckCircle, label: 'Low Risk' },
  moderate: { bg: 'bg-amber-50', border: 'border-amber-200/60', text: 'text-amber-700', barColor: 'bg-amber-500', icon: AlertTriangle, label: 'Moderate Risk' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200/60', text: 'text-orange-700', barColor: 'bg-orange-500', icon: AlertCircle, label: 'High Risk' },
  critical: { bg: 'bg-red-50', border: 'border-red-200/60', text: 'text-red-700', barColor: 'bg-red-500', icon: AlertCircle, label: 'Critical Risk' },
};

function getRiskLevel(score) {
  if (score < 40) return 'low';
  if (score < 65) return 'moderate';
  if (score < 85) return 'high';
  return 'critical';
}

const stageColors = {
  'Stage I': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Stage II': 'bg-amber-100 text-amber-700 border-amber-200',
  'Stage III': 'bg-orange-100 text-orange-700 border-orange-200',
  'Stage IV': 'bg-red-100 text-red-700 border-red-200',
};

function ProgressBar({ value, color = 'bg-primary-500', className = '' }) {
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2.5 ${className}`}>
      <div className={`h-2.5 rounded-full transition-all duration-700 ease-out ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export default function CancerDetection() {
  const [form, setForm] = useState({
    age: '', gender: 0, bmi: '', smoking: 0, alcohol: 0,
    physical_activity: 1, family_history: 0, chronic_disease: 0,
    fatigue: 0, weight_loss: 0, persistent_pain: 0, lump_detected: 0,
    blood_in_stool_urine: 0, chronic_cough: 0, skin_changes: 0,
    difficulty_swallowing: 0,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInsights, setShowInsights] = useState(true);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.age || !form.bmi) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        bmi: parseFloat(form.bmi),
      };
      const res = await api.post('/cancer-risk', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const riskLevel = result ? getRiskLevel(result.risk_score) : 'low';
  const rConfig = riskConfig[riskLevel];
  const RiskIcon = rConfig.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 relative">
        <MedicalIllustration type="shield" className="absolute -right-4 -top-6 w-32 h-32 opacity-[0.12] animate-float hidden md:block" />
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-sm animate-glow-pulse">
          <Microscope className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="section-title">Cancer Detection & Prevention</h2>
          <p className="section-subtitle text-sm">AI-powered risk assessment using a custom-trained ML model</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-primary-500" />
          Risk Factor Assessment
        </h3>

        {/* Demographics */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demographics</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Age</label>
              <input type="number" min="18" max="100" value={form.age} onChange={(e) => handleChange('age', e.target.value)} className="input-field" placeholder="e.g. 45" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => handleChange('gender', parseInt(e.target.value))} className="input-field">
                <option value={0}>Female</option>
                <option value={1}>Male</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">BMI</label>
              <input type="number" step="0.1" min="15" max="50" value={form.bmi} onChange={(e) => handleChange('bmi', e.target.value)} className="input-field" placeholder="e.g. 24.5" required />
            </div>
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Lifestyle Factors</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Smoking</label>
              <select value={form.smoking} onChange={(e) => handleChange('smoking', parseInt(e.target.value))} className="input-field">
                <option value={0}>Never</option>
                <option value={1}>Former Smoker</option>
                <option value={2}>Current Smoker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Alcohol Consumption</label>
              <select value={form.alcohol} onChange={(e) => handleChange('alcohol', parseInt(e.target.value))} className="input-field">
                <option value={0}>None</option>
                <option value={1}>Moderate</option>
                <option value={2}>Heavy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Physical Activity</label>
              <select value={form.physical_activity} onChange={(e) => handleChange('physical_activity', parseInt(e.target.value))} className="input-field">
                <option value={0}>Low</option>
                <option value={1}>Moderate</option>
                <option value={2}>High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Medical History</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { field: 'family_history', label: 'Family History of Cancer' },
              { field: 'chronic_disease', label: 'Chronic Disease' },
            ].map(({ field, label }) => (
              <label key={field} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                form[field] ? 'bg-primary-50 border-primary-300 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'
              }`}>
                <input type="checkbox" checked={!!form[field]} onChange={(e) => handleChange(field, e.target.checked ? 1 : 0)} className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  form[field] ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                }`}>
                  {form[field] ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : null}
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Current Symptoms</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { field: 'fatigue', label: 'Persistent Fatigue' },
              { field: 'weight_loss', label: 'Unexplained Weight Loss' },
              { field: 'persistent_pain', label: 'Persistent Pain' },
              { field: 'lump_detected', label: 'Lump Detected' },
              { field: 'blood_in_stool_urine', label: 'Blood in Stool/Urine' },
              { field: 'chronic_cough', label: 'Chronic Cough' },
              { field: 'skin_changes', label: 'Skin Changes' },
              { field: 'difficulty_swallowing', label: 'Difficulty Swallowing' },
            ].map(({ field, label }) => (
              <label key={field} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                form[field] ? 'bg-rose-50 border-rose-300 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'
              }`}>
                <input type="checkbox" checked={!!form[field]} onChange={(e) => handleChange(field, e.target.checked ? 1 : 0)} className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  form[field] ? 'bg-rose-500 border-rose-500' : 'border-gray-300'
                }`}>
                  {form[field] ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : null}
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Search className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Assess Cancer Risk'}
        </button>
      </form>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium animate-slide-down">{error}</div>
      )}

      {/* Results */}
      {result && !result.error && (
        <div className="space-y-5 animate-slide-up">
          {/* Risk Score Card */}
          <div className={`card border-2 ${rConfig.border}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                Risk Assessment Results
              </h3>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${rConfig.bg} ${rConfig.text}`}>
                <RiskIcon className="w-4 h-4" />
                {rConfig.label}
              </div>
            </div>

            {/* Overall Risk Score */}
            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm font-semibold text-gray-500">Overall Cancer Risk Score</span>
                <span className={`text-3xl font-black ${rConfig.text}`}>{result.risk_score}%</span>
              </div>
              <ProgressBar value={result.risk_score} color={rConfig.barColor} />
            </div>

            {/* Predicted Cancer + Stage side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-surface-50/60 rounded-xl p-4 border border-gray-100/60">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Most Likely Cancer Type</span>
                </div>
                <p className="font-bold text-gray-900 text-lg">{result.predicted_cancer}</p>
                <p className="text-sm text-gray-500 mt-0.5">{result.cancer_confidence}% confidence</p>
              </div>
              <div className="bg-surface-50/60 rounded-xl p-4 border border-gray-100/60">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estimated Stage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold border ${stageColors[result.predicted_stage] || 'bg-gray-100 text-gray-700'}`}>
                    {result.predicted_stage}
                  </span>
                  <span className="text-sm text-gray-500">{result.stage_confidence}% confidence</span>
                </div>
              </div>
            </div>

            {/* Top 3 Cancer Probabilities */}
            <div className="mb-5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Top Cancer Probabilities</span>
              <div className="mt-2 space-y-2.5">
                {result.top_3_cancers?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-700">{item.cancer_type}</span>
                        <span className="text-sm font-bold text-gray-900">{item.probability}%</span>
                      </div>
                      <ProgressBar value={item.probability} color={i === 0 ? rConfig.barColor : 'bg-gray-300'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Breakdown */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stage Probability Breakdown</span>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {result.stage_breakdown?.map((item) => (
                  <div key={item.stage} className={`text-center p-3 rounded-xl border ${
                    item.stage === result.predicted_stage ? stageColors[item.stage] + ' border-2' : 'bg-gray-50 border-gray-100 text-gray-600'
                  }`}>
                    <p className="text-xs font-semibold mb-0.5">{item.stage}</p>
                    <p className="text-lg font-black">{item.probability}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Insights */}
          {result.clinical_insights && (
            <div className="card">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="flex items-center justify-between w-full"
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary-500" />
                  Clinical Insights & Recommendations
                </h3>
                {showInsights ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {showInsights && (
                <div className="mt-4 space-y-4 animate-slide-down">
                  {/* Description */}
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/40">
                    <p className="text-sm text-gray-700 leading-relaxed">{result.clinical_insights.description}</p>
                  </div>

                  {/* Specialist */}
                  <div className="bg-surface-50/60 rounded-xl p-4 border border-gray-100/60">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-primary-500" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Specialist</span>
                    </div>
                    <p className="font-bold text-gray-900">{result.clinical_insights.specialist}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Screening */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Microscope className="w-4 h-4 text-primary-500" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Screening</span>
                      </div>
                      <div className="space-y-1.5">
                        {result.clinical_insights.screening?.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-surface-50/40 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prevention */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prevention Tips</span>
                      </div>
                      <div className="space-y-1.5">
                        {result.clinical_insights.prevention?.map((p, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-surface-50/40 rounded-lg px-3 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="card bg-amber-50/50 border-amber-200/40">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Important Disclaimer</p>
                <p className="text-sm text-amber-700 leading-relaxed">{result.disclaimer}</p>
              </div>
            </div>
          </div>
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
