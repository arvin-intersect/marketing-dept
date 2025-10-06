import { useState } from "react";
import { 
  ChevronRight, ChevronDown, HomeIcon, BarChart3, Database, Link2, Rocket,
  Clock, Bookmark, Heart, Album, Boxes
} from "lucide-react";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
};

type DropdownItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

const SidebarItem = ({ icon, label, isActive = false, hasDropdown = false, onClick }: SidebarItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-accent' : 'hover:bg-accent'}`}
    onClick={onClick}
  >
    <div className={isActive ? "text-white" : "text-gray-300"}>{icon}</div>
    <span className="text-white text-sm font-medium flex-1 text-left">{label}</span>
    {hasDropdown && (
      isActive ? <ChevronDown size={16} className="text-gray-300" /> : <ChevronRight size={16} className="text-gray-300" />
    )}
  </button>
);

const DropdownItem = ({ icon, label, isActive = false, onClick }: DropdownItemProps) => (
  <button 
    className={`w-full flex items-center gap-3 p-3 pl-12 hover:bg-accent rounded-md transition-colors ${isActive ? 'bg-accent' : ''}`}
    onClick={onClick}
  >
    <div className={isActive ? "text-white" : "text-gray-300"}>{icon}</div>
    <span className={`text-sm ${isActive ? "text-white" : "text-gray-300"}`}>{label}</span>
  </button>
);

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeDropdownItem, setActiveDropdownItem] = useState("");

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
    setActiveItem(label);
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 border-r border-gray-800">
        <div className="mb-8">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-8 h-8" />
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 rounded-full p-1 text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/407e5ec8-9b67-42ee-acf0-b238e194aa64.png" alt="Logo" className="w-8 h-8" />
          <span className="text-white font-semibold">Intersect AI</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-800"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Home */}
      <div className="py-2 px-3 flex flex-col gap-1">
        <SidebarItem 
          icon={<HomeIcon size={20} />} 
          label="Home" 
          isActive={activeItem === "Home"}
          onClick={() => setActiveItem("Home")}
        />
      </div>

      {/* Intersect Pulse */}
      <div className="py-2 px-3">
        <SidebarItem 
          icon={<BarChart3 size={18} />} 
          label="Intersect Pulse"
          hasDropdown
          isActive={activeItem === "Intersect Pulse"}
          onClick={() => toggleDropdown("Intersect Pulse")}
        />
        {openDropdown === "Intersect Pulse" && (
          <div className="mt-1 space-y-1 animate-fade-in">
            <DropdownItem icon={<BarChart3 size={16} />} label="Dashboard" onClick={() => setActiveDropdownItem("Dashboard")} />
            <DropdownItem icon={<BarChart3 size={16} />} label="SEO Analytics" onClick={() => setActiveDropdownItem("SEO Analytics")} />
            <DropdownItem icon={<BarChart3 size={16} />} label="Ad Performance" onClick={() => setActiveDropdownItem("Ad Performance")} />
          </div>
        )}
      </div>

      {/* Intersect Vault */}
      <div className="py-2 px-3">
        <SidebarItem 
          icon={<Database size={18} />} 
          label="Intersect Vault"
          hasDropdown
          isActive={activeItem === "Intersect Vault"}
          onClick={() => toggleDropdown("Intersect Vault")}
        />
        {openDropdown === "Intersect Vault" && (
          <div className="mt-1 space-y-1 animate-fade-in">
            <DropdownItem icon={<Database size={16} />} label="Lead Sources" />
            <DropdownItem icon={<Database size={16} />} label="Ad Capture" />
            <DropdownItem icon={<Database size={16} />} label="Forms & APIs" />
          </div>
        )}
      </div>

      {/* Intersect Bridge */}
      <div className="py-2 px-3">
        <SidebarItem 
          icon={<Link2 size={18} />} 
          label="Intersect Bridge"
          hasDropdown
          isActive={activeItem === "Intersect Bridge"}
          onClick={() => toggleDropdown("Intersect Bridge")}
        />
        {openDropdown === "Intersect Bridge" && (
          <div className="mt-1 space-y-1 animate-fade-in">
            <DropdownItem icon={<Link2 size={16} />} label="Email Campaigns" />
            <DropdownItem icon={<Link2 size={16} />} label="Content Flows" />
            <DropdownItem icon={<Link2 size={16} />} label="Follow-ups" />
          </div>
        )}
      </div>

      {/* Intersect Edge */}
      <div className="py-2 px-3">
        <SidebarItem 
          icon={<Rocket size={18} />} 
          label="Intersect Edge"
          hasDropdown
          isActive={activeItem === "Intersect Edge"}
          onClick={() => toggleDropdown("Intersect Edge")}
        />
        {openDropdown === "Intersect Edge" && (
          <div className="mt-1 space-y-1 animate-fade-in">
            <DropdownItem icon={<Rocket size={16} />} label="Offers & Promotions" />
            <DropdownItem icon={<Rocket size={16} />} label="Upsell Campaigns" />
            <DropdownItem icon={<Rocket size={16} />} label="Cross-Sell Automation" />
          </div>
        )}
      </div>
    </div>
  );
};
