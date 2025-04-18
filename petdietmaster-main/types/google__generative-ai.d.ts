declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(params: { model: string }): GenerativeModel;
  }

  export class GenerativeModel {
    generateContent(params: any[]): Promise<{ response: { text: () => string } }>;
  }
} 