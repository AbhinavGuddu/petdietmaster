import axios from 'axios';

// Supported languages with their codes
export const supportedLanguages = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'hi': 'Hindi',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  // Add more languages as needed
};

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    // If target language is English or not specified, return original text
    if (!targetLang || targetLang.startsWith('en')) {
      return text;
    }

    // Extract the base language code (e.g., 'en-US' -> 'en')
    const baseLang = targetLang.split('-')[0].toLowerCase();

    // Check if the language is supported
    if (!Object.keys(supportedLanguages).includes(baseLang)) {
      console.warn(`Language ${baseLang} is not supported. Falling back to English.`);
      return text;
    }

    // Use Google Translate API
    const url = 'https://translation.googleapis.com/language/translate/v2';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      console.warn('Translation API key is not configured. Falling back to original text.');
      return text;
    }

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: baseLang,
        source: 'en'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data?.translations?.[0]?.translatedText) {
      throw new Error('Invalid translation response format');
    }

    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return `${text}\n\n(Translation failed. Showing original text.)`;
  }
}

// Helper function to get a voice for a specific language
export function getVoiceForLanguage(lang: string): SpeechSynthesisVoice | null {
  if (!window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  const baseLang = lang.split('-')[0].toLowerCase();
  
  // Try to find a voice for the exact language code
  let voice = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase());
  
  // If not found, try to find a voice that starts with the base language code
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().startsWith(baseLang));
  }
  
  // If still not found, try to find any voice that includes the base language code
  if (!voice) {
    voice = voices.find(v => v.lang.toLowerCase().includes(baseLang));
  }
  
  // Fallback to the first available voice if none found for the language
  return voice || voices[0] || null;
}

// Language codes mapping for Google Translate API
const languageCodeMapping: { [key: string]: string } = {
  'hi': 'hi', // Hindi
  'bn': 'bn', // Bengali
  'te': 'te', // Telugu
  'ta': 'ta', // Tamil
  'mr': 'mr', // Marathi
  'gu': 'gu', // Gujarati
  'kn': 'kn', // Kannada
  'ml': 'ml', // Malayalam
  'pa': 'pa', // Punjabi
  'ur': 'ur'  // Urdu
};

export const supportedLanguagesArray = [
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', name: 'اردو (Urdu)' }
]; 