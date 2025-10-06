import { ArrowRight } from "lucide-react";
import React from "react";

interface AgentCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
}

export const AgentCard = ({ title, subtitle, description, icon, tag, tagColor }: AgentCardProps) => {
  return (
    <div className="feature-card bg-muted rounded-lg p-6 flex flex-col hover:bg-accent transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-gray-800 rounded-lg">
          {icon}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagColor}`}>
          {tag}
        </span>
      </div>
      <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
      <p className="text-sm text-gray-400 flex-grow mb-6">{description}</p>
      <button className="run-button mt-auto bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium self-start hover:bg-blue-700">
        <span>Launch Agent</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};