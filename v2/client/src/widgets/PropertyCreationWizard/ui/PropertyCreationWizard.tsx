import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPropertyDraft, prevStep, resetDraft } from '../../../entities/property/model/draft-slice';
import type { RootState } from '../../../app/store';
import { Step1Essentials } from '../../../features/property-create/ui/Step1Essentials';
import { Card } from '../../../shared/ui/Card/Card';
import { X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Step2PropertyInfo } from '../../../features/property-create/ui/Step2PropertyInfo';
import { Step3RoomManagement } from '../../../features/property-create/ui/Step3RoomManagement';
import { Step4Finalize } from '../../../features/property-create/ui/Step4Finalize';

export const PropertyCreationWizard: React.FC = () => {
  const draft = useSelector((state: RootState) => selectPropertyDraft(state));
  const { currentStep, type } = draft;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.confirm('Вы уверены, что хотите выйти? Прогресс будет потерян.')) {
      dispatch(resetDraft());
      navigate('/dashboard');
    }
  };

  const isHotel = type === 'HOTEL_ROOM';

  // Step Mapping
  // 1: Essentials
  // 2: Info
  // 3: Rooms (Hotel Only)
  // 4: Finalize
  
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Essentials />;
      case 2: return <Step2PropertyInfo />;
      case 3: return isHotel ? <Step3RoomManagement /> : <Step4Finalize />;
      case 4: return <Step4Finalize />;
      default: return <Step1Essentials />;
    }
  };

  const totalSteps = isHotel ? 4 : 3;
  const displayStep = currentStep > 3 && !isHotel ? 3 : currentStep;
  const progress = (displayStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 selection:bg-[rgba(255,122,0,0.1)] selection:text-[var(--primary)]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between animate-in fade-in duration-700">
          <div className="flex items-center gap-6">
            {currentStep > 1 && (
              <button 
                onClick={() => dispatch(prevStep())}
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all shadow-sm"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Сдать жилье
              </h1>
              <p className="text-gray-500 font-medium">Создание нового объявления — Шаг {displayStep} из {totalSteps}</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
          >
            <X size={24} />
          </button>
        </header>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-gray-100 shadow-inner">
          <div 
            className="h-full bg-[var(--primary)] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,122,0,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main Step Container */}
        <Card className="p-8 md:p-12 rounded-[2.5rem] border-0 shadow-2xl shadow-gray-200/50 bg-white relative overflow-hidden min-h-[500px]">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,var(--primary-glow),transparent_70%)] opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            {renderStep()}
          </div>
        </Card>
      </div>
    </div>
  );
};
