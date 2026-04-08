import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-xl p-4 mt-6">
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
        <ShieldAlert className="w-4 h-4 text-amber-600" />
      </div>
      <p className="text-sm text-amber-800/90 leading-relaxed pt-1">
        <strong className="text-amber-900">Disclaimer:</strong> I am an AI, not a doctor. Please consult your oncologist or
        physician before making medical decisions.
      </p>
    </div>
  );
}
