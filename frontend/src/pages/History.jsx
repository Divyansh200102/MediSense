import { useState, useEffect } from 'react';
import api from '../api';
import Disclaimer from '../components/Disclaimer';
import { MedicalIllustration } from '../components/MedicalBackground';
import { History as HistoryIcon, Filter, ChevronDown, ChevronUp, Clock, MessageSquare, Bot, AlertCircle, UserCheck, Brain, BookOpen, ClipboardCheck, ShieldCheck, ShieldAlert, ShieldOff, Pill, Sun, Coffee, Moon, Cookie, Lightbulb, AlertTriangle, HeartPulse } from 'lucide-react';

const moduleLabels = {
  SYMPTOM_TRIAGE: 'Symptom Triage',
  REPORT_SIMPLIFIER: 'Report Simplifier',
  DIET_GENERATOR: 'Diet Plan',
  DRUG_INTERACTION: 'Drug Checker',
  OTC_FIRST_AID: 'OTC & First Aid',
};

const moduleColors = {
  SYMPTOM_TRIAGE: 'bg-blue-100/80 text-blue-700 border-blue-200/40',
  REPORT_SIMPLIFIER: 'bg-emerald-100/80 text-emerald-700 border-emerald-200/40',
  DIET_GENERATOR: 'bg-orange-100/80 text-orange-700 border-orange-200/40',
  DRUG_INTERACTION: 'bg-rose-100/80 text-rose-700 border-rose-200/40',
  OTC_FIRST_AID: 'bg-purple-100/80 text-purple-700 border-purple-200/40',
};

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = filter ? { module: filter } : {};
      const res = await api.get('/history/', { params });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-500 to-slate-400 flex items-center justify-center shadow-sm">
            <HistoryIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="section-title">Consultation History</h2>
            <p className="section-subtitle text-sm">View your past AI consultations and results.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-auto text-sm py-2"
          >
            <option value="">All Modules</option>
            {Object.entries(moduleLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center animate-pulse">
            <Clock className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">Loading history...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <HistoryIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-600 font-semibold">No consultation history yet</p>
          <p className="text-sm text-gray-400 mt-1">Your AI consultations will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {logs.map((log) => (
            <div key={log.id} className="card card-shimmer hover:shadow-card-hover transition-all cursor-pointer" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`badge text-[10px] border ${moduleColors[log.module_used] || 'bg-gray-100 text-gray-600'}`}>
                    {moduleLabels[log.module_used] || log.module_used}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-sm">
                      {new Date(log.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${expandedId === log.id ? 'bg-primary-50 rotate-180' : 'bg-surface-100'}`}>
                  <ChevronDown className={`w-4 h-4 transition-colors ${expandedId === log.id ? 'text-primary-500' : 'text-gray-400'}`} />
                </div>
              </div>

              {expandedId === log.id && (
                <div className="mt-4 pt-4 border-t border-gray-100/60 space-y-3 animate-slide-down">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Input</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-surface-50/80 rounded-xl p-3.5 whitespace-pre-wrap border border-gray-100/60 leading-relaxed">
                      {log.user_input}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Bot className="w-3.5 h-3.5 text-primary-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Response</span>
                    </div>
                    <div className="bg-primary-50/30 rounded-xl p-4 border border-primary-100/40 space-y-3">
                      <RenderAIResponse module={log.module_used} data={log.ai_response} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Disclaimer />
    </div>
  );
}

/* ── Per-module AI response renderer ── */
const urgencyColors = { Low: 'text-emerald-700 bg-emerald-50 border-emerald-200', Medium: 'text-amber-700 bg-amber-50 border-amber-200', High: 'text-red-700 bg-red-50 border-red-200' };
const riskColors = { Safe: 'text-emerald-700 bg-emerald-50 border-emerald-200', Moderate: 'text-amber-700 bg-amber-50 border-amber-200', High: 'text-red-700 bg-red-50 border-red-200' };
const mealIcons = { breakfast: Sun, lunch: Coffee, dinner: Moon, snack: Cookie };
const mealColors = { breakfast: 'text-amber-500', lunch: 'text-blue-500', dinner: 'text-indigo-500', snack: 'text-orange-500' };

function RenderAIResponse({ module, data }) {
  if (!data) return <p className="text-sm text-gray-400 italic">No response data.</p>;

  // If the AI returned an error
  if (data.error) return <p className="text-sm text-red-600">{data.error}</p>;

  switch (module) {
    case 'SYMPTOM_TRIAGE':
      return <SymptomTriageResponse data={data} />;
    case 'REPORT_SIMPLIFIER':
      return <ReportSimplifierResponse data={data} />;
    case 'DIET_GENERATOR':
      return <DietGeneratorResponse data={data} />;
    case 'DRUG_INTERACTION':
      return <DrugInteractionResponse data={data} />;
    case 'OTC_FIRST_AID':
      return <OTCFirstAidResponse data={data} />;
    default:
      // Fallback: render key-value pairs nicely
      return <GenericResponse data={data} />;
  }
}

function SymptomTriageResponse({ data }) {
  const uc = urgencyColors[data.urgency] || urgencyColors.Low;
  return (
    <>
      {data.urgency && (
        <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border ${uc}`}>
          <AlertCircle className="w-4 h-4" /> Urgency: {data.urgency}
        </div>
      )}
      {data.recommended_specialist && (
        <div className="flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
          <div><span className="text-xs font-bold text-gray-400 uppercase">Specialist</span><p className="text-sm font-semibold text-gray-800">{data.recommended_specialist}</p></div>
        </div>
      )}
      {data.potential_causes?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1"><Brain className="w-3.5 h-3.5 text-primary-500" /><span className="text-xs font-bold text-gray-400 uppercase">Potential Causes</span></div>
          <ul className="space-y-1">{data.potential_causes.map((c, i) => <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>{c}</li>)}</ul>
        </div>
      )}
      {data.explanation && <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/50 rounded-lg p-3 border border-blue-100/40">{data.explanation}</p>}
    </>
  );
}

function ReportSimplifierResponse({ data }) {
  return (
    <>
      {data.simplified_explanation && (
        <div className="bg-emerald-50/60 rounded-lg p-3 border border-emerald-100/40">
          <div className="flex items-center gap-1.5 mb-1"><BookOpen className="w-3.5 h-3.5 text-emerald-600" /><span className="text-xs font-bold text-emerald-600 uppercase">Summary</span></div>
          <p className="text-sm text-gray-700 leading-relaxed">{data.simplified_explanation}</p>
        </div>
      )}
      {data.key_terms?.length > 0 && (
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase">Key Terms</span>
          <div className="mt-1 space-y-1.5">{data.key_terms.map((t, i) => <div key={i} className="text-sm"><span className="font-semibold text-primary-600">{t.term}:</span> <span className="text-gray-600">{t.meaning}</span></div>)}</div>
        </div>
      )}
      {data.general_assessment && (
        <div className="flex items-start gap-2 bg-blue-50/50 rounded-lg p-3 border border-blue-100/40">
          <ClipboardCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 leading-relaxed">{data.general_assessment}</p>
        </div>
      )}
    </>
  );
}

function DietGeneratorResponse({ data }) {
  const dayKeys = ['day_1', 'day_2', 'day_3'];
  const dayLabels = ['Day 1', 'Day 2', 'Day 3'];
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {dayKeys.map((dk, idx) => {
          const day = data[dk];
          if (!day) return null;
          return (
            <div key={dk} className="bg-white/80 rounded-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-400 to-amber-300 px-3 py-1.5"><span className="text-white text-xs font-bold">{dayLabels[idx]}</span></div>
              <div className="p-2.5 space-y-1.5">
                {['breakfast','lunch','dinner','snack'].map(meal => {
                  const MIcon = mealIcons[meal];
                  return day[meal] ? (
                    <div key={meal} className="flex items-start gap-1.5">
                      <MIcon className={`w-3 h-3 ${mealColors[meal]} mt-0.5 flex-shrink-0`} />
                      <div><span className="text-[9px] font-bold text-gray-400 uppercase">{meal}</span><p className="text-xs text-gray-700 leading-relaxed">{day[meal]}</p></div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          );
        })}
      </div>
      {data.tips?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1"><Lightbulb className="w-3.5 h-3.5 text-emerald-600" /><span className="text-xs font-bold text-gray-400 uppercase">Tips</span></div>
          <ul className="space-y-1">{data.tips.map((t, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-emerald-600 font-bold text-xs mt-0.5">{i+1}.</span>{t}</li>)}</ul>
        </div>
      )}
    </>
  );
}

function DrugInteractionResponse({ data }) {
  const rc = riskColors[data.overall_risk] || riskColors.Safe;
  return (
    <>
      {data.overall_risk && (
        <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg border ${rc}`}>
          {data.overall_risk === 'Safe' ? <ShieldCheck className="w-4 h-4" /> : data.overall_risk === 'Moderate' ? <ShieldAlert className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
          Overall Risk: {data.overall_risk}
        </div>
      )}
      {data.summary && <p className="text-sm text-gray-700">{data.summary}</p>}
      {data.interactions?.length > 0 && (
        <div className="space-y-2">
          {data.interactions.map((item, i) => {
            const irc = riskColors[item.risk_level] || riskColors.Safe;
            return (
              <div key={i} className={`rounded-lg p-3 border ${irc}`}>
                <div className="flex items-center gap-2 mb-1"><Pill className="w-3.5 h-3.5" /><span className="font-semibold text-sm">{item.drug_pair}</span><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60">{item.risk_level}</span></div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.explanation}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function OTCFirstAidResponse({ data }) {
  return (
    <>
      {data.recommendations?.length > 0 && (
        <div className="space-y-2">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="bg-purple-50/60 rounded-lg p-3 border border-purple-100/40">
              <span className="font-semibold text-sm text-purple-700">{rec.remedy}</span>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{rec.usage_notes}</p>
            </div>
          ))}
        </div>
      )}
      {data.warnings?.length > 0 && (
        <div className="bg-amber-50/60 rounded-lg p-3 border border-amber-100/40">
          <div className="flex items-center gap-1.5 mb-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-600" /><span className="text-xs font-bold text-amber-700 uppercase">Warnings</span></div>
          <ul className="space-y-1">{data.warnings.map((w, i) => <li key={i} className="text-xs text-amber-700 leading-relaxed">• {w}</li>)}</ul>
        </div>
      )}
      {data.cancer_patient_note && (
        <div className="bg-red-50/60 rounded-lg p-3 border border-red-100/40">
          <div className="flex items-center gap-1.5 mb-1"><HeartPulse className="w-3.5 h-3.5 text-red-600" /><span className="text-xs font-bold text-red-700 uppercase">Cancer Patient Note</span></div>
          <p className="text-xs text-red-700 leading-relaxed">{data.cancer_patient_note}</p>
        </div>
      )}
    </>
  );
}

function GenericResponse({ data }) {
  // Nicely render unknown module data as readable key-value pairs
  const entries = Object.entries(data).filter(([k]) => k !== 'disclaimer');
  return (
    <div className="space-y-2">
      {entries.map(([key, value]) => (
        <div key={key}>
          <span className="text-xs font-bold text-gray-400 uppercase">{key.replace(/_/g, ' ')}</span>
          {typeof value === 'string' ? (
            <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
          ) : Array.isArray(value) ? (
            <ul className="space-y-1 mt-0.5">{value.map((v, i) => <li key={i} className="text-sm text-gray-600">{typeof v === 'object' ? Object.values(v).join(' — ') : v}</li>)}</ul>
          ) : typeof value === 'object' && value !== null ? (
            <div className="text-sm text-gray-600 mt-0.5">{Object.entries(value).map(([k2, v2]) => <div key={k2}><span className="font-medium text-gray-700">{k2.replace(/_/g, ' ')}:</span> {String(v2)}</div>)}</div>
          ) : (
            <p className="text-sm text-gray-700">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
