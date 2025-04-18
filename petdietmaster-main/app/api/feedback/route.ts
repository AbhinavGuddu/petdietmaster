import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to store feedback data
const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(feedbackFilePath))) {
  fs.mkdirSync(path.dirname(feedbackFilePath), { recursive: true });
}

// Initialize feedback file if it doesn't exist
if (!fs.existsSync(feedbackFilePath)) {
  fs.writeFileSync(feedbackFilePath, JSON.stringify([]));
}

// Simple admin check - in production, you should use proper authentication
const isAdmin = (request: Request) => {
  // For development, you can use a simple check
  // In production, implement proper authentication
  const authHeader = request.headers.get('authorization');
  return authHeader === process.env.ADMIN_TOKEN;
};

export async function POST(request: Request) {
  try {
    const { action, feedbackId, reply, ...feedback } = await request.json();
    
    // Read existing feedback
    const existingFeedback = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8'));
    
    if (action === 'reply' && feedbackId) {
      // Check if user is admin before allowing reply
      if (!isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Update feedback with reply
      const updatedFeedback = existingFeedback.map((item: any) => {
        if (item.id === feedbackId) {
          return { ...item, reply };
        }
        return item;
      });
      fs.writeFileSync(feedbackFilePath, JSON.stringify(updatedFeedback, null, 2));
      return NextResponse.json({ success: true });
    }
    
    if (action === 'like' && feedbackId) {
      // Update feedback with like
      const updatedFeedback = existingFeedback.map((item: any) => {
        if (item.id === feedbackId) {
          return { ...item, likes: (item.likes || 0) + 1 };
        }
        return item;
      });
      fs.writeFileSync(feedbackFilePath, JSON.stringify(updatedFeedback, null, 2));
      return NextResponse.json({ success: true });
    }
    
    // Add new feedback
    const feedbackWithMetadata = {
      ...feedback,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    const updatedFeedback = [feedbackWithMetadata, ...existingFeedback];
    fs.writeFileSync(feedbackFilePath, JSON.stringify(updatedFeedback, null, 2));

    return NextResponse.json({ success: true, feedback: feedbackWithMetadata });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedback = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8'));
    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error reading feedback:', error);
    return NextResponse.json({ error: 'Failed to read feedback' }, { status: 500 });
  }
} 