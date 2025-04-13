// Add these type declarations at the top of the file
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

'use client';

import * as React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { FaDog, FaCat } from 'react-icons/fa';
import { GiGoat, GiBull, GiHorseHead, GiCow, GiDove, GiPig, GiTurtle, GiChicken, GiFishbone } from 'react-icons/gi';
import { HiSpeakerWave } from 'react-icons/hi2';
import { HiRocketLaunch } from 'react-icons/hi2';
import Image from 'next/image';
import { analyzeFoodSafety } from './lib/gemini';
import { FaKiwiBird } from 'react-icons/fa6';
import PetFootprints from './components/BackgroundAnimation';

const petTypes = [
  { id: 'dog', name: 'Dog', icon: FaDog },
  { id: 'cat', name: 'Cat', icon: FaCat },
  { id: 'goat', name: 'Goat', icon: GiGoat },
  { id: 'horse', name: 'Horse', icon: GiHorseHead },
  { id: 'chicken', name: 'Chicken', icon: GiChicken },
  { id: 'cow', name: 'Cow', icon: GiCow },
  { id: 'buffalo', name: 'Buffalo', icon: GiBull },
  { id: 'pig', name: 'Pig', icon: GiPig },
  { id: 'pigeon', name: 'Pigeon', icon: GiDove },
  { id: 'parrot', name: 'Parrot', icon: FaKiwiBird },
  { id: 'turtle', name: 'Turtle', icon: GiTurtle },
  { id: 'fish', name: 'Fish', icon: GiFishbone },
];

export default function Home() {
  const [selectedPet, setSelectedPet] = React.useState<string>('');
  const [image, setImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analyzingText, setAnalyzingText] = React.useState('');
  const [showCamera, setShowCamera] = React.useState(false);
  const [facingMode, setFacingMode] = React.useState<'user' | 'environment'>('environment');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheck = async () => {
    if (!image || !selectedPet) return;
    setIsLoading(true);
    setIsAnalyzing(true);
    setAnalyzingText('Analyzing food...');
    
    try {
      const analysis = await analyzeFoodSafety(image, selectedPet);
      setResult(analysis);
    } catch (error) {
      console.error('Error checking food:', error);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
      setAnalyzingText('');
    }
  };

  const speakResult = () => {
    if (!result || !window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const selectedPetName = petTypes.find(pet => pet.id === selectedPet)?.name || 'pet';
    
    let text;
    if (result.foodName.toLowerCase().includes('unknown food') || result.foodName.toLowerCase().includes('error')) {
      text = "No food item detected. Please upload a proper food image. If you are facing issues, Please Reach out to Abhinav Gooddoo's Team. Thank you for using Pet Diet Master.";
    } else {
      text = `This food is ${result.foodName}. It is ${result.safetyLevel.toLowerCase()} for your ${selectedPetName}. ${result.explanation}. 
              The food contains the following nutrients: 
              Protein ${result.nutrition?.protein || 0}%, 
              Carbohydrates ${result.nutrition?.carbs || 0}%, 
              Fats ${result.nutrition?.fats || 0}%, 
              Fiber ${result.nutrition?.fiber || 0}%.
              ${result.alternatives ? 'Safe alternatives include: ' + result.alternatives.join(', ') : ''}
              Thank you for using, Pet Diet Master. Keep exploring food options for your ${selectedPetName}.`;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    // Get available voices and try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('lady')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleCameraCapture = async () => {
    setShowCamera(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    handleCameraCapture();
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setImage(imageData);
    setShowCamera(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <main className="min-h-screen bg-black p-4 relative">
      <PetFootprints />
      <div className="max-w-4xl mx-auto pt-8 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg relative">
            <span className="text-white relative z-10">Pet Diet Master</span>
            <div className="absolute inset-0 rounded-lg border-2 animate-gradient-x" style={{ borderImage: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6) 1' }}></div>
          </div>
        </h1>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-6">
            {image ? (
              <div className="relative">
                <Image
                  src={image}
                  alt="Uploaded food"
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg"
                />
                <button
                  onClick={() => setImage(null)}
                  className="mt-4 text-sm text-gray-400 hover:text-gray-300"
                >
                  Upload Different Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400">Upload a photo of the food</p>
                <div className="flex justify-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-6 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    Choose File
                  </label>
                  <button
                    onClick={handleCameraCapture}
                    className="px-6 py-2 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    Take Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pet Selection - Improved Horizontal Scroll */}
          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Select Your Pet</h2>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="flex space-x-4 pb-4" style={{ paddingRight: '40px' }}>
                  {petTypes.map((pet) => {
                    const Icon = pet.icon;
                    return (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedPet(pet.id)}
                        className={`p-4 rounded-lg transition-all flex flex-col items-center min-w-[100px] snap-center relative border-2 ${
                          selectedPet === pet.id
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-purple-500 bg-gray-800/80 hover:border-blue-500 hover:bg-blue-500/10'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${selectedPet === pet.id ? 'text-blue-400' : 'text-gray-400'}`} />
                        <span className={`text-sm whitespace-nowrap ${selectedPet === pet.id ? 'text-blue-400' : 'text-gray-400'}`}>{pet.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={!image || !selectedPet || isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              !image || !selectedPet || isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {isAnalyzing ? analyzingText : 'Check Food Safety'}
          </button>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-gray-700/50 rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {result.foodName}
                    <span className={`${
                      result.safetyLevel === 'Safe' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      • {result.safetyLevel}
                    </span>
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakResult}
                      className={`ml-2 p-2 rounded-full transition-colors ${
                        isSpeaking ? 'bg-red-500/20 hover:bg-red-500/30' : 'hover:bg-gray-600/50'
                      }`}
                      title={isSpeaking ? "Stop Reading" : "Read Results"}
                    >
                      <HiSpeakerWave className={`w-5 h-5 ${isSpeaking ? 'text-red-500' : ''}`} />
                    </button>
                  </h3>
                </div>

                <p className="text-gray-300 text-sm">{result.explanation}</p>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-200 bg-purple-500/10 p-3 rounded-lg">
                    Nutritional Information
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Protein', value: result.nutrition?.protein || 0 },
                      { name: 'Carbohydrates', value: result.nutrition?.carbs || 0 },
                      { name: 'Fats', value: result.nutrition?.fats || 0 },
                      { name: 'Fiber', value: result.nutrition?.fiber || 0 },
                      { name: 'Calories', value: result.nutrition?.calories || 0 },
                    ].map((nutrient) => (
                      <div key={nutrient.name} className="relative pt-1">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>{nutrient.name}</span>
                          <span>{nutrient.value.toFixed(1)}%</span>
                        </div>
                        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-700/50">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-purple-400 shadow-lg shadow-purple-500/20 transition-all duration-500"
                            style={{ 
                              width: `${Math.min(100, Math.max(0, nutrient.value))}%`,
                              transition: 'width 0.5s ease-in-out'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.alternatives && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-200 mb-2">Safe Alternatives:</h4>
                      <ul className="space-y-2">
                        {result.alternatives?.map((alt: string, index: number) => (
                          <li key={index} className="text-sm text-gray-300">
                            • {alt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="relative flex-1">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
                <button
                  onClick={handleFlipCamera}
                  className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
                <button
                  onClick={handleTakePhoto}
                  className="p-4 bg-white rounded-full"
                >
                  <div className="w-12 h-12 rounded-full border-4 border-gray-800" />
                </button>
                <button
                  onClick={handleCloseCamera}
                  className="p-3 bg-gray-800 rounded-full text-white hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center mt-8 text-sm text-gray-400 space-y-4">
          <div>© 2024 Pet Diet Master</div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-gray-400">Created with <span className="text-red-500">♥</span> by</div>
            <div className="inline-flex items-center px-4 py-2 rounded-lg relative">
              <span className="text-white text-sm relative z-10">Abhinav Guddu</span>
              <div className="absolute inset-0 rounded-lg border-[1px] animate-gradient-x" style={{ borderImage: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6) 1' }}></div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
} 