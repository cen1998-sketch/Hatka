import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useListingWizard } from "../../../features/listing-create/model/useListingWizard";
import { Step1Location } from "../../../features/listing-create/ui/steps/Step1Basics";
import { Step2Details } from "../../../features/listing-create/ui/steps/Step2Location";
import { Step3Content } from "../../../features/listing-create/ui/steps/Step3Content";
import { Step3Amenities } from "../../../features/listing-create/ui/steps/Step3Amenities";
import { Step4Publish } from "../../../features/listing-create/ui/steps/Step4Publish";
import { usePublishListingMutation } from "../../../features/listing-create/api/listingApi";
import { Button } from "../../../shared/ui/Button/Button";
import { Loader2, ChevronLeft, ChevronRight, Save } from "lucide-react";

export function PropertyCreationPage() {
  const navigate = useNavigate();
  const { 
    listing, 
    isFetching, 
    isSaving, 
    updateField, 
    step, 
    setStep, 
    listingId 
  } = useListingWizard();

  const [publishListing, { isLoading: isPublishing }] = usePublishListingMutation();

  const handlePublish = async () => {
    console.log('[Wizard] handlePublish triggered, listingId:', listingId);
    if (!listingId) {
      console.warn('[Wizard] Cannot publish: listingId is missing');
      return;
    }
    try {
      await publishListing(listingId).unwrap();
      console.log('[Wizard] Publish success');
      alert('Объявление отправлено на публикацию!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[Wizard] Publish failed:', err);
      if (err?.data?.details) {
        const details = JSON.stringify(err.data.details);
        alert(`Ошибка валидации: ${details}`);
      } else {
        alert(err?.data?.error || 'Ошибка при публикации. Проверьте все поля.');
      }
    }
  };

  const isLoading = isFetching && !listing;

  const renderStep = () => {
    switch(step) {
      case 1: return <Step1Location data={listing} updateField={updateField} />;
      case 2: return <Step2Details data={listing} updateField={updateField} />;
      case 3: return <Step3Content data={listing} updateField={updateField} />;
      case 4: return <Step3Amenities data={listing} updateField={updateField} />;
      case 5: return <Step4Publish data={listing} updateField={updateField} onPublish={handlePublish} isPublishing={isPublishing} />;
      default: return <Step1Location data={listing} updateField={updateField} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-[100] border-b border-gray-200 bg-white/80 backdrop-blur-xl px-8 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ChevronLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Создание объявления</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Шаг {step} из 5</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isSaving && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg animate-pulse">
                <Save size={14} />
                <span className="text-xs font-bold">Сохранение...</span>
              </div>
            )}
            <Button 
               variant="outline" 
               size="sm" 
               className="rounded-xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
               onClick={() => navigate('/dashboard')}
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-gray-500 font-bold">Загрузка данных...</p>
          </div>
        ) : (
          <div className="transition-all duration-300 transform">
            {renderStep()}
          </div>
        )}
      </main>

      {/* Persistent Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-xl p-6 z-[100]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className={`flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft size={20} />
            Назад
          </button>
          
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 bg-gray-900 text-white font-bold px-8 py-3 rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200"
            >
              Дальше
              <ChevronRight size={20} />
            </button>
          ) : (
            <div className="w-24" /> // Spacer for balanced layout
          )}
        </div>
      </div>
    </div>
  );
}
