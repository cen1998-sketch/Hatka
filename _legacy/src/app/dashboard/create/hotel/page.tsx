"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Building2, CheckCircle2, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MOCK_CITIES } from "@/lib/cities";

type Step = 2 | 3 | 4 | 5;

const HOTEL_TYPES = [
  "Гостиница", "Апартамент", "База отдыха", "Эко-отель",
  "Отель", "Апарт-отель", "Гостевой дом", "Парк-отель",
  "Бутик-отель", "Хостел", "Кемпинг", "Пансионат",
  "Мини-гостиница", "Капсульный отель", "Глэмпинг", "Санаторий",
  "Отель эконом-класса", "Паломнический отель"
];

export default function HotelCreationPage() {
  const [step, setStep] = useState<Step>(2);
  const [isSaving, setIsSaving] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [selectedType, setSelectedType] = useState("Отель");

  // Mock auto-save
  useEffect(() => {
    if (step > 1) {
      setIsSaving(true);
      const timer = setTimeout(() => setIsSaving(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedCity, selectedType, step]);

  const filteredCities = MOCK_CITIES.filter(c => 
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 5);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[1240px] mx-auto pt-6 pb-20 px-8 flex flex-col gap-6">
        
        {/* Navigation & Status */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={step === 2 ? undefined : prevStep} 
            asChild={step === 2}
            className="h-10 px-0 flex items-center gap-2 text-muted-foreground hover:text-neutral-950 transition-colors font-medium"
          >
            {step === 2 ? (
              <Link href="/dashboard/create">
                <ChevronLeft className="w-4 h-4" />
                Назад к выбору типа
              </Link>
            ) : (
              <span className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Назад
              </span>
            )}
          </Button>
          
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-xs font-medium transition-opacity duration-300",
              isSaving ? "opacity-100 text-orange-500" : "opacity-40 text-muted-foreground"
            )}>
              {isSaving ? "Автосохранение..." : "Изменения сохранены"}
            </span>
            <div className="flex gap-1">
              {[2, 3, 4, 5].map((s) => (
                <div 
                  key={s} 
                  className={cn(
                    "w-8 h-1 rounded-full transition-all",
                    step >= s ? "bg-orange-500" : "bg-neutral-200"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-10 mt-4">
          
          {step === 2 && (
            <div className="flex flex-col gap-12 max-w-4xl">
              <div className="flex flex-col gap-8">
                <h2 className="text-neutral-950 text-2xl font-bold">Выберите заголовок объявления:</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {HOTEL_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={cn(
                        "h-12 px-4 rounded-xl border text-sm font-medium transition-all text-left flex items-center gap-3",
                        selectedType === type 
                          ? "bg-white border-blue-500 ring-1 ring-blue-500 shadow-sm" 
                          : "bg-white border-neutral-200 hover:border-orange-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                        selectedType === type ? "border-blue-500 bg-white" : "border-neutral-300"
                      )}>
                        {selectedType === type && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8">
                <h2 className="text-neutral-950 text-2xl font-bold">Укажите местоположение объекта:</h2>
                <div className="flex items-center gap-6">
                  <span className="text-neutral-500 font-medium whitespace-nowrap">Город</span>
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Введите город"
                      value={citySearch}
                      onChange={(e) => {
                        setCitySearch(e.target.value);
                        setShowCities(true);
                      }}
                      onFocus={() => setShowCities(true)}
                      className="w-full h-12 bg-white border border-neutral-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-neutral-900 font-medium shadow-sm"
                    />
                    {showCities && citySearch && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 overflow-hidden">
                        {filteredCities.length > 0 ? filteredCities.map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setSelectedCity(city);
                              setCitySearch(city);
                              setShowCities(false);
                            }}
                            className="w-full h-12 px-4 text-left hover:bg-neutral-50 flex items-center gap-3 transition-colors text-neutral-700 font-medium"
                          >
                            <Search className="w-4 h-4 text-neutral-400" />
                            {city}
                          </button>
                        )) : (
                          <div className="h-12 px-4 flex items-center text-muted-foreground text-sm font-medium">Ничего не найдено</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-center">
                <Button 
                  onClick={nextStep}
                  disabled={!selectedCity && !citySearch}
                  className="h-12 px-12 bg-neutral-300 hover:bg-neutral-400 text-neutral-600 font-bold rounded-xl transition-all"
                >
                  Продолжить
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-8 items-start">
              {/* Sidebar Navigation */}
              <div className="w-64 bg-white rounded-[24px] p-2 flex flex-col gap-1 shadow-sm sticky top-6">
                {["Основная информация", "Фотографии", "Номера"].map((item, i) => (
                  <button 
                    key={item}
                    className={cn(
                      "h-11 px-4 text-left rounded-xl font-medium text-sm transition-colors",
                      i === 0 ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-gray-50"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <div className="flex-1 flex flex-col gap-5 max-w-3xl">
                {/* 1. Name */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
                  <h3 className="text-xl font-bold">Название гостиницы</h3>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder={selectedType + " 'Название'"}
                      className="w-full h-12 border border-neutral-200 rounded-xl px-4 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all"
                    />
                    <p className="text-muted-foreground text-xs leading-5">это название будут видеть гости при поиске (если у вас нет названия, можете указать название улицы, номер дома)</p>
                  </div>
                </div>

                {/* 2. Address */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
                  <h3 className="text-xl font-bold">Адрес</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                      <select className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none bg-white text-sm font-medium">
                        <option>Тип улицы</option>
                        <option>ул.</option>
                        <option>пр-т</option>
                      </select>
                      <input type="text" placeholder="Дом" className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none text-sm font-medium" />
                    </div>
                    <div className="flex flex-col gap-4">
                      <input type="text" placeholder="Название улицы" className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none text-sm font-medium" />
                      <input type="text" placeholder="Корпус" className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none text-sm font-medium" />
                    </div>
                  </div>
                </div>

                {/* 3. Registry */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
                  <h3 className="text-xl font-bold">Тип и категория средства размещения</h3>
                  <p className="text-muted-foreground text-sm leading-5">Внесите информацию о вашем объекте из <span className="text-blue-500 hover:underline cursor-pointer">Единого реестра</span>. После успешной проверки мы разместим эти данные для гостей</p>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-neutral-500">Номер реестровой записи*</span>
                      <input type="text" className="w-48 h-12 border border-neutral-200 rounded-xl px-4 focus:outline-none" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-neutral-500">Категория средства размещения (звёзды)</span>
                      <select className="w-48 h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none bg-white">
                        <option>выберите</option>
                        <option>Без звезд</option>
                        <option>3 звезды</option>
                        <option>4 звезды</option>
                        <option>5 звезд</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Infrastructure */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
                  <div className="flex flex-col gap-6">
                    <h3 className="text-xl font-bold">Интернет</h3>
                    <div className="flex flex-col gap-4">
                      {["Да, платно", "Да, бесплатно", "Нет"].map((item) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="internet" className="w-5 h-5 accent-blue-500 cursor-pointer" />
                          <span className="text-sm font-medium text-neutral-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
                    <h3 className="text-xl font-bold">Парковка</h3>
                    <div className="flex flex-col gap-4">
                      {["Нет", "Бесплатная", "Платная"].map((item) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="parking" className="w-5 h-5 accent-blue-500 cursor-pointer" />
                          <span className="text-sm font-medium text-neutral-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Stay Details */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
                  <h3 className="text-xl font-bold">Сведения</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                       <span className="text-xs font-medium text-neutral-400">год постройки</span>
                       <select className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none bg-white text-sm">
                          <option>год постройки</option>
                          <option>2024</option>
                          <option>2023</option>
                       </select>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-xs font-medium text-neutral-400">Количество номеров</span>
                       <input type="number" placeholder="0" className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none text-sm" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pt-4">
                    <h3 className="text-xl font-bold">Заезд и выезд</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                         <span className="text-xs font-medium text-neutral-400">Заезд после</span>
                         <select className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none bg-white text-sm">
                            <option>14:00</option>
                         </select>
                      </div>
                      <div className="flex flex-col gap-2">
                         <span className="text-xs font-medium text-neutral-400">Выезд до</span>
                         <select className="h-12 px-4 border border-neutral-200 rounded-xl focus:outline-none bg-white text-sm">
                            <option>12:00</option>
                         </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
                    <h3 className="text-xl font-bold">Оплата</h3>
                    <div className="flex flex-col gap-4">
                      {["Только наличные", "Только кредитные карты", "Наличные и карты", "Любой способ"].map((item) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="payment" className="w-5 h-5 accent-blue-500 cursor-pointer" />
                          <span className="text-sm font-medium text-neutral-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
                    <h3 className="text-xl font-bold">Курение на территории</h3>
                    <div className="flex flex-col gap-4">
                      {["Запрещено", "Разрешено в специально отведенных местах", "Разрешено везде"].map((item) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <input type="radio" name="smoking" className="w-5 h-5 accent-blue-500 cursor-pointer" />
                          <span className="text-sm font-medium text-neutral-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Amenities & Services */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-10">
                  <h3 className="text-2xl font-bold font-['NT_Somic']">Удобства и услуги</h3>
                  
                  {[
                    { title: "Питание", items: ["Ресторан", "Барная стойка", "Доставка в номер", "Детское меню"] },
                    { title: "Спорт", items: ["Фитнес-зал", "Теннисный корт"] },
                    { title: "Спа", items: ["Сауна", "Спа-центр", "Крытый бассейн", "Бассейн с подогревом", "Открытый бассейн", "Джакузи", "Банный чан"] },
                    { title: "Удобства", items: ["Лифт", "Прачечная", "Круглосуточная стойка регистрации", "Пандус", "Камера хранения"] },
                    { title: "Для детей", items: ["Аквапарк", "Детский бассейн", "Игровая площадка", "Няня", "Анимация"] },
                  ].map((group) => (
                    <div key={group.title} className="flex flex-col gap-4">
                      <h4 className="text-neutral-500 font-medium">{group.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(item => (
                          <button key={item} className="px-5 h-11 border border-neutral-200 rounded-2xl text-sm font-medium hover:border-orange-200 hover:text-orange-500 transition-all">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 7. Nutrition */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
                  <h3 className="text-xl font-bold">Питание</h3>
                  <p className="text-muted-foreground text-sm font-medium">Информация о питании появится во всех категориях номеров</p>
                  
                  <div className="flex flex-col gap-6">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input type="radio" name="food_main" className="mt-1 w-5 h-5 accent-blue-500 cursor-pointer" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-neutral-700">Всё включено</span>
                        <span className="text-xs text-muted-foreground">В стоимость проживания включены завтрак, обед и ужин</span>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input type="radio" name="food_main" defaultChecked className="mt-1 w-5 h-5 accent-blue-500 cursor-pointer" />
                      <div className="flex flex-col gap-4 w-full">
                        <span className="text-sm font-bold text-neutral-700">Настроить вручную</span>
                        <div className="flex items-center justify-between w-full max-w-md">
                          <span className="text-sm font-medium text-neutral-500">Завтрак</span>
                          <select className="h-10 px-4 border border-neutral-200 rounded-lg text-sm bg-white">
                            <option>Выберите</option>
                          </select>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 8. Additional Services */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-8">
                  <h3 className="text-xl font-bold">Плата за дополнительные услуги</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Это дополнительные услуги, их можно предоставить только по запросу гостя или с его согласия. Стоимость этих услуг не включается в расчёт общей цены при бронировании...</p>
                  
                  <div className="flex flex-col gap-8">
                    {["Уборка", "Постельное бельё"].map(title => (
                      <div key={title} className="flex flex-col gap-4">
                        <h4 className="text-neutral-900 font-bold">{title}</h4>
                        <div className="flex flex-col gap-3">
                          {["Входит в стоимость проживания", "Нет", "Да, бесплатно", "Да, платно"].map(item => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer">
                               <input type="radio" name={title} className="w-5 h-5 accent-blue-500 cursor-pointer" />
                               <span className="text-sm font-medium text-neutral-600">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 pt-6 border-t border-neutral-100">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold text-neutral-800">Отчётные документы</span>
                      <div className="w-12 h-6 bg-neutral-200 rounded-full relative cursor-pointer">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-bold text-neutral-800">Предоставляется трансфер</span>
                      <div className="w-12 h-6 bg-neutral-200 rounded-full relative cursor-pointer">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 9. Description */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col gap-6">
                  <h3 className="text-xl font-bold">Описание объекта</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">Гости бронируют объекты с подробным описанием на 25% чаще. <span className="text-blue-500 hover:underline cursor-pointer">На что смотрят гости →</span></p>
                  
                  <textarea 
                    placeholder="Расскажите подробнее о своём объекте"
                    className="w-full h-48 border border-neutral-200 rounded-2xl p-4 focus:ring-1 focus:ring-blue-400 focus:outline-none transition-all resize-none text-sm font-medium"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={nextStep}
                    className="h-14 px-16 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 text-lg"
                  >
                    Далее
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
              <div className="flex flex-col gap-2 items-center py-12">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-neutral-950 text-3xl font-bold">Загрузите фотографии вашего отеля</h2>
                <p className="text-muted-foreground text-center max-w-lg">Хорошие фотографии привлекают больше гостей. Загрузите как минимум 3-5 качественных снимков интерьера и фасада.</p>
              </div>

              <div className="aspect-[21/9] bg-white border-2 border-dashed border-neutral-200 rounded-[24px] flex flex-col items-center justify-center gap-4 hover:border-orange-200 hover:bg-orange-50/10 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                   <Upload className="w-6 h-6 text-neutral-400" />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-neutral-950 font-bold">Нажмите или перетащите файлы</p>
                  <p className="text-muted-foreground text-sm font-medium">PNG, JPG до 10MB</p>
                </div>
              </div>

              <div className="pt-8 flex justify-center">
                <Button 
                  onClick={nextStep}
                  className="h-12 px-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-md shadow-orange-100"
                >
                  Опубликовать и отправить на модерацию
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center gap-8 py-20 max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-neutral-950 text-4xl font-bold">Вы молодец!</h2>
                <p className="text-xl text-neutral-600 font-medium leading-relaxed">
                  Ваш объект <span className="text-neutral-950 font-bold">"{selectedType}"</span> успешно создан и отправлен на модерацию.
                </p>
                <p className="text-muted-foreground font-medium">
                  Обычно проверка занимает от 2 до 24 часов. Как только объект пройдет проверку, он появится в общем списке и станет доступен для бронирования.
                </p>
              </div>
              
              <div className="flex gap-4 mt-4">
                <Button asChild className="h-12 px-8 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl">
                  <Link href="/dashboard">Вернуться в кабинет</Link>
                </Button>
                <Button variant="outline" className="h-12 px-8 border-neutral-300 rounded-xl font-bold">
                  Просмотр объявления
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
