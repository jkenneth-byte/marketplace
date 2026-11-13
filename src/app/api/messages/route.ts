import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { error } = await supabase
      .from('messages')
      .insert([{
        listing_id: body.listing_id,
        buyer_email: body.buyer_email,
        seller_email: body.seller_email,
        message: body.message
      }]);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Messaging Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}