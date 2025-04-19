import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

interface Feedback {
  id: string;
  likes: number;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const { feedbackId } = await request.json();

    if (!feedbackId) {
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    // Get all feedback
    const feedbacks = (await kv.get('feedbacks') || []) as Feedback[];
    
    // Find the feedback to like
    const feedbackIndex = feedbacks.findIndex((f: any) => f.id === feedbackId);
    
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    // Increment likes
    if (!feedbacks[feedbackIndex].likes) {
      feedbacks[feedbackIndex].likes = 0;
    }
    feedbacks[feedbackIndex].likes += 1;

    // Save updated feedbacks
    await kv.set('feedbacks', feedbacks);

    return NextResponse.json({ success: true, likes: feedbacks[feedbackIndex].likes });
  } catch (error) {
    console.error('Error liking feedback:', error);
    return NextResponse.json(
      { error: 'Failed to like feedback' },
      { status: 500 }
    );
  }
} 