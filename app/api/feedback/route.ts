import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), 'data', 'feedback.json');

interface Feedback {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  likes: number;
  reply?: string;
}

// Sample feedback data
const feedbacks: Feedback[] = [
  {
    id: "1",
    name: "Abhinav",
    text: "This app is really helpful for checking what foods are safe for my dog! Love the instant analysis feature.",
    timestamp: "2024-04-19T10:30:00Z",
    likes: 4
  },
  {
    id: "2",
    name: "Roma",
    text: "Would be great if you could add more information about portion sizes for different pets.",
    timestamp: "2024-04-18T15:45:00Z",
    likes: 2
  },
  {
    id: "3",
    name: "Nithiya",
    text: "The camera feature is amazing for quickly checking foods. Makes it so convenient!",
    timestamp: "2024-04-17T09:15:00Z",
    likes: 5
  }
];

export async function GET() {
  try {
    const fileContent = await fs.readFile(FEEDBACK_FILE, 'utf8');
    const feedbacks = JSON.parse(fileContent);
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error reading feedback file:', error);
    return NextResponse.json(
      { error: 'Failed to read feedback data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    let feedbacks: Feedback[] = [];

    // Read existing feedbacks
    try {
      const fileContent = await fs.readFile(FEEDBACK_FILE, 'utf8');
      feedbacks = JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading feedback file:', error);
    }

    switch (data.action) {
      case 'create': {
        const { name, text } = data;
        if (!name || !text) {
          return NextResponse.json(
            { error: 'Name and text are required' },
            { status: 400 }
          );
        }

        const newFeedback: Feedback = {
          id: Date.now().toString(),
          name,
          text,
          timestamp: new Date().toISOString(),
          likes: 0
        };

        feedbacks.unshift(newFeedback);
        break;
      }

      case 'like': {
        const feedbackToLike = feedbacks.find(feedback => feedback.id === data.feedbackId);
        if (feedbackToLike) {
          feedbackToLike.likes += 1;
        }
        break;
      }

      case 'reply': {
        const feedbackToReply = feedbacks.find(feedback => feedback.id === data.feedbackId);
        if (feedbackToReply) {
          feedbackToReply.reply = data.message;
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Write updated feedbacks back to file
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
    return NextResponse.json({ success: true, feedbacks });

  } catch (error) {
    console.error('Error handling feedback action:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback action' },
      { status: 500 }
    );
  }
} 