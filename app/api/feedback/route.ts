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

export async function POST(request: Request) {
  try {
    const feedback = await request.json();
    
    // Add timestamp and ID
    const feedbackWithMetadata = {
      ...feedback,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    // Read existing feedback
    const existingFeedback = JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8'));
    
    // Add new feedback
    const updatedFeedback = [feedbackWithMetadata, ...existingFeedback];
    
    // Save to file
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