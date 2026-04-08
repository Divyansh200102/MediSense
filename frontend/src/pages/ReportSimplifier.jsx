import { useState } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import Spinner from '../components/Spinner';
import { MedicalIllustration } from '../components/MedicalBackground';
import { FileText, Zap, BookOpen, ClipboardCheck } from 'lucide-react';

export default function ReportSimplifier() {
  const [reportText, setReportText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.post('/simplify-report', { report_text: reportText });
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
        <MedicalIllustration type="microscope" className="absolute -right-4 -top-6 w-32 h-32 opacity-[0.12] animate-float hidden md:block" />
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm animate-glow-pulse">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="section-title">Report Simplifier</h2>
          <p className="section-subtitle text-sm">Paste your lab or biopsy report to get a plain-English explanation.</p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Paste your medical report</label>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="input-field h-48 resize-none font-mono text-sm"
            placeholder={"e.g.,\nWBC: 11.2 x10^3/uL (H)\nRBC: 4.5 x10^6/uL\nHemoglobin: 13.2 g/dL\nPlatelet Count: 145 x10^3/uL (L)\nCEA: 8.5 ng/mL (H)\n..."}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {loading ? 'Simplifying...' : 'Simplify Report'}
        </button>
      </form>

      {loading && <Spinner text="Translating your report into plain English..." />}

      {error && (
        <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 text-sm font-medium animate-slide-down">{error}</div>
      )}

      {result && !result.error && (
        <div className="card space-y-5 animate-slide-up">
          <h3 className="text-lg font-bold text-gray-900">Simplified Report</h3>

          {result.simplified_explanation && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-200/40 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Plain English Summary</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{result.simplified_explanation}</p>
            </div>
          )}

          {result.key_terms && result.key_terms.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Terms Explained</h4>
              <div className="space-y-2">
                {result.key_terms.map((item, i) => (
                  <div key={i} className="bg-surface-50/60 rounded-xl p-3.5 border border-gray-100/60">
                    <span className="font-bold text-primary-600">{item.term}</span>
                    <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.general_assessment && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/40">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardCheck className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">General Assessment</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{result.general_assessment}</p>
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
