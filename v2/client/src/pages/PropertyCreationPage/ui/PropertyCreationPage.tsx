import * as React from "react";
import { Link } from "react-router-dom";
import { PropertyCreationWizard } from "../../../widgets/PropertyCreationWizard/ui/PropertyCreationWizard";

export function PropertyCreationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Small top bar */}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-black text-gray-900 tracking-tighter">
            Hatka <span className="text-blue-600">Host</span>
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Сохранить и выйти
          </Link>
        </div>
      </div>

      <main className="pb-24">
        <PropertyCreationWizard />
      </main>
    </div>
  );
}
