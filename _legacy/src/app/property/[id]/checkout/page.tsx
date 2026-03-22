import { MOCK_PROPERTY_DETAIL } from "@/lib/mock-data";
import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { CheckoutAlert } from "@/components/checkout/checkout-alert";
import { CheckoutPropertyCard } from "@/components/checkout/checkout-property-card";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";
import { TripInfoSection } from "@/components/checkout/trip-info-section";
import { UserDataForm } from "@/components/checkout/user-data-form";
import { CheckoutSideCard } from "@/components/checkout/checkout-side-card";
import { StayDetailsCard } from "@/components/checkout/stay-details-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  // Mock property data
  const property = MOCK_PROPERTY_DETAIL;
  const bookingId = "39783375";

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[1140px] mx-auto pt-6 pb-20 px-4 xl:px-0">
        
        {/* Back Button */}
        <div className="mb-4">
          <Link href={`/property/${params.id}`}>
            <Button variant="ghost" className="h-11 px-0 flex items-center gap-1.5 hover:bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Вернуться к объявлению</span>
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* Main Content (Left) */}
          <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
            <CheckoutHeader bookingId={bookingId} />
            
            <CheckoutAlert message="Скорее внесите предоплату, пока жильё ещё свободно" />
            
            <CheckoutPropertyCard property={property} />
            
            <PaymentMethodSelector />
            
            <TripInfoSection />
            
            <UserDataForm />
            
            <StayDetailsCard rules={property.rules} />
          </div>

          {/* Sidebar (Right) */}
          <aside className="w-full lg:w-96 flex-shrink-0 lg:sticky lg:top-6 flex flex-col gap-5">
            <CheckoutSideCard 
              totalPrice={66560}
              prepayment={13312}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
