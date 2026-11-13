import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const categories = [
  "Vehicles", "Property Rentals", "Apparel", "Classifieds",
  "Electronics", "Entertainment", "Family", "Free Stuff",
  "Garden & Outdoor", "Hobbies", "Home Goods", "Home Improvement",
  "Home Sales", "Musical Instruments", "Office Supplies",
  "Pet Supplies", "Sporting Goods", "Toys & Games", "Buy and sell groups"
];

export function Sidebar() {
  return (
    <aside className="w-[300px] hidden md:flex flex-col shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto border-r bg-white p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      <div className="mb-6 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Marketplace</h2>
        
        <Link href="/create/item">
          <Button className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-black font-semibold flex items-center justify-center gap-2 h-10">
            <Plus className="w-5 h-5" />
            Create new listing
          </Button>
        </Link>
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-2 px-2">Categories</h3>
        <nav className="flex flex-col space-y-0.5">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
      
    </aside>
  );
}