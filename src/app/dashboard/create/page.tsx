import { Bed, Building2, Home, DoorOpen, ChevronLeft } from "lucide-react";
import { CategoryCard } from "@/components/dashboard/create/category-card";
import { CreateListingHeader } from "@/components/dashboard/create/create-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateListingPage() {
  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[1240px] mx-auto pt-6 pb-20 px-8 flex flex-col gap-6">
        
        <div className="flex justify-start">
          <Link href="/dashboard">
            <Button variant="ghost" className="h-10 px-0 flex items-center gap-2 text-muted-foreground hover:text-neutral-950 transition-colors font-medium">
              <ChevronLeft className="w-4 h-4" />
              Назад в кабинет
            </Button>
          </Link>
        </div>

        <CreateListingHeader />

        <div className="flex flex-col gap-10">
          <h2 className="text-neutral-950 text-2xl font-bold">Что будете сдавать?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/create/hotel" className="flex">
              <CategoryCard 
                icon={<Building2 className="w-10 h-10" />}
                title="номера, спальные места"
                subtitle="в отеле, гостевом доме или хостеле"
                description="Гостям будет предоставлен номер в отеле, гостевом доме или отдельное спальное место в хостеле"
              />
            </Link>
            <CategoryCard 
              icon={<Bed className="w-10 h-10" />}
              title="квартиры, апартаменты"
              subtitle="целиком"
              description="Гости снимут квартиру целиком. Вместе со всеми удобствами и кухней"
            />
            <CategoryCard 
              icon={<Home className="w-10 h-10" />}
              title="дома, коттеджи"
              subtitle="целиком"
              description="Гости снимут дом целиком. Вместе с пристройками и придомовой территорией"
            />
            <CategoryCard 
              icon={<DoorOpen className="w-10 h-10" />}
              title="отдельные комнаты"
              subtitle="целиком"
              description="Гости снимут отдельную комнату со спальным местом в вашем жилье"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
