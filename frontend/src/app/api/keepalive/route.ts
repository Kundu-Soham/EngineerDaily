import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace this string with your actual Render backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-render-app.onrender.com';
    
    // We hit the /categories endpoint because it is lightweight and fast
    const response = await fetch(`${backendUrl}/categories`);

    if (response.ok) {
      return NextResponse.json({ status: 'Success', message: 'Backend is awake!' }, { status: 200 });
    } else {
      return NextResponse.json({ status: 'Error', message: 'Backend responded with an error.' }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ status: 'Error', message: 'Failed to reach backend.' }, { status: 500 });
  }
}