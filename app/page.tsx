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
import QuickGuide from './components/QuickGuide';

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
    setCapturedImage(imageData);
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
    setShowCamera(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
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

  return (
    <main className="min-h-screen bg-black px-2 sm:p-4 relative">
      <PetFootprints />
      <div className="max-w-4xl mx-auto pt-4 sm:pt-8 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg relative">
            <span className="text-white relative z-10">Pet Diet Master</span>
            <div className="absolute inset-0 rounded-lg border-2 animate-gradient-x" 
              style={{ borderImage: 'linear-gradient(90deg, #6366f1, #a855f7, #6366f1) 1' }}></div>
          </div>
        </h1>

        <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-indigo-700">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-indigo-600 rounded-lg p-4 sm:p-8 text-center mb-6">
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
                  className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-all duration-300 text-sm text-emerald-100 hover:text-white border border-emerald-600 hover:border-emerald-500"
                >
                  Upload Different Image
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-indigo-200 text-lg font-medium mb-4">Upload a photo of the food</p>
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
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-600 transition-all text-base font-medium w-full sm:w-auto border-2 border-indigo-500 hover:border-indigo-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Image
                  </label>
                  <button
                    onClick={handleCameraCapture}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 rounded-lg cursor-pointer hover:bg-purple-500 transition-all text-base font-medium w-full sm:w-auto border-2 border-purple-500 hover:border-purple-400"
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
            <h2 className="text-lg sm:text-xl font-semibold text-indigo-200">Select Your Pet</h2>
            <div className="relative">
              <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0">
                <div className="flex space-x-3 sm:space-x-4 px-4 sm:px-0 pb-4" style={{ paddingRight: 'calc(1rem + 40px)' }}>
                  {petTypes.map((pet) => {
                    const Icon = pet.icon;
                    return (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedPet(pet.id)}
                        className={`p-3 sm:p-4 rounded-lg transition-all flex flex-col items-center min-w-[90px] sm:min-w-[100px] snap-center relative border-2 ${
                          selectedPet === pet.id
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-indigo-500 bg-indigo-800 hover:border-purple-500 hover:bg-purple-500'
                        }`}
                      >
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 ${selectedPet === pet.id ? 'text-purple-400' : 'text-indigo-400'}`} />
                        <span className={`text-xs sm:text-sm whitespace-nowrap ${selectedPet === pet.id ? 'text-purple-400' : 'text-indigo-400'}`}>{pet.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-indigo-900 pointer-events-none" />
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={!image || !selectedPet || isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all text-base ${
              !image || !selectedPet || isLoading
                ? 'bg-indigo-800/50 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500'
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

                {/* Add Breed and Age Safety Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-200 bg-purple-500/10 p-3 rounded-lg">
                    Safety Guidelines
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-200 mb-2">Breed Safety:</h5>
                      <p className="text-gray-300 text-sm">
                        {selectedPet === 'dog' ? 
                          'Safe for most breeds. Small breeds (under 20 lbs) should have smaller portions. Large breeds (over 50 lbs) can handle larger amounts. Monitor for any digestive issues.' :
                          selectedPet === 'cat' ?
                          'Safe for all cat breeds. Start with small amounts (1-2 teaspoons) and monitor for 24 hours. Increase gradually if no issues.' :
                          selectedPet === 'chicken' ?
                          'Safe for all chicken breeds. Provide in moderation as part of a balanced diet. Monitor egg production and droppings.' :
                          selectedPet === 'cow' ?
                          'Safe for all cattle breeds. Introduce gradually to prevent digestive upset. Monitor rumination and appetite.' :
                          selectedPet === 'buffalo' ?
                          'Safe for all buffalo breeds. Provide as part of regular feed. Monitor for any changes in behavior or digestion.' :
                          selectedPet === 'pig' ?
                          'Safe for all pig breeds. Adjust portion size based on age and weight. Monitor growth and development.' :
                          selectedPet === 'pigeon' ?
                          'Safe for all pigeon breeds. Provide in small amounts. Ensure access to grit for digestion.' :
                          selectedPet === 'parrot' ?
                          'Safe for all parrot species. Start with small pieces. Monitor droppings and behavior.' :
                          selectedPet === 'turtle' ?
                          'Safe for most turtle species. Cut into appropriate size pieces. Monitor shell health and activity.' :
                          'Safe for this species. Monitor for any changes in behavior or health.'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-200 mb-2">Age Range:</h5>
                      <p className="text-gray-300 text-sm">
                        {selectedPet === 'dog' ? 
                          'Safe for dogs 6 months and older. Puppies under 6 months should avoid this food.' :
                          selectedPet === 'cat' ?
                          'Safe for cats 4 months and older. Kittens should stick to kitten-specific food.' :
                          selectedPet === 'chicken' ?
                          'Safe for chickens 8 weeks and older. Chicks need starter feed until 8 weeks.' :
                          selectedPet === 'cow' ?
                          'Safe for cattle 6 months and older. Calves need milk or milk replacer until weaned.' :
                          selectedPet === 'buffalo' ?
                          'Safe for buffalo 6 months and older. Calves need milk until weaned.' :
                          selectedPet === 'pig' ?
                          'Safe for pigs 8 weeks and older. Piglets need starter feed until 8 weeks.' :
                          selectedPet === 'pigeon' ?
                          'Safe for pigeons 4 weeks and older. Squabs need crop milk until weaned.' :
                          selectedPet === 'parrot' ?
                          'Safe for parrots 3 months and older. Chicks need hand-feeding formula.' :
                          selectedPet === 'turtle' ?
                          'Safe for turtles 6 months and older. Hatchlings need specific hatchling diet.' :
                          'Safe for this species. Monitor for age-appropriate feeding.'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h5 className="font-semibold text-gray-200 mb-2">Serving Guidelines:</h5>
                      <p className="text-gray-300 text-sm">
                        {selectedPet === 'dog' ? 
                          'Small breeds (under 20 lbs): 1-2 tablespoons\nMedium breeds (20-50 lbs): 1/4 cup\nLarge breeds (over 50 lbs): 1/2 cup\nAdjust based on activity level and weight.' :
                          selectedPet === 'cat' ?
                          'Start with 1-2 teaspoons. Can increase to 1-2 tablespoons for adult cats. Adjust based on weight and activity.' :
                          selectedPet === 'chicken' ?
                          'Provide as 10-20% of daily feed. Mix with regular feed. Ensure access to grit and water.' :
                          selectedPet === 'cow' ?
                          'Introduce gradually up to 2-3 kg per day. Mix with regular feed. Ensure access to clean water.' :
                          selectedPet === 'buffalo' ?
                          'Introduce gradually up to 2-3 kg per day. Mix with regular feed. Monitor water intake.' :
                          selectedPet === 'pig' ?
                          'Start with 100g and increase gradually. Mix with regular feed. Adjust based on weight.' :
                          selectedPet === 'pigeon' ?
                          'Provide 1-2 tablespoons per bird. Mix with regular feed. Ensure access to grit.' :
                          selectedPet === 'parrot' ?
                          'Start with small pieces (1-2 teaspoons). Can increase based on size. Monitor consumption.' :
                          selectedPet === 'turtle' ?
                          'Provide pieces no larger than head size. Feed 2-3 times per week. Remove uneaten food.' :
                          'Provide appropriate portion based on size and age. Monitor consumption and adjust as needed.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-200 bg-purple-500/10 p-3 rounded-lg">
                    Nutritional Information
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Protein', value: result.nutrition?.protein || 0, unit: 'g', color: 'from-blue-600 to-blue-400' },
                      { name: 'Carbohydrates', value: result.nutrition?.carbs || 0, unit: 'g', color: 'from-green-600 to-green-400' },
                      { name: 'Fats', value: result.nutrition?.fats || 0, unit: 'g', color: 'from-yellow-600 to-yellow-400' },
                      { name: 'Fiber', value: result.nutrition?.fiber || 0, unit: 'g', color: 'from-orange-600 to-orange-400' },
                      { name: 'Sugar', value: result.nutrition?.sugar || 0, unit: 'g', color: 'from-red-600 to-red-400' },
                      { name: 'Sodium', value: result.nutrition?.sodium || 0, unit: 'mg', color: 'from-purple-600 to-purple-400' },
                      { name: 'Calories', value: result.nutrition?.calories || 0, unit: 'kcal', color: 'from-pink-600 to-pink-400', isCalories: true },
                    ].map((nutrient) => (
                      <div key={nutrient.name} className="relative pt-1">
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>{nutrient.name}</span>
                          <span>{nutrient.value.toFixed(1)}{nutrient.unit}</span>
                        </div>
                        {!nutrient.isCalories && (
                          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-700/50">
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

          {/* Add QuickGuide after the main analysis section */}
          {selectedPet && (
            <QuickGuide selectedPet={selectedPet} />
          )}

          {geminiResponse && (
            <div className="mt-4 p-4 rounded-lg border-2 border-[#312e81] bg-[#1e1b4b]">
              <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">
                Gemini Analysis for {geminiResponse.food}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    geminiResponse.isSafe ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {geminiResponse.isSafe ? 'Safe' : 'Not Safe'}
                  </span>
                </div>

                {geminiResponse.breedInfo && (
                  <div>
                    <h4 className="font-semibold text-[#e2e8f0] text-sm">Breed Safety Information:</h4>
                    <p className="text-[#cbd5e1] text-sm">{geminiResponse.breedInfo}</p>
                  </div>
                )}

                {geminiResponse.ageRange && (
                  <div>
                    <h4 className="font-semibold text-[#e2e8f0] text-sm">Safe Age Range:</h4>
                    <p className="text-[#cbd5e1] text-sm">{geminiResponse.ageRange}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-[#e2e8f0] text-sm">Detailed Analysis:</h4>
                  <p className="text-[#cbd5e1] text-sm">{geminiResponse.explanation}</p>
                </div>

                {!geminiResponse.isSafe && geminiResponse.symptoms && (
                  <div>
                    <h4 className="font-semibold text-[#e2e8f0] text-sm">Potential Symptoms:</h4>
                    <p className="text-[#cbd5e1] text-sm">{geminiResponse.symptoms}</p>
                  </div>
                )}

                {geminiResponse.precautions && (
                  <div>
                    <h4 className="font-semibold text-[#e2e8f0] text-sm">Precautions:</h4>
                    <p className="text-[#cbd5e1] text-sm">{geminiResponse.precautions}</p>
                  </div>
                )}

                {geminiResponse.isSafe && geminiResponse.servingSuggestions && (
                  <div>
                    <h4 className="font-semibold text-[#e2e8f0] text-sm">Serving Suggestions:</h4>
                    <p className="text-[#cbd5e1] text-sm">{geminiResponse.servingSuggestions}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="relative flex-1">
              {capturedImage ? (
                <>
                  <img
                    src={capturedImage}
                    alt="Captured photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6">
                    <button
                      onClick={handleRetakePhoto}
                      className="px-6 py-3 bg-gray-800/80 rounded-lg text-white hover:bg-gray-700/80 transition-all"
                    >
                      Retake Photo
                    </button>
                    <button
                      onClick={handleConfirmPhoto}
                      className="px-6 py-3 bg-blue-600/90 rounded-lg text-white hover:bg-blue-500/90 transition-all"
                    >
                      Use Photo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6">
                    <button
                      onClick={handleFlipCamera}
                      className="p-3 bg-gray-800/80 rounded-full text-white hover:bg-gray-700/80 transition-all"
                      title="Flip Camera"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                    <button
                      onClick={handleTakePhoto}
                      className="p-4 bg-white rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
                      title="Take Photo"
                    >
                      <div className="w-16 h-16 rounded-full border-8 border-gray-800" />
                    </button>
                    <button
                      onClick={handleCloseCamera}
                      className="p-3 bg-gray-800/80 rounded-full text-white hover:bg-gray-700/80 transition-all"
                      title="Close Camera"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
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