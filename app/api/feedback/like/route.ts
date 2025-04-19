import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), 'data', 'feedback.json');

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

    // Read the current feedback data
    let feedbacks: Feedback[] = [];
    try {
      const fileContent = await fs.readFile(FEEDBACK_FILE, 'utf8');
      feedbacks = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading feedback file:', error);
    }
    
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
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));

    return NextResponse.json({ success: true, likes: feedbacks[feedbackIndex].likes });
  } catch (error) {
    console.error('Error liking feedback:', error);
    return NextResponse.json(
      { error: 'Failed to like feedback' },
      { status: 500 }
    );
  }
} 