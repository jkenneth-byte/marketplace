"use client";

import Link from "next/link";
import { Menu, Mail, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const categories = [
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups",
];

export function Header() {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu (Hidden on Desktop) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="-ml-2 p-2 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center focus:outline-none">
              <Menu className="h-6 w-6 text-gray-700" />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[300px] p-0 flex flex-col h-full bg-white"
            >
              <div className="p-4 border-b">
                <SheetTitle className="text-2xl font-bold">
                  Marketplace
                </SheetTitle>
              </div>
              <div className="p-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Link href="/create/item">
                  <Button className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-black font-semibold mb-6 h-10">
                    Create new listing
                  </Button>
                </Link>
                <h3 className="font-bold text-lg mb-2 px-2">Categories</h3>
                <nav className="flex flex-col space-y-0.5">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/category/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Facebook Style Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl font-serif leading-none mt-1 mr-0.5">
              f
            </span>
          </div>
        </Link>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full w-10 h-10"
        >
          <Mail className="w-5 h-5 text-black" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full w-10 h-10"
        >
          <Bell className="w-5 h-5 text-black" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#E4E6EB] hover:bg-[#D8DADF] rounded-full w-10 h-10"
        >
          <User className="w-5 h-5 text-black" />
        </Button>
      </div>
    </header>
  );
}
