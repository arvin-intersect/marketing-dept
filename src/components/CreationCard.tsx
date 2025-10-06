
import { BarChart3, Database, Link2, Rocket } from "lucide-react";

export const CreationCard = () => {
  return (
    <div className="rounded-lg p-8 flex flex-col bg-gradient-to-r from-blue-card to-yellow-card relative overflow-hidden">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Intersect AI Marketing Suite
      </h2>
      <p className="text-gray-700 mb-10 max-w-md">
        A self-sustaining ecosystem of AI agents that connect analytics, lead capture, nurture, and outreach — working together to grow autonomously.
      </p>

      <div className="flex-grow relative min-h-[320px] flex items-center justify-center">
        {/* Background pulse ring */}
        <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-blue-300/20 via-purple-300/20 to-pink-300/20 blur-3xl" />

        {/* Central AI Core */}
        <div className="absolute flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-center shadow-xl border-4 border-white z-10">
          AI Core
        </div>

        {/* Pulse */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="p-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl shadow-md border-2 border-white">
            <BarChart3 size={28} className="text-white" />
          </div>
          <span className="text-sm text-gray-800 font-medium mt-2">Pulse</span>
        </div>

        {/* Vault */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="p-4 bg-gradient-to-r from-emerald-400 to-green-600 rounded-xl shadow-md border-2 border-white">
            <Database size={28} className="text-white" />
          </div>
          <span className="text-sm text-gray-800 font-medium mt-2">Vault</span>
        </div>

        {/* Bridge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="p-4 bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-xl shadow-md border-2 border-white">
            <Link2 size={28} className="text-white" />
          </div>
          <span className="text-sm text-gray-800 font-medium mt-2">Bridge</span>
        </div>

        {/* Edge */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="p-4 bg-gradient-to-r from-orange-400 to-pink-600 rounded-xl shadow-md border-2 border-white">
            <Rocket size={28} className="text-white" />
          </div>
          <span className="text-sm text-gray-800 font-medium mt-2">Edge</span>
        </div>
      </div>
    </div>
  );
};
