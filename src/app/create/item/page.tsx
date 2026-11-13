"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CreateItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "Vehicles", // Added default category state
    location: "",
    email: "",
    description: "",
  });

  // Updated to support HTMLSelectElement for the category dropdown
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.price ||
      !formData.email ||
      !formData.location ||
      !formData.category
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error("Image upload failed: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("listings")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const listingRes = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          price: parseFloat(formData.price),
          seller_email: formData.email,
          description: formData.description,
          category: formData.category, // Now using the dynamic category from the dropdown
          location: formData.location,
          image_url: imageUrl,
        }),
      });

      if (!listingRes.ok) {
        const err = await listingRes.json();
        throw new Error(err.error || "Failed to create listing");
      }

      const newListing = await listingRes.json();
      router.push(`/item/${newListing.id}`);
    } catch (error: any) {
      console.error("Submission error:", error);
      alert(error.message || "An error occurred saving to the database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full p-4 max-w-[1600px] mx-auto">
      {/* LEFT SIDEBAR: Form */}
      <div className="w-full md:w-[400px] bg-white rounded-xl shadow-sm border p-4 flex flex-col gap-4">
        <label className="w-full h-32 shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <ImagePlus className="w-6 h-6 mb-2" />
              <span className="font-medium text-sm">Add photos</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <Input
          name="title"
          placeholder="What are you selling?"
          value={formData.title}
          onChange={handleChange}
          className="bg-gray-50 h-12"
          required
        />

        {/* Added min="0" to prevent negative prices */}
        <Input
          name="price"
          type="number"
          min="0"
          placeholder="Price ($)"
          value={formData.price}
          onChange={handleChange}
          className="bg-gray-50 h-12"
          required
        />

        {/* New Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="flex h-12 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="Vehicles">Vehicles</option>
          <option value="Property Rentals">Property Rentals</option>
          <option value="Apparel">Apparel</option>
          <option value="Classifieds">Classifieds</option>
          <option value="Electronics">Electronics</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Family">Family</option>
          <option value="Free Stuff">Free Stuff</option>
          <option value="Home Goods">Home Goods</option>
          <option value="Sporting Goods">Sporting Goods</option>
          <option value="Toys & Games">Toys & Games</option>
        </select>

        <Input
          name="location"
          placeholder="City, State, or Zip Code"
          value={formData.location}
          onChange={handleChange}
          className="bg-gray-50 h-12"
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="Your contact email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 h-12"
          required
        />
        <Textarea
          name="description"
          placeholder="Provide details about your item (condition, brand, size, etc.)"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-50 min-h-[120px] resize-none"
        />

        <div className="pt-2 pb-4 shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white h-10 text-md font-semibold"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Live Preview */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border p-6 hidden md:block">
        <h2 className="font-bold text-lg mb-4 text-center">Preview</h2>
        <div className="flex gap-6 items-start">
          <div className="flex-1 aspect-square max-w-lg bg-[#E8F0FE] rounded-lg border border-[#1877F2]/20 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlus className="w-16 h-16 text-[#1877F2]/50" />
            )}
          </div>
          <div className="w-[300px] flex flex-col gap-4 mt-2 shrink-0">
            <div>
              <h1 className="text-2xl font-bold break-words">
                {formData.title || "Title"}
              </h1>
              <span className="text-lg font-bold">
                {formData.price ? `$${formData.price}` : "Price"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Listed just now in {formData.location || "your location"}
            </p>
            <div className="border-y py-4">
              <span className="text-sm font-bold block mb-1">
                Seller Information
              </span>
              <span className="text-sm">
                {formData.email || "Seller Email"}
              </span>
            </div>
            {formData.description && (
              <div className="mt-2">
                <span className="text-sm font-bold block mb-1">
                  Description
                </span>
                <p className="text-sm whitespace-pre-wrap text-gray-700">
                  {formData.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
