import { SearchBar } from "@/components/layout/search-bar";
import { TitleBar } from "@/components/layout/title-bar";
import { HomeSidebarFilters } from "@/components/layout/home-sidebar";
import { SpecialPicks } from "@/components/layout/special-picks";
import { PropertyCard } from "@/components/ui/property-card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const PROPERTIES = [
  {
    id: "prop-0",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    title: "Томск, Савиных улица, 4А",
    price: "3 000",
    rating: "9,8",
    reviews: "120",
    location: "Кировский р-н",
    specs: { guests: "2 гостя", beds: "1 кровать", area: "18м2" },
  },
  {
    id: "prop-1",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    title: "Томск, проспект Ленина, 121",
    price: "4 500",
    rating: "9,5",
    reviews: "85",
    location: "Ленинский р-н",
    specs: { guests: "4 гостя", beds: "2 кровати", area: "45м2" },
  },
  {
    id: "prop-2",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    title: "Томск, улица Кирова, 15",
    price: "2 800",
    rating: "9,0",
    reviews: "42",
    location: "Советский р-н",
    specs: { guests: "2 гостя", beds: "1 кровать", area: "22м2" },
  },
  {
    id: "prop-3",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    title: "Томск, Комсомольский пр-т, 70",
    price: "5 200",
    rating: "9,9",
    reviews: "210",
    location: "Октябрьский р-н",
    specs: { guests: "6 гостей", beds: "3 кровати", area: "75м2" },
  },
  {
    id: "prop-4",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    title: "Томск, улица Вершинина, 19",
    price: "3 600",
    rating: "9,3",
    reviews: "67",
    location: "Советский р-н",
    specs: { guests: "3 гостя", beds: "2 кровати", area: "36м2" },
  },
  {
    id: "prop-5",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    title: "Томск, Иркутский тракт, 86",
    price: "6 800",
    rating: "9,7",
    reviews: "153",
    location: "Ленинский р-н",
    specs: { guests: "5 гостей", beds: "3 кровати", area: "62м2" },
  },
];

export default async function Home(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // Перехватываем роль из параметров (после перехода по магической ссылке)
  if (props.searchParams) {
    const searchParams = await props.searchParams;
    const role = searchParams?.role;
    
    if (typeof role === "string" && (role === "landlord" || role === "tenant")) {
      const session = await auth();
      if (session?.user?.id) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { role: role }
        });
        // Очищаем URL от технического параметра, чтобы не мозолил глаза
        redirect("/");
      }
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[1140px] mx-auto pt-6 pb-20 px-4 xl:px-0">
        <SearchBar />
        
        <div className="mt-8">
          <TitleBar />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 flex-1">
          {/* Sidebar Area */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <HomeSidebarFilters />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full min-w-0 flex flex-col gap-1">
            <SpecialPicks />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-1">
              {PROPERTIES.map((property, i) => (
                <PropertyCard key={i} {...property} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
