import { FilterGroup } from "@/components/search/filter-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HOUSING_TYPES = [
  "Квартиры, апартаменты", "Дома, коттеджи", "Комнаты", "Отели, гостиницы",
  "Апарт-отели", "Мини-гостиницы", "Гостевые дома", "Глэмпинги, базы отдыха",
  "Хостелы", "Студии"
];

const AMENITIES = [
  "Интернет Wi-Fi", "Кондиционер", "Кухня", "Холодильник", "Балкон, лоджия",
  "Детская кроватка", "Стиральная машина", "Телевизор", "Электрочайник",
  "Посуда и принадлежности", "Микроволновая печь", "Духовка", "Полотенца",
  "Утюг с гладильной доской", "Фен", "Джакузи", "Сауна, баня", "Камин",
  "Посудомоечная машина", "Мультиварка", "Терраса", "Водонагреватель"
];

const ON_SITE = ["Парковка", "Беседка", "Мангал", "Бассейн", "Детская площадка"];
const VIEWS = ["На море", "На горы", "На реку, озеро", "На город"];
const RULES = ["Курение разрешено", "Вечеринки разрешены", "Заселение без депозита"];
const BATHROOMS = ["Своя ванная команата", "Свой туалет", "Свой душ"];
const DINING = ["Завтрак", "Обед", "Ужин"];
const EXTRA = ["Быстро отвечают", "Трансфер", "Ранний заезд разрешен", "Поздний отъезд разрешен", "Предоплата 100%", "Отчётные документы"];

interface SidebarFiltersProps {
  variant?: "simple" | "detailed";
}

export function SidebarFilters({ variant = "detailed" }: SidebarFiltersProps) {
  const isDetailed = variant === "detailed";

  return (
    <div className={cn("flex flex-col gap-[1px] w-72 pb-20", !isDetailed && "gap-4")}>
      {/* Быстрое бронирование */}
      <FilterGroup
        title="Быстрое бронирование"
        description="Всего 2 минуты, без ожидания ответа от хозяина"
        headerAction={<Switch defaultChecked className="bg-orange-500" />}
      />

      {/* Популярные фильтры - Detailed Only */}
      {isDetailed && (
        <FilterGroup title="Популярные фильтры">
          <div className="flex flex-col gap-3">
            {["Бесконтактное заселение", "Парковка", "Жилье со скидкой"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Тип жилья - Shown in both, but maybe simpler in Simple? */}
      {/* Actually, let's keep it consistent but maybe fewer items if simple? */}
      <FilterGroup title="Тип жилья">
        <div className="flex flex-col gap-3">
          {(isDetailed ? HOUSING_TYPES : HOUSING_TYPES.slice(0, 5)).map((item) => (
            <div key={item} className="flex items-center gap-3">
              <Checkbox id={item} className="w-4 h-4 border-gray-200" />
              <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">
                {item}
              </label>
            </div>
          ))}
        </div>
      </FilterGroup>

      {/* Цена, ₽ */}
      <FilterGroup title="Цена, ₽">
        <div className="flex flex-col gap-5">
          {isDetailed && (
            <div className="h-11 p-0.5 bg-gray-100 rounded-2xl flex items-center">
              <button className="flex-1 h-full bg-white rounded-2xl text-neutral-950 text-sm font-medium">за сутки</button>
              <button className="flex-1 h-full text-foreground text-sm font-medium">за 15 суток</button>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-11 px-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">от 0</span>
              <span className="text-foreground text-sm font-medium">₽</span>
            </div>
            <span className="text-foreground text-sm font-medium">—</span>
            <div className="flex-1 h-11 px-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">20 000 +</span>
              <span className="text-foreground text-sm font-medium">₽</span>
            </div>
          </div>
          <Slider defaultValue={[20, 80]} max={100} step={1} className="mt-1" />
        </div>
      </FilterGroup>

      {isDetailed && (
        <>
          {/* Оценка по отзывам */}
          <FilterGroup title="Оценка по отзывам">
            <div className="flex flex-col gap-3">
              {["Топ 9+", "Отлично 8+", "Хорошо 7+", "Пойдет 6+"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Выбор количества */}
          <FilterGroup title="Отдельные спальни">
            <div className="flex flex-wrap gap-1">
              {["Не важно", "1+", "2+", "3+", "4+"].map((item, idx) => (
                <button key={item} className={cn(
                  "h-10 px-4 rounded-2xl text-sm font-medium transition-colors",
                  idx === 0 ? "bg-gray-100 ring-1 ring-orange-500" : "border border-gray-100"
                )}>
                  {item}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* В помещении */}
          <FilterGroup title="В помещении">
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {AMENITIES.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">
                    {item}
                  </label>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 h-11 bg-gray-100 rounded-2xl text-neutral-950 text-sm font-medium hover:bg-gray-200 transition-colors">
              Показать все
            </button>
          </FilterGroup>

          {/* Площадь */}
          <FilterGroup title="Площадь">
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-11 px-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">от </span>
                <span className="text-foreground text-sm font-medium">м²</span>
              </div>
              <span className="text-foreground text-sm font-medium">—</span>
              <div className="flex-1 h-11 px-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">до</span>
                <span className="text-foreground text-sm font-medium">м²</span>
              </div>
            </div>
          </FilterGroup>

          {/* Этаж */}
          <FilterGroup title="Этаж">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-11 px-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">от </span>
                  <span className="text-foreground text-sm font-medium">м²</span>
                </div>
                <span className="text-foreground text-sm font-medium">—</span>
                <div className="flex-1 h-11 px-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">до</span>
                  <span className="text-foreground text-sm font-medium">м²</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {["Не первый", "Не цоколь", "Последний", "Не последний"].map((item) => (
                  <button key={item} className="h-10 px-4 rounded-2xl border border-gray-100 text-sm font-medium">{item}</button>
                ))}
              </div>
            </div>
          </FilterGroup>

          {/* Правила размещения */}
          <FilterGroup title="Правила размещения">
            <div className="flex flex-col gap-3">
              {RULES.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">{item}</label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* На территории */}
          <FilterGroup title="На территории">
            <div className="flex flex-col gap-3">
              {ON_SITE.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">{item}</label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Вид из окон */}
          <FilterGroup title="Вид из окон">
            <div className="flex flex-col gap-3">
              {VIEWS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">{item}</label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Санузел */}
          <FilterGroup title="Санузел">
            <div className="flex flex-col gap-3">
              {BATHROOMS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">{item}</label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Питание */}
          <FilterGroup title="Питание">
            <div className="flex flex-col gap-3">
              {DINING.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">{item}</label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Звёздность отеля */}
          <FilterGroup title="Звёздность отеля">
            <div className="flex flex-wrap gap-1">
              {["5", "4", "3", "2", "1 или без рейтинга"].map((item) => (
                <button key={item} className="h-10 px-4 rounded-2xl border border-gray-100 text-sm font-medium inline-flex items-center gap-1">
                  {item} <span className="text-xs">★</span>
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Дополнительно */}
          <FilterGroup title="Дополнительно">
            <div className="flex flex-col gap-3">
              {EXTRA.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} className="w-4 h-4 border-gray-200" />
                  <label htmlFor={item} className="text-foreground text-sm font-medium leading-5 cursor-pointer">{item}</label>
                </div>
              ))}
            </div>
          </FilterGroup>
        </>
      )}

      {/* Сбросить все фильтры - Detailed Only */}
      {isDetailed && (
        <div className="mt-4 px-4 sticky bottom-8 z-10">
          <Button className="w-full h-11 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-sm font-medium shadow-lg">
            Сбросить все фильтры
          </Button>
        </div>
      )}
    </div>
  );
}
