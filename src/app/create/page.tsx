import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Copy, Car, Home } from "lucide-react";


const listingTypes = [
  { href: "/create/item", icon: Tag, title: "Item for sale", desc: "Lorem ipsum dolor sit" },
  { href: "#", icon: Copy, title: "Create multiple listings", desc: "Lorem ipsum dolor sit" },
  { href: "#", icon: Car, title: "Vehicle for sale", desc: "Lorem ipsum dolor sit" },
  { href: "#", icon: Home, title: "Home for sale or rent", desc: "Lorem ipsum dolor sit" },
];

export default function CreateListingPage() {
  return (
    <div className="flex-1 flex justify-center p-8 bg-white min-h-screen">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6">Choose listing type</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {listingTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Link href={type.href} key={index}>
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer border-0 shadow-sm bg-white h-full">
                  <CardContent className="flex flex-col items-center text-center p-6 gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{type.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}