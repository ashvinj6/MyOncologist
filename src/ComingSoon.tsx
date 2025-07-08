
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface ComingSoonProps {
  onBack: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          {/* Cat Loading Animation */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              {/* Animated Cat Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full animate-bounce">
                {/* Cat Ears */}
                <div className="absolute -top-3 left-4 w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-orange-400"></div>
                <div className="absolute -top-3 right-4 w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-orange-400"></div>
                
                {/* Cat Eyes */}
                <div className="absolute top-6 left-6 w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <div className="absolute top-6 right-6 w-2 h-2 bg-black rounded-full animate-pulse"></div>
                
                {/* Cat Nose */}
                <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"></div>
                
                {/* Cat Mouth */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-2 border-b-2 border-black rounded-b-full"></div>
                </div>
              </div>
              
              {/* Cat Tail */}
              <div className="absolute -right-4 top-8 w-8 h-2 bg-orange-400 rounded-full transform rotate-45 animate-[swing_1s_ease-in-out_infinite]"></div>
              
              {/* Pulsing Circle */}
              <div className="absolute -inset-4 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Coming Soon Text */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-display">Coming Soon!</h1>
          <p className="text-gray-600 mb-6 leading-relaxed font-sans">
            Our appointment booking system is currently under development. 
            We're working hard to bring you this feature soon.
          </p>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Back Button */}
          <Button 
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 font-display font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Oncologists
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
