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
  email?: string;
}

// Initialize feedback file if it doesn't exist
async function initializeFeedbackFile() {
  try {
    await fs.access(FEEDBACK_FILE);
  } catch {
    const initialData: Feedback[] = [];
    await fs.mkdir(path.dirname(FEEDBACK_FILE), { recursive: true });
    await fs.writeFile(FEEDBACK_FILE, JSON.stringify(initialData, null, 2));
  }
}

export async function GET() {
  try {
    await initializeFeedbackFile();
    const fileContent = await fs.readFile(FEEDBACK_FILE, 'utf8');
    const feedbacks = JSON.parse(fileContent);
    
    // Update existing replies to include the prefix
    feedbacks.forEach((feedback: Feedback) => {
      if (feedback.reply && !feedback.reply.startsWith('Admin Abhinav Guddu ')) {
        feedback.reply = `Admin Abhinav Guddu : ${feedback.reply}`;
      }
    });

    // Sort feedbacks by timestamp in descending order (newest first)
    const sortedFeedbacks = feedbacks.sort((a: Feedback, b: Feedback) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return NextResponse.json(sortedFeedbacks);
  } catch (error) {
    console.error('Error reading feedback:', error);
    return NextResponse.json(
      { error: 'Failed to read feedback data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await initializeFeedbackFile();
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
          feedbackToLike.likes = (feedbackToLike.likes || 0) + 1;
        }
        break;
      }

      case 'reply': {
        const feedbackToReply = feedbacks.find(feedback => feedback.id === data.feedbackId);
        if (feedbackToReply) {
          // Remove any existing prefix and add the correct one
          const cleanMessage = data.message.replace(/^Admin Abhinav Guddu\s*:\s*/, '');
          feedbackToReply.reply = `Admin Abhinav Guddu: ${cleanMessage}`;
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