"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  image_url: string | null;
}

export function ItemGrid({ title, category }: { title: string; category?: string }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (searchQuery) params.append("search", searchQuery);
        
        const url = params.toString() ? `/api/listings?${params.toString()}` : "/api/listings";

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load marketplace items");
        
        const data = await res.json();
        setListings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [category, searchQuery]); 

  return (
    <div className="w-full relative">
      
      {/* Sticky Header & Search Bar Area */}
      <div className="sticky top-0 z-50 bg-white pb-4 pt-4 md:pt-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 -mx-4 px-4 md:-mx-6 md:px-6">
        <h2 className="text-xl font-bold">{title}</h2>
        
        <div className="relative w-full sm:w-[320px] flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-gray-500 z-10" />
          <Input
            type="text"
            placeholder="Search Marketplace"
            className="w-full pl-10 bg-[#F0F2F5] border border-gray-300 hover:bg-gray-200 focus:bg-white focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] h-10 rounded-full transition-all text-gray-900 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Grid States */}
      {isLoading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#1877F2]" />
          <p>Loading items...</p>
        </div>
      ) : error ? (
        <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          <p className="font-bold">Error loading listings</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500 bg-white rounded-xl border border-dashed">
          <p className="font-medium text-lg">No items found</p>
          <p className="text-sm mt-1">{searchQuery ? "Try a different search term" : "Be the first to create one!"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-6">
          {listings.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id} className="group">
              <Card className="border-0 shadow-none bg-transparent group-hover:bg-gray-100 transition-colors rounded-xl overflow-hidden cursor-pointer h-full">
                <CardContent className="p-2 flex flex-col gap-1 h-full">
                  
                  <div className="w-full aspect-square bg-[#E8F0FE] rounded-xl border border-[#1877F2]/20 mb-2 overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#1877F2]/40" />
                    )}
                  </div>
                  
                  <span className="font-bold text-lg leading-tight">
                    ${item.price.toLocaleString()}
                  </span>
                  <span className="text-sm leading-tight text-gray-900 line-clamp-2">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-500 mt-auto pt-1">
                    {item.location || "Location not specified"}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}