import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false });
    
    if (category) {
      // 1. Convert "property-rentals" to "property rentals"
      const formattedCategory = category.replace(/-/g, ' ');
      // 2. Use .ilike() for a case-insensitive match against the database
      query = query.ilike('category', formattedCategory);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`); 
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("API GET Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('listings')
      .insert([{
        title: body.title,
        price: body.price,
        seller_email: body.seller_email,
        description: body.description,
        category: body.category,
        location: body.location,
        image_url: body.image_url
      }])
      .select()
      .single();

    if (error) {
      console.error("Database Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("API POST Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}