import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const COUNTER_FILE = path.join(process.cwd(), 'data', 'device-counter.json');

interface CounterData {
  totalDevices: number;
  lastUpdated: string;
}

// Initialize counter file if it doesn't exist
async function initializeCounterFile() {
  try {
    await fs.access(COUNTER_FILE);
  } catch {
    const initialData: CounterData = {
      totalDevices: 0,
      lastUpdated: new Date().toISOString()
    };
    await fs.mkdir(path.dirname(COUNTER_FILE), { recursive: true });
    await fs.writeFile(COUNTER_FILE, JSON.stringify(initialData, null, 2));
  }
}

export async function POST() {
  await initializeCounterFile();
  
  try {
    const data = await fs.readFile(COUNTER_FILE, 'utf8');
    const counterData: CounterData = JSON.parse(data);
    
    counterData.totalDevices += 1;
    counterData.lastUpdated = new Date().toISOString();
    
    await fs.writeFile(COUNTER_FILE, JSON.stringify(counterData, null, 2));
    
    return NextResponse.json(counterData);
  } catch (error) {
    console.error('Error updating device counter:', error);
    return NextResponse.json(
      { error: 'Failed to update device counter' },
      { status: 500 }
    );
  }
}

export async function GET() {
  await initializeCounterFile();
  
  try {
    const data = await fs.readFile(COUNTER_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading device counter:', error);
    return NextResponse.json(
      { error: 'Failed to read device counter' },
      { status: 500 }
    );
  }
} 