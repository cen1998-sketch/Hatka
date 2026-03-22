import { Filter, ChevronDown } from "lucide-react";
import { cn } from "../../lib/clsx.ts";
import s from "./TitleBar.module.css";

export function TitleBar() {
  return (
    <div className={s.titleBar}>
      <div className={s.row}>
        {/* Left side: Title */}
        <div className={s.leftSide}>
          <h2 className={s.title}>Все хатки</h2>
        </div>

        {/* Right side: Tabs & Counter & Sorting */}
        <div className={s.rightSide}>
          <div className={s.controls}>
            {/* Rental Duration Tabs */}
            <div className={s.tabs}>
              <button className={cn(s.tab, s.tabActive)}>
                <span>Посуточно</span>
              </button>
              <button className={s.tab}>
                <span>Долгосрочно</span>
              </button>
            </div>

            {/* Total Count */}
            <div className={s.count}>130</div>

            {/* Filter Toggle Icon Button */}
            <button className={s.filterToggle}>
              <Filter className={s.filterIcon} size={16} />
            </button>
          </div>

          {/* Sorting / Viewed Dropdown */}
          <div className={s.dropdown}>
            <span className={s.dropdownValue}>Просмотренные</span>
            <ChevronDown size={16} style={{ color: '#737373' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
