import * as React from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, CreditCard, Smartphone, Globe, Link2, Calendar, Users, ChevronRight, Pen, LogIn, LogOut, Crosshair, Ban, FileText, Info, Loader2 } from "lucide-react";
import { api } from "../../shared/api/api-base.ts";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./Checkout.module.css";

const methods = [
  { id: "sbp", name: "СБП", description: "Приложение банка", icon: <Smartphone size={16} /> },
  { id: "card-ru", name: "Картой онлайн", description: "Российские банки", icon: <CreditCard size={16} /> },
  { id: "card-int", name: "Картой онлайн", description: "Зарубежные банки", icon: <Globe size={16} /> },
  { id: "other", name: "Оплатит другой", description: "Ссылка для оплаты", icon: <Link2 size={16} /> },
];

export function Checkout() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [property, setProperty] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedMethod, setSelectedMethod] = React.useState("sbp");
  const [bookingLoading, setBookingLoading] = React.useState(false);

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guestsCount = Number(searchParams.get('guests')) || 2;

  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.data);
      } catch (error) {
        console.error("Failed to fetch property", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handlePayment = async () => {
    if (!checkIn || !checkOut) return;
    setBookingLoading(true);
    try {
      const response = await api.post('/bookings', {
        propertyId: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestsCount
      });
      if (response.data.success) {
        alert("Бронирование успешно создано!");
        navigate('/dashboard/bookings');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Ошибка при создании бронирования");
    } finally {
      setBookingLoading(false);
    }
  };

  const formatPrice = (p: number) => p.toLocaleString("ru-RU") + " ₽";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Выберите дату";
    return new Date(dateStr).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' });
  };
  
  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!property) return <div className="p-20 text-center">Объект не найден</div>;

  const start = new Date(checkIn || "");
  const end = new Date(checkOut || "");
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = Number(property.pricePerNight) * nights;
  const prepayment = Math.round(totalPrice * 0.2);

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        
        {/* Back Button */}
        <div className={s.backRow}>
          <Link to={`/property/${id}`} className={s.backBtn}>
            <ChevronLeft size={16} />
            <span>Вернуться к объявлению</span>
          </Link>
        </div>

        <div className={s.contentWrapper}>
          
          {/* Main Content (Left) */}
          <div className={s.mainColumn}>
            
            {/* Header */}
            <div className={s.headerRow}>
              <h1 className={s.headerTitle}>Подтвердить и оплатить</h1>
              <span className={s.bookingId}>Номер бронирования: {id}</span> {/* Assuming id is bookingId for now */}
            </div>
            
            {/* Alert */}
            <div className={s.alert}>
              <div className={s.alertIcon}><Clock size={16} /></div>
              <p className={s.alertText}>Скорее внесите предоплату, пока жильё ещё свободно</p>
            </div>
            
            {/* Property Card */}
            <div className={s.propCard}>
              <img src={property.images?.[0]} alt={property.title} className={s.propImage} />
              <div className={s.propInfo}>
                <span className={s.superhostTag}>Суперхозяин</span>
                <h2 className={s.propTitle}>{property.title}</h2>
                <p className={s.propLocation}>Томск, Савиных улица, 4А</p>
                <div className={s.propRatingBlock}>
                  <div className={s.ratingBadge}>9.8</div>
                  <span className={s.ratingCount}>(102 отзыва)</span>
                </div>
              </div>
              <button className={s.guestsBtn}>Выбор гостей</button>
            </div>
            
            {/* Payment Method Selector */}
            <div className={s.card}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <h2 className={s.payTitle}>Способы оплаты</h2>
                <div className={s.payNotice}>
                   <p className={s.payNoticeTitle}>Бронирование не оплачено</p>
                   <p className={s.payNoticeDesc}>Вы ещё не внесли предоплату, можете изменить детали бронирования и выбрать другой способ оплаты</p>
                </div>
              </div>
              <div className={s.methodGrid}>
                {methods.map((method) => (
                  <div 
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(s.methodBtn, selectedMethod === method.id ? s.methodBtnSelected : "")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className={s.methodIconBox}>{method.icon}</div>
                      <div className={s.methodText}>
                        <span className={s.methodName}>{method.name}</span>
                        <span className={s.methodDesc}>{method.description}</span>
                      </div>
                    </div>
                    <div className={cn(s.methodRadio, selectedMethod === method.id ? s.methodRadioInner : "")}>
                       {selectedMethod === method.id && <div className={s.methodRadioInner} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Trip Info Section */}
            <div className={s.card}>
              <h2 className={s.payTitle}>Информация о поездке</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={s.infoRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className={s.infoIconBox}><Calendar size={16} /></div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className={s.infoLabel}>Даты заезда и отъезда</span>
                      <span className={s.infoValue}>
                        {formatDate(checkIn)} - {formatDate(checkOut)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className={s.infoChevron} />
                </div>
                <div style={{ borderTop: "1px solid #f9fafb", paddingTop: "1rem" }}>
                  <div className={s.infoRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className={s.infoIconBox}><Users size={16} /></div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className={s.infoLabel}>Гости</span>
                        <span className={s.infoValue}>{guestsCount} гостей</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className={s.infoChevron} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Data Form */}
            <div className={s.card}>
               <h2 className={s.payTitle}>Ваши данные</h2>
               <div className={s.inputsRow}>
                 <div className={s.inputRel}>
                   <input type="text" defaultValue="Сергич" className={s.inputField} />
                   <Pen size={16} className={s.inputIcon} />
                 </div>
                 <div className={s.inputRel}>
                   <input type="text" defaultValue="Филиппов" className={s.inputField} />
                   <Pen size={16} className={s.inputIcon} />
                 </div>
               </div>
               <h3 style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "#737373", letterSpacing: "-0.025em", margin: "0.5rem 0 0" }}>Уведомления по бронированию и оплате</h3>
               <div className={s.inputsRow}>
                 <div className={s.inputRel}>
                   <input type="text" defaultValue="+7 (913) 321 7010" className={s.inputField} />
                   <Pen size={16} className={s.inputIcon} />
                 </div>
                 <div className={s.inputRel}>
                   <input type="text" placeholder="Электронная почта" className={cn(s.inputField, s.inputFieldEmpty)} />
                 </div>
               </div>
            </div>
            
            {/* Stay Details Card */}
            <div className={s.card}>
              <h2 className={s.payTitle}>Детали проживания</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={s.infoRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className={s.infoIconBox}><LogIn size={16} /></div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span className={s.infoLabel}>Время заезда</span>
                      <span className={s.infoValue}>после {property.checkIn}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className={s.infoChevron} />
                </div>
                
                <div style={{ borderTop: "1px solid #f9fafb", paddingTop: "1rem" }}>
                  <div className={s.infoRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className={s.infoIconBox}><LogOut size={16} /></div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className={s.infoLabel}>Время отъезда</span>
                        <span className={s.infoValue}>до {property.checkOut}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className={s.infoChevron} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f9fafb", paddingTop: "1rem" }}>
                  <div className={s.infoRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className={s.infoIconBox}><Crosshair size={16} /></div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className={s.infoLabel}>Цель заезда (необязательно)</span>
                        <span className={s.infoValue} style={{ color: "#737373" }}>Не указана</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className={s.infoChevron} />
                  </div>
                </div>
              </div>

              {/* Rules Summary Card inside Stay Details */}
              <div style={{ padding: "1rem", backgroundColor: "#f3f4f6", borderRadius: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>Правила проживания</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", color: "#0a0a0a", fontSize: "0.75rem", fontWeight: 500 }}>
                  <p style={{ margin: 0 }}>Можно с детьми любого возраста</p>
                  <p style={{ margin: 0 }}>Курение запрещено</p>
                  <button style={{ color: "#0a0a0a", background: "none", border: "none", display: "flex", alignItems: "center", gap: "0.25rem", padding: 0, marginTop: "0.25rem", cursor: "pointer", textDecoration: "underline" }}>
                    <span>Все правила</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ borderTop: "1px solid #f9fafb", paddingTop: "1rem" }}>
                  <div className={s.infoRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className={s.infoIconBox}><Ban size={16} /></div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0a0a0a" }}>Условия отмены</span>
                    </div>
                    <ChevronRight size={16} className={s.infoChevron} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f9fafb", paddingTop: "1rem" }}>
                  <div className={s.infoRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div className={s.infoIconBox}><FileText size={16} /></div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0a0a0a" }}>Документы для бухгалтерии</span>
                    </div>
                    <ChevronRight size={16} className={s.infoChevron} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar (Right) */}
          <aside className={s.sidebarColumn}>
            
            <div className={s.card}>
              <button 
                className={s.payButton} 
                onClick={handlePayment}
                disabled={bookingLoading}
              >
                {bookingLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : `Оплатить ${formatPrice(prepayment)}`}
              </button>
              <p className={s.payAgree}>
                Нажимая кнопку «Оплатить», вы соглашаетесь с правилами объекта размещения и бронирования
              </p>
            </div>

            <div className={s.card}>
              <h2 className={s.priceCalcHeader}>Расчёт стоимости</h2>
              
              <div className={s.priceRow}>
                <span className={s.priceLabel}>Стоимость проживания за {nights} сут.</span>
                <span className={s.priceVal}>{formatPrice(totalPrice)}</span>
              </div>

              <div style={{ borderTop: "1px solid #f3f4f6", marginTop: "1rem", paddingTop: "1rem" }}>
                <div className={s.priceRow}>
                  <span className={s.priceTotalLabel}>Итого</span>
                  <span className={s.priceTotalVal}>{formatPrice(totalPrice)}</span>
                </div>

                <div className={s.prepaymentBox}>
                   <div className={s.prepaymentLabel}>
                     <span>Предоплата</span>
                     <Info size={12} />
                   </div>
                   <span className={s.prepaymentVal}>{formatPrice(prepayment)}</span>
                </div>

                <div className={s.restBox}>
                   <span className={s.restLabel}>Оплата при заселении</span>
                   <span className={s.restVal}>{formatPrice(totalPrice - prepayment)}</span>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
