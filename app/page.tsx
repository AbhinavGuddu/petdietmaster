// Add these type declarations at the top of the file
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDog, FaCat } from 'react-icons/fa';
import { GiGoat, GiBull, GiHorseHead, GiCow, GiDove, GiPig, GiTurtle, GiChicken, GiFishbone } from 'react-icons/gi';
import { HiSpeakerWave } from 'react-icons/hi2';
import { HiRocketLaunch } from 'react-icons/hi2';
import Image from 'next/image';
import { analyzeFoodSafety } from './lib/gemini';
import { FaKiwiBird } from 'react-icons/fa6';
import PetFootprints from './components/BackgroundAnimation';
import QuickGuide from './components/QuickGuide';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import PetNutritionGuide from './components/PetNutritionGuide';
import { useState, useEffect } from 'react';

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
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = React.useState<any>(null);
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const [feedbacks, setFeedbacks] = React.useState<Array<{ id: string; text: string; name: string; email: string; timestamp: string }>>([]);
  const [showFeedbackList, setShowFeedbackList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNutritionGuide, setShowNutritionGuide] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Load feedbacks from server on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/feedback');
      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      setError('Failed to load feedback');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedback: { text: string; name: string; email: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      const data = await response.json();
      setFeedbacks(prev => [data.feedback, ...prev]);
      setShowFeedbackForm(false);
    } catch (error) {
      setError('Failed to submit feedback');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
              Protein ${result.nutrition?.protein || 0} grams, 
              Carbohydrates ${result.nutrition?.carbs || 0} grams, 
              Fats ${result.nutrition?.fats || 0} grams, 
              Fiber ${result.nutrition?.fiber || 0} grams,
              Sugar ${result.nutrition?.sugar || 0} grams,
              Sodium ${result.nutrition?.sodium || 0} milligrams,
              Calories ${result.nutrition?.calories || 0} kilocalories.
              ${result.alternatives ? 'Safe alternatives include: ' + result.alternatives.join(', ') : ''}
              Thank you for using, Pet Diet Master. Keep exploring food options for your ${selectedPetName}.`;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set Indian English accent
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;  // Slightly slower for better clarity
    utterance.pitch = 1.2; // Slightly higher pitch for female voice
    
    // Wait for voices to be loaded
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find an Indian female voice
      const indianFemaleVoice = voices.find(voice => 
        voice.lang.includes('en-IN') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('lady'))
      );
      
      // Fallback to any female voice if Indian female voice is not found
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('lady')
      );
      
      if (indianFemaleVoice) {
        utterance.voice = indianFemaleVoice;
      } else if (femaleVoice) {
        utterance.voice = femaleVoice;
        // If using non-Indian voice, still try to maintain Indian accent
        utterance.lang = 'en-IN';
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    };

    // If voices are already loaded, set voice immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
  };

  const handleCameraCapture = async () => {
    setShowCamera(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access. Please try using a modern browser like Chrome, Firefox, or Safari.');
      }

      // First try to get the camera with ideal settings
      try {
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
        // If ideal settings fail, try with basic settings
        console.warn('Failed to get camera with ideal settings, trying basic settings:', error);
        const basicStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        streamRef.current = basicStream;
        if (videoRef.current) {
          videoRef.current.srcObject = basicStream;
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(error instanceof Error ? error.message : 'Failed to access camera. Please check your camera permissions and try again.');
      setShowCamera(false);
    }
  };

  const handleFlipCamera = async () => {
    try {
      // Stop current stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Toggle facing mode
      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');

      // Try to get new stream with updated facing mode
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode === 'user' ? 'environment' : 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        // If ideal settings fail, try with basic settings
        console.warn('Failed to flip camera with ideal settings, trying basic settings:', error);
        const basicStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode === 'user' ? 'environment' : 'user'
          }
        });
        streamRef.current = basicStream;
        if (videoRef.current) {
          videoRef.current.srcObject = basicStream;
        }
      }
    } catch (error) {
      console.error('Error flipping camera:', error);
      alert('Failed to switch camera. Your device might have only one camera or doesn\'t support camera switching.');
    }
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) {
      console.error('Video element not found');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      // Use the actual video dimensions
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw the current frame from the video
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Convert to JPEG with quality 0.8 to reduce file size while maintaining quality
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Failed to capture photo. Please try again.');
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      setImage(capturedImage);
      setCapturedImage(null);
      setShowCamera(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    handleCameraCapture();
  };

  const handleCloseCamera = () => {
    // Ensure we stop all tracks when closing the camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setShowCamera(false);
    setCapturedImage(null);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleGeminiResponse = async (response: string) => {
    // Extract the food name from the response
    const foodMatch = response.match(/Food: (.*?)(?:\n|$)/);
    const foodName = foodMatch ? foodMatch[1].trim() : 'Unknown Food';

    // Extract safety status
    const isSafeMatch = response.match(/Safe for (.*?): (Yes|No)/i);
    const isSafe = isSafeMatch ? isSafeMatch[2].toLowerCase() === 'yes' : false;

    // Extract breed-specific information
    const breedInfoMatch = response.match(/Breed Safety:\s*([\s\S]*?)(?:\n\n|$)/);
    const breedInfo = breedInfoMatch ? breedInfoMatch[1].trim() : '';

    // Extract age range information
    const ageRangeMatch = response.match(/Safe Age Range:\s*([\s\S]*?)(?:\n\n|$)/);
    const ageRange = ageRangeMatch ? ageRangeMatch[1].trim() : '';

    // Extract detailed explanation
    const explanationMatch = response.match(/Explanation:\s*([\s\S]*?)(?:\n\n|$)/);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    // Extract symptoms if unsafe
    const symptomsMatch = response.match(/Symptoms:\s*([\s\S]*?)(?:\n\n|$)/);
    const symptoms = symptomsMatch ? symptomsMatch[1].trim() : '';

    // Extract precautions
    const precautionsMatch = response.match(/Precautions:\s*([\s\S]*?)(?:\n\n|$)/);
    const precautions = precautionsMatch ? precautionsMatch[1].trim() : '';

    // Extract serving suggestions if safe
    const servingMatch = response.match(/Serving Suggestions:\s*([\s\S]*?)(?:\n\n|$)/);
    const servingSuggestions = servingMatch ? servingMatch[1].trim() : '';

    setGeminiResponse({
      food: foodName,
      isSafe,
      breedInfo,
      ageRange,
      explanation,
      symptoms,
      precautions,
      servingSuggestions
    });
  };

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      // Here you would typically send the feedback to your backend
      console.log('Feedback submitted:', feedback);
      setFeedback('');
      setShowFeedback(false);
      // You can add a success message here if needed
    }
  };

  const handlePetSelection = (petId: string) => {
    // Only update selection if a different pet is clicked
    if (petId !== selectedPet) {
      setSelectedPet(petId);
      setResult(null); // Clear previous result when changing pet
    }
  };

  // Cleanup function to stop camera when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

  // Add error handling for video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onerror = (error) => {
        console.error('Video element error:', error);
        alert('Error accessing camera stream. Please check your camera permissions and try again.');
        handleCloseCamera();
      };
    }
  }, [showCamera]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-2 sm:p-4 relative">
      <PetFootprints />
      <div className="max-w-7xl mx-auto pt-4 sm:pt-8 relative z-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-center">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg relative">
              <span className="text-white relative z-10">Pet Diet Master</span>
              <div className="absolute inset-0 rounded-lg border-2 animate-gradient-x" 
                style={{ borderImage: 'linear-gradient(90deg, #0ea5e9, #8b5cf6, #0ea5e9) 1' }}></div>
            </div>
          </h1>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-slate-700">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 sm:p-8 text-center mb-6">
            {image ? (
              <div className="relative">
                <Image
                  src={image}
                  alt="Uploaded food"
                  width={300}
                  height={200}
                  className="mx-auto rounded-lg w-full max-w-[300px] h-auto"
                />
                <button
                  onClick={() => setImage(null)}
                  className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg transition-all duration-300 text-sm text-sky-100 hover:text-white border border-sky-500 hover:border-sky-400"
                >
                  Upload Different Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-200 text-lg font-medium mb-4">Upload a photo of the food</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-sky-700 rounded-lg cursor-pointer hover:bg-sky-600 transition-all text-base font-medium w-full sm:w-auto border-2 border-sky-500 hover:border-sky-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Image
                  </label>
                  <button
                    onClick={handleCameraCapture}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 rounded-lg cursor-pointer hover:bg-violet-500 transition-all text-base font-medium w-full sm:w-auto border-2 border-violet-500 hover:border-violet-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pet Selection - Horizontal Scroll */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-200">Select Your Pet</h2>
              {selectedPet && (
                <button
                  onClick={() => setShowNutritionGuide(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0e523a] hover:bg-[#0e523a]/80 border border-[#0e523a]/50 hover:border-[#0e523a] rounded-lg text-slate-300 hover:text-white transition-all duration-300 text-sm group backdrop-blur-sm"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                  <span className="group-hover:translate-x-1 transition-transform duration-300 font-medium">
                    Nutrition Guide
                  </span>
                </button>
              )}
            </div>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
                <div className="flex space-x-3 sm:space-x-4 px-4 sm:px-0 pb-4" style={{ paddingRight: 'calc(1rem + 40px)' }}>
                  {petTypes.map((pet) => {
                    const Icon = pet.icon;
                    return (
                      <button
                        key={pet.id}
                        onClick={() => handlePetSelection(pet.id)}
                        className={`p-3 sm:p-4 rounded-lg transition-all flex flex-col items-center min-w-[90px] sm:min-w-[100px] snap-center relative border-2 ${
                          selectedPet === pet.id
                            ? 'border-sky-500 bg-sky-500'
                            : 'border-slate-500/50 bg-slate-800/50 hover:border-sky-500 hover:bg-sky-500/30'
                        }`}
                      >
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 ${selectedPet === pet.id ? 'text-sky-400' : 'text-slate-300'}`} />
                        <span className={`text-xs sm:text-sm whitespace-nowrap ${selectedPet === pet.id ? 'text-sky-400' : 'text-slate-300'}`}>{pet.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 pointer-events-none" />
            </div>
          </div>

          {/* Check Button */}
          <div className="flex justify-center w-full">
            <button
              onClick={handleCheck}
              disabled={!image || !selectedPet || isLoading}
              className={`w-full max-w-[400px] px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-base relative overflow-hidden group ${
                !image || !selectedPet || isLoading
                  ? 'bg-[#00FF9D] cursor-not-allowed text-slate-900 border-2 border-[#00FF9D]/50'
                  : 'bg-[#2A9D8F] hover:bg-[#2A9D8F]/90 text-white border border-[#2A9D8F]/60 hover:border-[#2A9D8F] backdrop-blur-sm shadow-lg hover:shadow-[#2A9D8F]/30'
              }`}
            >
              {isAnalyzing ? (
                analyzingText
              ) : (
                <>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="group-hover:scale-110 transition-transform duration-300">Check Food Safety</span>
                    <svg 
                      className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-slate-700/50 rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    {result.foodName}
                    <span className={`${
                      result.safetyLevel === 'Safe' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      • {result.safetyLevel}
                    </span>
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakResult}
                      className={`ml-2 p-2 rounded-full transition-colors ${
                        isSpeaking ? 'bg-red-500/20 hover:bg-red-500/30' : 'hover:bg-slate-600/50'
                      }`}
                      title={isSpeaking ? "Stop Reading" : "Read Results"}
                    >
                      <HiSpeakerWave className={`w-5 h-5 ${isSpeaking ? 'text-red-500' : ''}`} />
                    </button>
                  </h3>
                </div>

                <p className="text-slate-300 text-sm">{result.explanation}</p>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-200 bg-sky-500/10 p-3 rounded-lg">
                    Nutritional Information
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Protein', value: result.nutrition?.protein || 0, unit: 'g', color: 'from-blue-600 to-blue-400' },
                      { name: 'Carbohydrates', value: result.nutrition?.carbs || 0, unit: 'g', color: 'from-green-600 to-green-400' },
                      { name: 'Fats', value: result.nutrition?.fats || 0, unit: 'g', color: 'from-yellow-600 to-yellow-400' },
                      { name: 'Fiber', value: result.nutrition?.fiber || 0, unit: 'g', color: 'from-orange-600 to-orange-400' },
                      { name: 'Sugar', value: result.nutrition?.sugar || 0, unit: 'g', color: 'from-red-600 to-red-400' },
                      { name: 'Sodium', value: result.nutrition?.sodium || 0, unit: 'mg', color: 'from-violet-600 to-violet-400' },
                      { name: 'Calories', value: result.nutrition?.calories || 0, unit: 'kcal', color: 'from-pink-600 to-pink-400', isCalories: true },
                    ].map((nutrient) => (
                      <div key={nutrient.name} className="relative pt-1">
                        <div className="flex justify-between text-sm text-slate-300 mb-1">
                          <span>{nutrient.name}</span>
                          <span>{nutrient.value.toFixed(1)}{nutrient.unit}</span>
                        </div>
                        {!nutrient.isCalories && (
                          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-700/50">
                            <div 
                              className={`bg-gradient-to-r ${nutrient.color} shadow-lg transition-all duration-500`}
                              style={{ 
                                width: `${Math.min(100, Math.max(0, (nutrient.value / (nutrient.name === 'Sodium' ? 2400 : 100)) * 100))}%`,
                                transition: 'width 0.5s ease-in-out'
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {result.alternatives && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-200 mb-2">Safe Alternatives:</h4>
                      <ul className="space-y-2">
                        {result.alternatives?.map((alt: string, index: number) => (
                          <li key={index} className="text-sm text-slate-300">
                            • {alt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add QuickGuide after the main analysis section */}
          {selectedPet && (
            <QuickGuide selectedPet={selectedPet} />
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-slate-400 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div>© 2024 Pet Diet Master</div>
            <div className="flex justify-center gap-4">
              <a
                href="mailto:abhinavguddumtech@gmail.com?subject=Contact from Pet Diet Master"
                className="px-2 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-white transition-all flex items-center gap-1 group text-xs"
              >
                <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-slate-400">Created with <span className="text-red-500">♥</span> by</div>
            <div className="inline-flex items-center px-4 py-2 rounded-lg relative">
              <span className="text-white text-sm relative z-10">Abhinav Guddu</span>
              <div className="absolute inset-0 rounded-lg border-[1px] animate-gradient-x" style={{ borderImage: 'linear-gradient(90deg, #0ea5e9, #8b5cf6, #0ea5e9) 1' }}></div>
            </div>
          </div>
        </footer>

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="fixed bottom-4 right-4 bg-slate-800/20 hover:bg-sky-600 text-slate-300 hover:text-white p-1.5 rounded-full shadow-lg transition-all duration-300 z-50 group border border-slate-600 hover:border-sky-500 backdrop-blur-sm"
          title="Share Your Feedback"
        >
          <div className="relative">
            {/* Tooltip */}
            <div className="absolute -top-12 right-0 bg-slate-800 text-white px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-xs">
              Share Your Feedback
              <div className="absolute bottom-0 right-4 w-2 h-2 bg-slate-800 transform rotate-45 translate-y-1/2"></div>
            </div>

            {/* Button Content */}
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span className="text-[10px] font-medium group-hover:translate-x-1 transition-transform duration-300">
                Feedback
              </span>
            </div>
          </div>
        </button>

        {/* Feedback List Modal */}
        <AnimatePresence>
          {showFeedbackList && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-800 p-6 rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Feedback</h2>
                  <button
                    onClick={() => setShowFeedbackList(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FeedbackList feedbacks={feedbacks} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Feedback Form Modal */}
        <FeedbackForm
          isOpen={showFeedbackForm}
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={handleFeedbackSubmit}
          onViewFeedback={() => {
            setShowFeedbackForm(false);
            setShowFeedbackList(true);
          }}
        />

        {/* Nutrition Guide Modal */}
        <AnimatePresence>
          {showNutritionGuide && (
            <PetNutritionGuide
              petType={selectedPet}
              isOpen={showNutritionGuide}
              onClose={() => setShowNutritionGuide(false)}
            />
          )}
        </AnimatePresence>

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-800 rounded-lg w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Share Your Feedback</h2>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your feedback helps us improve..."
                className="w-full h-32 p-3 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-white transition-all text-xs"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Fullscreen Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-[100]">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            )}

            {/* Floating Camera Controls */}
            <div className="absolute inset-x-0 bottom-20 flex justify-center items-center gap-8">
              {capturedImage ? (
                <>
                  <button
                    onClick={handleRetakePhoto}
                    className="px-6 py-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={handleConfirmPhoto}
                    className="px-6 py-3 rounded-full bg-sky-500/50 backdrop-blur-sm text-white hover:bg-sky-500/60 transition-all"
                  >
                    Use Photo
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFlipCamera}
                    className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
                    title="Flip Camera"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4 4l4-4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleTakePhoto}
                    className="p-4 rounded-full transition-all transform hover:scale-105"
                    title="Take Photo"
                  >
                    <div className="w-16 h-16 rounded-full border-4 border-white" />
                  </button>
                  <button
                    onClick={handleCloseCamera}
                    className="p-3 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/60 transition-all"
                    title="Close Camera"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 