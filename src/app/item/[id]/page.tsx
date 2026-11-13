"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon, Check } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  seller_email: string;
  description: string;
  image_url: string | null;
  created_at: string;
}

// 1. The inner component that safely uses the client-side useParams hook
function ItemDetailContent() {
  const params = useParams();
  const id = params?.id as string;
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Listing not found.");
          throw new Error("Failed to load listing details.");
        }
        const data = await res.json();
        setListing(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !listing) return;
    
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.id,
          buyer_email: "testuser@example.com", 
          seller_email: listing.seller_email,
          message: message
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      
      setShowModal(true);
      setMessage(""); 
    } catch (error) {
      console.error(error);
      alert("Could not send message.");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1877F2]" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 mt-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error || "Could not find this item."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-sm border mt-4">
        <div className="flex-1">
          <div className="w-full aspect-[4/3] bg-[#E8F0FE] rounded-lg border border-[#1877F2]/20 flex items-center justify-center overflow-hidden">
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-16 h-16 text-[#1877F2]/40" />
            )}
          </div>
        </div>

        <div className="w-full lg:w-[350px] flex flex-col shrink-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1 break-words">{listing.title}</h1>
            <span className="text-2xl font-bold">${listing.price.toLocaleString()}</span>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500">
              Listed in {listing.location || "Palo Alto, CA"}
            </p>
          </div>

          <div className="mb-8 border-y py-4">
            <h2 className="text-sm font-bold mb-1">Seller Information</h2>
            <p className="text-sm text-gray-800">{listing.seller_email}</p>
          </div>

          {listing.description && (
            <div className="mb-8">
              <h2 className="text-sm font-bold mb-1">Description</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-auto pt-4">
            <h2 className="text-sm font-medium">Send seller a message</h2>
            <Textarea 
              placeholder={`Hi, is ${listing.title} still available?`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-gray-50 min-h-[100px] resize-none text-gray-700"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold h-10 mt-2"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Your message has been successfully delivered to the seller. They will contact you via email.
            </p>
            <Button 
              onClick={() => setShowModal(false)} 
              className="w-full bg-gray-100 hover:bg-gray-200 text-black font-semibold h-10"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

// 2. The main page export that wraps the content in a Suspense boundary
export default function ItemDetailPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-[50vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1877F2]" />
        </div>
      }
    >
      <ItemDetailContent />
    </Suspense>
  );
}