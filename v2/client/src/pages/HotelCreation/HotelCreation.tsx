import * as React from "react";
import { ChevronLeft, CheckCircle2, Upload, Search, Plus, Trash2, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
import type { AppDispatch } from "../../app/store.ts";
import { createProperty } from "../../entities/property/model/property-slice.ts";
import { cn } from "../../shared/lib/clsx.ts";
import { MOCK_CITIES } from "../../shared/api/cities.ts";
import s from "./HotelCreation.module.css";

type Step = 2 | 3 | 4 | 5;

const HOTEL_TYPES = [
  "Гостиница", "Апартамент", "База отдыха", "Эко-отель",
  "Отель", "Апарт-отель", "Гостевой дом", "Парк-отель",
  "Бутик-отель", "Хостел", "Кемпинг", "Пансионат",
  "Мини-гостиница", "Капсульный отель", "Глэмпинг", "Санаторий",
  "Отель эконом-класса", "Паломнический отель"
];

const AMENITIES_CATEGORIES = [
  { title: "Питание", items: ["Завтрак", "Завтрак + обед", "Все включено", "Бар", "Кухня в номере"] },
  { title: "Спорт", items: ["Тренажерный зал", "Баскетбольная площадка", "Теннисный корт", "Гольф", "Прокат велосипедов"] },
  { title: "Спа", items: ["Баня", "Сауна", "Хаммам", "Массаж", "Джакузи", "Солярий", "Парная", "Спа-центр"] },
  { title: "Удобства", items: ["Лифт", "Кондиционер", "Отопление", "Сейф", "Стиральная машина", "Фен", "Гладильные принадлежности", "Телевизор", "Микроволновая печь"] },
  { title: "Для детей", items: ["Детская площадка", "Детский клуб", "Детская анимация", "Услуги няни (платно)"] },
  { title: "На территории", items: ["Сад", "Терраса", "Зона для барбекю", "Парковка"] },
];

export function HotelCreation() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "Отель";
  
  const [step, setStep] = React.useState<Step>(2);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [citySearch, setCitySearch] = React.useState("");
  const [showCities, setShowCities] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    propertyType: "Отель",
    city: "",
    location: "",
    address: "",
    landmarks: "",
    wifi: "Бесплатно",
    wifiPrice: "",
    parking: "Бесплатно",
    checkIn: "14:00",
    checkOut: "12:00",
    paymentMethods: [] as string[],
    smoking: "Нельзя",
    animals: "Нельзя",
    description: "",
    pricePerNight: 5000,
    deposit: "0",
    images: [] as string[],
    amenities: [] as string[]
  });

  const [activeSidebar, setActiveSidebar] = React.useState(0);

  // Auto-save draft mock
  React.useEffect(() => {
    if (step === 3) {
      setIsSaving(true);
      const timer = setTimeout(() => setIsSaving(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [formData, step]);

  const filteredCities = MOCK_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 5);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      await dispatch(createProperty({
        ...formData,
        location: formData.city,
        status: "DRAFT"
      })).unwrap();
      alert("Черновик сохранен");
    } catch (err) {
      alert("Ошибка сохранения черновика");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await dispatch(createProperty({
        ...formData,
        location: formData.city,
        status: "PENDING"
      })).unwrap();
      nextStep();
    } catch (err) {
      alert("Ошибка при создании: " + err);
    }
  };

  const toggleAmenity = (item: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(item) 
        ? prev.amenities.filter(a => a !== item)
        : [...prev.amenities, item]
    }));
  };

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    try {
      const compressedFiles: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedBlob = await imageCompression(files[i], options);
        const base64 = await imageCompression.getDataUrlFromFile(compressedBlob);
        compressedFiles.push(base64);
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedFiles]
      }));
    } catch (error) {
      console.error(error);
      alert("Ошибка при сжатии изображений");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        
        {/* Navigation & Status */}
        <div className={s.navRow}>
          {step === 2 ? (
            <Link to="/dashboard/create" className={s.backBtn}>
              <ChevronLeft size={16} />
              Назад к выбору типа
            </Link>
          ) : (
            <button onClick={prevStep} className={s.backBtn}>
              <ChevronLeft size={16} />
              Назад
            </button>
          )}
          
          <div className={s.statusPanel}>
            <span className={cn(s.statusText, isSaving ? s.saving : s.saved)}>
              {isSaving ? "Автосохранение..." : "Изменения сохранены"}
            </span>
            <div className={s.progressBar}>
              {[2, 3, 4, 5].map((st) => (
                <div 
                  key={st} 
                  className={cn(s.progressItem, step >= st ? s.progressDone : s.progressPending)} 
                />
              ))}
            </div>
            <button onClick={handleSaveDraft} className={s.draftBtn}>Сохранить черновик</button>
          </div>
        </div>

        {/* Step Content */}
        <div className={s.stepWrapper}>
          
          {step === 2 && (
            <div className={s.step2Content}>
              <div className={s.sectionBlock}>
                <h2 className={s.sectionTitle}>Выберите заголовок объявления:</h2>
                <div className={s.typesGrid}>
                  {HOTEL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData(p => ({ ...p, propertyType: type }))}
                      className={cn(s.typeBtn, formData.propertyType === type ? s.typeBtnActive : "")}
                    >
                      <div className={s.radioCircle}>
                        {formData.propertyType === type && <div className={s.radioDot} />}
                      </div>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.sectionBlock}>
                <h2 className={s.sectionTitle}>Укажите местоположение объекта:</h2>
                <div className={s.locationForm}>
                   <div className={s.locInputRow}>
                      <div className={s.locFieldBox}>
                        <label className={s.locLabel}>Город</label>
                        <div className={s.inputWrapper}>
                          <MapPin size={18} className={s.inputIcon} />
                          <input
                            type="text"
                            placeholder="Введите город"
                            value={citySearch}
                            onChange={(e) => {
                              setCitySearch(e.target.value);
                              setShowCities(true);
                            }}
                            onFocus={() => setShowCities(true)}
                            className={cn(s.inputField, s.withIcon)}
                          />
                          {showCities && citySearch && (
                            <div className={s.dropdownBox}>
                              {filteredCities.map((city) => (
                                <button
                                  key={city}
                                  onClick={() => {
                                    setFormData(p => ({ ...p, city }));
                                    setCitySearch(city);
                                    setShowCities(false);
                                  }}
                                  className={s.dropdownItem}
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={s.locFieldBox}>
                        <label className={s.locLabel}>Улица</label>
                        <input 
                          type="text" 
                          placeholder="Название улицы" 
                          value={formData.address}
                          onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                          className={s.inputField} 
                        />
                      </div>
                   </div>
                </div>
              </div>

              <div className={s.actionBtnRow}>
                <button 
                  onClick={nextStep}
                  disabled={!formData.city && !citySearch}
                  className={s.primaryBtn}
                >
                  Продолжить
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={s.step3Layout}>
              {/* Sidebar Navigation */}
              <div className={s.sidebar}>
                {["Основная информация", "Фотографии", "Номера"].map((item, i) => (
                  <button 
                    key={item}
                    onClick={() => setActiveSidebar(i)}
                    className={cn(s.sidebarBtn, activeSidebar === i ? s.sidebarBtnActive : "")}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className={s.formContent}>
                
                {activeSidebar === 0 && (
                  <div className={s.longForm}>
                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Название гостиницы</h3>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        className={s.inputField}
                        placeholder={formData.propertyType + " 'Название'"}
                      />
                      <p className={s.inputHelp}>Это название будут видеть гости при поиске</p>
                    </div>

                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Ориентиры (необязательно)</h3>
                      <textarea 
                        className={s.textareaSmall}
                        value={formData.landmarks}
                        onChange={(e) => setFormData(p => ({ ...p, landmarks: e.target.value }))}
                        placeholder="Например: рядом с парком, 5 минут до метро"
                      />
                    </div>

                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Интернет</h3>
                      <div className={s.radioCol}>
                        {["Бесплатно", "Платно", "Нет"].map(it => (
                          <label key={it} className={s.radioLabelInline}>
                            <input 
                              type="radio" 
                              checked={formData.wifi === it}
                              onChange={() => setFormData(p => ({ ...p, wifi: it }))}
                            />
                            <span>{it}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Парковка</h3>
                      <div className={s.radioCol}>
                        {["Бесплатно", "Платно", "Нет"].map(it => (
                          <label key={it} className={s.radioLabelInline}>
                            <input 
                              type="radio" 
                              checked={formData.parking === it}
                              onChange={() => setFormData(p => ({ ...p, parking: it }))}
                            />
                            <span>{it}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Удобства и услуги</h3>
                      {AMENITIES_CATEGORIES.map(cat => (
                        <div key={cat.title} className={s.amenitySection}>
                          <p className={s.amenityCatTitle}>{cat.title}</p>
                          <div className={s.amenityTagsWrap}>
                            {cat.items.map(item => (
                              <button 
                                key={item}
                                onClick={() => toggleAmenity(item)}
                                className={cn(s.amenityTag, formData.amenities.includes(item) && s.amenityTagActive)}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Правила проживания</h3>
                      <div className={s.rulesGrid}>
                         <div className={s.ruleRow}>
                            <span>Курение на территории</span>
                            <div className={s.radioRowWrap}>
                               {["Можно", "Нельзя"].map(it => (
                                 <label key={it} className={s.radioLabelInline}>
                                   <input type="radio" checked={formData.smoking === it} onChange={() => setFormData(p => ({ ...p, smoking: it }))} />
                                   <span>{it}</span>
                                 </label>
                               ))}
                            </div>
                         </div>
                         <div className={s.ruleRow}>
                            <span>Размещение с животными</span>
                            <div className={s.radioRowWrap}>
                               {["Можно", "Нельзя", "По запросу"].map(it => (
                                 <label key={it} className={s.radioLabelInline}>
                                   <input type="radio" checked={formData.animals === it} onChange={() => setFormData(p => ({ ...p, animals: it }))} />
                                   <span>{it}</span>
                                 </label>
                               ))}
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className={s.formCard}>
                      <h3 className={s.formCardTitle}>Описание объекта</h3>
                      <textarea 
                        className={s.textareaLarge}
                        value={formData.description}
                        onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                        placeholder="Опишите ваш объект максимально подробно"
                      />
                    </div>

                    <div className={s.actionRow}>
                       <button onClick={() => setActiveSidebar(1)} className={s.nextBtn}>Далее к фотографиям</button>
                    </div>
                  </div>
                )}

                {activeSidebar === 1 && (
                  <div className={s.photoSection}>
                    <h3 className={s.formCardTitle}>Загрузка фотографий</h3>
                    <div className={s.uploadArea}>
                      <input 
                        type="file" 
                        id="photo-upload" 
                        multiple 
                        accept="image/*" 
                        onChange={onFileUpload} 
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="photo-upload" className={s.dropzoneBox}>
                        {isUploading ? (
                          <div className={s.loaderWrap}>
                            <Loader2 className={s.spin} size={40} />
                            <span>Сжатие фотографий...</span>
                          </div>
                        ) : (
                          <>
                            <Upload size={40} color="#a3a3a3" />
                            <p>Нажмите для загрузки или перетащите фото</p>
                            <span className={s.helperText}>Минимум 5 фото, до 10МБ каждая</span>
                          </>
                        )}
                      </label>
                    </div>

                    <div className={s.imageGrid}>
                      {formData.images.map((img, i) => (
                        <div key={i} className={s.imageThumb}>
                          <img src={img} alt="" />
                          <button onClick={() => removeImage(i)} className={s.removeImgBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className={s.actionRow}>
                       <button onClick={() => setActiveSidebar(2)} className={s.nextBtn}>Далее к номерам</button>
                    </div>
                  </div>
                )}

                {activeSidebar === 2 && (
                   <div className={s.roomsSection}>
                      <h3 className={s.formCardTitle}>Номера</h3>
                      <p className={s.inputHelp}>Добавьте хотя бы один тип номера для вашего отеля</p>
                      <button className={s.addRoomBtn}>
                        <Plus size={20} />
                        Добавить номер
                      </button>

                      <div className={s.actionRow} style={{ marginTop: '4rem' }}>
                         <button onClick={handlePublish} className={s.publishBtnLarge}>Опубликовать</button>
                      </div>
                   </div>
                )}

              </div>
            </div>
          )}

          {step === 5 && (
            <div className={s.step5Layout}>
              <div className={s.successIconWrap}>
                <CheckCircle2 size={56} />
              </div>
              <h2 className={s.successTitle}>Объект отправлен на модерацию!</h2>
              <p className={s.successDesc}>Мы проверим ваше объявление в ближайшее время.</p>
              <button 
                onClick={() => navigate("/dashboard")} 
                className={s.primaryBtn}
                style={{ marginTop: '2rem' }}
              >
                Вернуться в кабинет
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
