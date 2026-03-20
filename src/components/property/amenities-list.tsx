"use client";

interface AmenityGroup {
  title: string;
  items: string[];
}

interface AmenitiesListProps {
  main: string[];
  groups: AmenityGroup[];
}

export function AmenitiesList({ main, groups }: AmenitiesListProps) {
  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-neutral-950 text-xl font-semibold leading-7">Основные удобства</h2>
        <div className="flex flex-wrap gap-1">
          {main.map((item, i) => (
            <div 
              key={i} 
              className="px-4 py-1.5 bg-gray-200 rounded-xl text-neutral-950 text-xs font-medium leading-4"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {groups.map((group, i) => (
        <div key={i} className="flex flex-col gap-2">
          <h3 className="text-neutral-950 text-lg font-semibold leading-6">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1">
            {group.items.map((item, j) => (
              <p 
                key={j} 
                className="text-neutral-950 text-xs font-medium leading-4"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
      
      {/* "Other amenities" layout variant from design */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <h3 className="text-neutral-950 text-lg font-semibold leading-6">Другие удобства</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1">
            <h4 className="text-neutral-950 text-base font-semibold leading-6">Оснащение</h4>
            <div className="flex flex-col gap-2">
              {["Постельное белье", "Стиральная машина", "Беспроводной интернет wi-fi", "Сушилка для белья", "Утюг с гладильной доской"].map((item, i) => (
                <p key={i} className="text-neutral-950 text-xs font-medium leading-4">{item}</p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h4 className="text-neutral-950 text-base font-semibold leading-6">Для отдыха</h4>
              <p className="text-neutral-950 text-xs font-medium leading-4">Телевизор</p>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-neutral-950 text-base font-semibold leading-6">Ремонт</h4>
              <p className="text-neutral-950 text-xs font-medium leading-4">Евроремонт</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-neutral-950 text-base font-semibold leading-6">Доступность</h4>
            <p className="text-neutral-950 text-xs font-medium leading-4">Лифт</p>
          </div>
        </div>
      </div>
    </div>
  );
}
