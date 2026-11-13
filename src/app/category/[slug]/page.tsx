import { ItemGrid } from "@/components/marketplace/item-grid";

// Explicitly tell Next.js 16 to allow runtime blocking for this dynamic route
export const instant = false;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;
  
  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <main className="flex-1 h-full overflow-y-auto px-4 pb-4 pt-0 md:px-6 md:pb-6 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <ItemGrid title={formattedTitle} category={slug} />
      </div>
    </main>
  );
}