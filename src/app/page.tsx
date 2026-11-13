import { ItemGrid } from "@/components/marketplace/item-grid";

export default function Home() {
  return (
    // Changed padding to remove the top gap (pt-0)
    <main className="flex-1 h-full overflow-y-auto px-4 pb-4 pt-0 md:px-6 md:pb-6 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <ItemGrid title="Today's picks" />
      </div>
    </main>
  );
}