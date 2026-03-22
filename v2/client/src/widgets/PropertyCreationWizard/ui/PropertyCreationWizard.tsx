import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Save, Clock, Ban, CreditCard } from "lucide-react";
import { cn } from "../../../shared/lib/clsx";
import { Button } from "../../../shared/ui/Button/Button";
import { Input } from "../../../shared/ui/Input/Input";
import { Label } from "../../../shared/ui/Label/Label";
import {
  selectPropertyDraft,
  updateDraft,
  setStep,
  savePropertyDraft
} from "../../../entities/property/model/property-slice";
import { PropertyTypeSelect } from "../../../features/PropertyTypeSelect/ui/PropertyTypeSelect";
import { PropertyLocationForm } from "../../../features/PropertyLocationForm/ui/PropertyLocationForm";
import { PropertyBasicInfoForm } from "../../../features/PropertyBasicInfoForm/ui/PropertyBasicInfoForm";
import { PropertyRulesForm } from "../../../features/PropertyRulesForm/ui/PropertyRulesForm";
import { PropertyAmenitiesForm } from "../../../features/PropertyAmenitiesForm/ui/PropertyAmenitiesForm";
import type { AppDispatch, RootState } from "../../../app/store";
import type { PropertyType, SmokingPolicy, PaymentMethodType, InternetAvailability, ParkingAvailability, AdditionalServicePolicy, PropertyDraftState } from "../../../entities/property/model/types";

const STEPS = [
  "Тип жилья",
  "Адрес",
  "Данные объекта",
  "Правила",
  "Услуги",
  "Описание"
];

export const PropertyCreationWizard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const draft = useSelector((state: RootState) => selectPropertyDraft(state)) as PropertyDraftState;
  const { currentStep, isSaving, lastSavedAt } = draft;

  const handleUpdate = (data: any) => {
    dispatch(updateDraft(data));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      dispatch(setStep(currentStep + 1));
      window.scrollTo(0, 0);
      // Auto-save on next
      dispatch(savePropertyDraft(draft));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch(setStep(currentStep - 1));
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyTypeSelect 
            type={draft.type || 'APARTMENT'} 
            subType={draft.subType}
            onChange={(data) => dispatch(updateDraft(data))} 
          />
        );
      case 2:
        return (
          <PropertyLocationForm 
            city={draft.city}
            streetName={draft.streetName}
            streetType={draft.streetType}
            houseNumber={draft.houseNumber}
            buildingBlock={draft.buildingBlock}
            onChange={handleUpdate} 
          />
        );
      case 3:
        return (
          <PropertyBasicInfoForm 
            title={draft.title}
            registryNumber={draft.registryNumber}
            starRating={draft.starRating}
            registryType={draft.registryType}
            buildYear={draft.buildYear}
            totalRooms={draft.totalRooms}
            onChange={handleUpdate} 
          />
        );
      case 4:
        return (
          <PropertyRulesForm 
            checkIn={draft.checkIn}
            checkOut={draft.checkOut}
            smoking={draft.smoking}
            paymentMethod={draft.paymentMethod}
            onChange={handleUpdate} 
          />
        );
      case 5:
        return (
          <PropertyAmenitiesForm 
            internet={draft.internet}
            parking={draft.parkingEnum}
            isAllInclusive={draft.isAllInclusive}
            cleaningService={draft.cleaningService}
            bedLinen={draft.bedLinen}
            hasReportingDocs={draft.hasReportingDocs}
            hasTransfer={draft.hasTransfer}
            onChange={handleUpdate} 
          />
        );
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Описание и финал</h2>
              <p className="mt-2 text-gray-500">Добавьте подробное описание для будущих гостей.</p>
            </div>
            <textarea
              className="min-h-[200px] w-full rounded-2xl border-2 border-gray-100 p-4 focus:border-blue-600 focus:outline-none"
              placeholder="Расскажите о преимуществах вашего жилья, районе и правилах..."
              value={draft.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      {/* Header & Progress */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
          {STEPS.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;

            return (
              <React.Fragment key={s}>
                {idx > 0 && <div className="h-px w-4 bg-gray-200" />}
                <div className={cn(
                  "flex items-center gap-2",
                  isActive ? "text-blue-600" : isCompleted ? "text-green-600" : ""
                )}>
                  {isCompleted ? <CheckCircle2 size={16} /> : <span>{stepNum}</span>}
                  <span className="hidden sm:inline">{s}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {isSaving ? (
            <div className="flex items-center gap-1.5">
              <Loader2 size={14} className="animate-spin" />
              <span>Сохранение...</span>
            </div>
          ) : lastSavedAt ? (
            <div className="flex items-center gap-1.5">
              <Save size={14} />
              <span>Сохранено в {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ) : (
            <span>Черновик</span>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1 || isSaving}
          className="gap-2 h-12"
        >
          <ChevronLeft size={20} />
          Назад
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isSaving}
          className="gap-2 h-12 px-8 min-w-[140px]"
        >
          {currentStep === STEPS.length ? "Опубликовать" : "Продолжить"}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
