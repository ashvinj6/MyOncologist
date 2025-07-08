import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MicOff, Volume2, VolumeX, Stethoscope, AlertTriangle, CheckCircle, Info, MapPin, Calendar, Star, Phone, Mail, Clock, Users, Award, Shield, Heart, Brain, Pill } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ComingSoon from "@/components/ComingSoon";
import MedicineScanner from "@/components/MedicineScanner";
import DoctorAvatar from '@/components/DoctorAvatar';

interface SymptomAnalysis {
  cancerType: string;
  confidence: number;
  symptoms: string[];
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
}

interface Oncologist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  address: string;
  phone: string;
  email: string;
  availability: string[];
  experience: string;
  languages: string[];
  insurance: string[];
  image: string;
  certifications: string[];
}

const testimonials = [
  {
    name: 'Emily R.',
    role: 'Cancer Survivor',
    text: 'MyOncologist helped me get answers fast and connected me to a top oncologist. The AI analysis gave me peace of mind during a scary time.',
    avatar: '/placeholder.svg',
  },
  {
    name: 'Dr. Michael Lee',
    role: 'Oncologist, MD',
    text: 'This platform is a game-changer for early cancer detection and patient triage. The medication scanner is especially helpful for my patients.',
    avatar: '/placeholder.svg',
  },
  {
    name: 'Raj P.',
    role: 'Caregiver',
    text: 'The cancer medication scanner made it easy to double-check my father’s prescriptions. Highly recommend for families dealing with cancer.',
    avatar: '/placeholder.svg',
  },
];

const trustedBy = [
  'CancerCare', 'OncoTrust', 'MedAI', 'HealthFirst', 'OncologyNet'
];

const Index = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [oncologists] = useState<Oncologist[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      specialty: 'Medical Oncology',
      rating: 4.9,
      reviews: 156,
      distance: '0.8 miles',
      address: '123 Medical Center Dr, Suite 400',
      phone: '+1 (555) 123-4567',
      email: 'dr.chen@medcenter.com',
      availability: ['Mon 9-5', 'Wed 9-5', 'Fri 9-5'],
      experience: '15+ years',
      languages: ['English', 'Mandarin', 'Spanish'],
      insurance: ['Blue Cross', 'Aetna', 'United Health', 'Medicare'],
      image: '/placeholder.svg',
      certifications: ['Board Certified Oncologist', 'American Society of Clinical Oncology']
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      specialty: 'Surgical Oncology',
      rating: 4.8,
      reviews: 203,
      distance: '1.2 miles',
      address: '456 Cancer Treatment Blvd, Floor 3',
      phone: '+1 (555) 234-5678',
      email: 'dr.rodriguez@cancercenter.org',
      availability: ['Mon 8-6', 'Tue 8-6', 'Thu 8-6'],
      experience: '12+ years',
      languages: ['English', 'Spanish'],
      insurance: ['Kaiser', 'Blue Cross', 'Cigna', 'Medicare'],
      image: '/placeholder.svg',
      certifications: ['Board Certified Surgeon', 'Society of Surgical Oncology']
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      specialty: 'Radiation Oncology',
      rating: 4.7,
      reviews: 89,
      distance: '2.1 miles',
      address: '789 Healing Arts Center, Wing B',
      phone: '+1 (555) 345-6789',
      email: 'dr.watson@healingarts.com',
      availability: ['Tue 9-5', 'Wed 9-5', 'Thu 9-5'],
      experience: '10+ years',
      languages: ['English', 'French'],
      insurance: ['Blue Cross', 'Aetna', 'Humana'],
      image: '/placeholder.svg',
      certifications: ['Board Certified Radiation Oncologist', 'American Board of Radiology']
    }
  ]);
  
  const recognition = useRef<any>(null);
  const { toast } = useToast();
  const tabsRef = useRef<HTMLDivElement>(null);
  const scrollToTabs = () => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [doctorSpeaking, setDoctorSpeaking] = useState(false);
  const doctorSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setSymptoms(transcript);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not access microphone. Please check permissions.",
          variant: "destructive",
        });
      };
    }
  }, [toast]);

  const toggleListening = () => {
    if (!recognition.current) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your symptoms before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic medical matching
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis: SymptomAnalysis[] = generateMockAnalysis(symptoms);
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);

    // Speak the results with the doctor avatar
    if (mockAnalysis.length > 0) {
      const text = mockAnalysis.map(r => `${r.cancerType}. Confidence: ${r.confidence} percent. Recommendation: ${r.recommendation}`).join(' ');
      if ('speechSynthesis' in window) {
        if (doctorSpeechRef.current) {
          window.speechSynthesis.cancel();
        }
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.onstart = () => setDoctorSpeaking(true);
        utter.onend = () => setDoctorSpeaking(false);
        doctorSpeechRef.current = utter;
        window.speechSynthesis.speak(utter);
      }
    }

    toast({
      title: "Analysis Complete",
      description: "Your symptoms have been analyzed. Please review the results below.",
    });
  };

  const generateMockAnalysis = (symptomText: string): SymptomAnalysis[] => {
    const lowercaseSymptoms = symptomText.toLowerCase();
    const results: SymptomAnalysis[] = [];

    // Skin cancer detection
    if (lowercaseSymptoms.includes('mole') || lowercaseSymptoms.includes('spot') || 
        lowercaseSymptoms.includes('skin') || lowercaseSymptoms.includes('dark')) {
      results.push({
        cancerType: 'Skin Cancer (Melanoma)',
        confidence: 75,
        symptoms: ['Unusual moles or spots', 'Changes in skin pigmentation'],
        recommendation: 'Schedule a dermatological examination within 1-2 weeks',
        urgency: 'medium'
      });
    }

    // Breast cancer detection
    if (lowercaseSymptoms.includes('breast') || lowercaseSymptoms.includes('lump') ||
        lowercaseSymptoms.includes('chest')) {
      results.push({
        cancerType: 'Breast Cancer',
        confidence: 82,
        symptoms: ['Breast lumps or masses', 'Changes in breast tissue'],
        recommendation: 'Urgent consultation with oncologist or mammogram',
        urgency: 'high'
      });
    }

    // Lung cancer detection
    if (lowercaseSymptoms.includes('cough') || lowercaseSymptoms.includes('breath') ||
        lowercaseSymptoms.includes('chest pain')) {
      results.push({
        cancerType: 'Lung Cancer',
        confidence: 65,
        symptoms: ['Persistent cough', 'Breathing difficulties', 'Chest pain'],
        recommendation: 'Chest X-ray and pulmonary function tests recommended',
        urgency: 'medium'
      });
    }

    // Colorectal cancer detection
    if (lowercaseSymptoms.includes('blood') || lowercaseSymptoms.includes('stool') ||
        lowercaseSymptoms.includes('bowel') || lowercaseSymptoms.includes('abdominal')) {
      results.push({
        cancerType: 'Colorectal Cancer',
        confidence: 70,
        symptoms: ['Blood in stool', 'Bowel changes', 'Abdominal discomfort'],
        recommendation: 'Colonoscopy screening and gastroenterologist consultation',
        urgency: 'medium'
      });
    }

    // If no specific matches, provide general guidance
    if (results.length === 0) {
      results.push({
        cancerType: 'General Health Concern',
        confidence: 45,
        symptoms: ['Non-specific symptoms reported'],
        recommendation: 'General health check-up with primary care physician',
        urgency: 'low'
      });
    }

    return results;
  };

  const speakResults = () => {
    if (!analysis.length) return;

    const textToSpeak = `Analysis results: ${analysis.map(result => 
      `${result.cancerType} with ${result.confidence}% confidence. ${result.recommendation}`
    ).join('. ')} Remember, this is not a medical diagnosis. Please consult a healthcare professional.`;

    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Info className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const bookAppointment = (doctorId: string) => {
    setShowComingSoon(true);
  };

  const handleBackFromComingSoon = () => {
    setShowComingSoon(false);
  };

  // Show Coming Soon screen when booking appointment
  if (showComingSoon) {
    return <ComingSoon onBack={handleBackFromComingSoon} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 font-sans">
      {/* Header (Logo and Title) */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight">MyOncologist</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#6366F1" stopOpacity="0.12" />
                <stop offset="1" stopColor="#A5B4FC" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <ellipse cx="720" cy="160" rx="900" ry="180" fill="url(#heroGradient)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center py-24 px-4 sm:px-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-fade-in-up">AI-Driven Cancer Care, Instantly</h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 animate-fade-in-up delay-100">Early cancer symptom analysis, oncology specialist matching, and medication safety—powered by advanced AI.</p>
          <button
            onClick={scrollToTabs}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all animate-fade-in-up delay-200"
          >
            Start Screening
          </button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why MyOncologist?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Stethoscope className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">AI Cancer Symptom Analysis</h3>
            <p className="text-gray-600">Describe your symptoms and get instant, AI-powered cancer risk insights.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Users className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Find Oncologists Fast</h3>
            <p className="text-gray-600">Connect with board-certified cancer specialists near you for expert care.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Pill className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Cancer Medication Scanner</h3>
            <p className="text-gray-600">Upload a photo of your cancer medication to verify and learn more instantly.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <Shield className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your data is encrypted and never shared. HIPAA-compliant and privacy-first.</p>
          </div>
        </div>
      </section>

      {/* Tabs Section (Features) */}
      <section ref={tabsRef} className="max-w-6xl mx-auto px-2 sm:px-6 py-12">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-6 sm:p-12 border border-gray-100 animate-fade-in-up">
          {/* Medical Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50 mb-8 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong className="font-semibold">Cancer Care Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional oncology advice, diagnosis, or treatment. Always consult a licensed oncologist or cancer specialist for medical concerns.
            </AlertDescription>
          </Alert>

          {/* Tabs Navigation */}
          <Tabs defaultValue="analysis" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 h-16 bg-white border border-gray-200 shadow-sm rounded-lg">
              <TabsTrigger value="analysis" className="flex items-center gap-3 text-lg py-4 font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">
                <Stethoscope className="w-5 h-5" />
                Symptom Analysis
              </TabsTrigger>
              <TabsTrigger value="oncologists" className="flex items-center gap-3 text-lg py-4 font-medium data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">
                <Users className="w-5 h-5" />
                Find Oncologists
              </TabsTrigger>
              <TabsTrigger value="medicine" className="flex items-center gap-3 text-lg py-4 font-medium data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200">
                <Pill className="w-5 h-5" />
                Medicine Scanner
              </TabsTrigger>
            </TabsList>

            {/* Symptom Analysis Tab */}
            <TabsContent value="analysis" className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
                  <DoctorAvatar speaking={doctorSpeaking} />
                </div>
                <div className="flex-1 w-full">
                  {/* Symptom Input */}
                  <Card className="shadow-sm border border-gray-200 bg-white">
                    <CardHeader className="bg-blue-50 border-b border-gray-100">
                      <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                        <Stethoscope className="w-6 h-6 mr-3 text-blue-600" />
                        Describe Your Cancer-Related Symptoms
                      </CardTitle>
                      <p className="text-gray-600 mt-2">Provide detailed information about symptoms that may be related to cancer for accurate analysis</p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        <Textarea
                          placeholder="Please describe your symptoms in detail. For example: 'I noticed a dark spot on my arm that has been growing larger' or 'I've been experiencing persistent cough with some breathing difficulties'..."
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          className="min-h-40 text-base resize-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-4"
                        />
                        
                        <div className="flex flex-wrap gap-4">
                          <Button
                            onClick={toggleListening}
                            variant={isListening ? "destructive" : "outline"}
                            className="flex items-center gap-2 px-6 py-3 h-12 border-2"
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            {isListening ? 'Stop Listening' : 'Voice Input'}
                          </Button>
                          
                          <Button
                            onClick={analyzeSymptoms}
                            disabled={isAnalyzing || !symptoms.trim()}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 h-12 text-white font-medium"
                          >
                            {isAnalyzing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
                          </Button>

                          {analysis.length > 0 && (
                            <Button
                              onClick={isSpeaking ? stopSpeaking : speakResults}
                              variant="outline"
                              className="flex items-center gap-2 px-6 py-3 h-12 border-2"
                            >
                              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                              {isSpeaking ? 'Stop Speaking' : 'Hear Results'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analysis Results */}
                  {analysis.length > 0 && (
                    <Card className="shadow-sm border border-gray-200 bg-white">
                      <CardHeader className="bg-green-50 border-b border-gray-100">
                        <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                          <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                          Analysis Results
                        </CardTitle>
                        <p className="text-gray-600 mt-2">AI-powered symptom analysis with professional recommendations</p>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-8">
                          {analysis.map((result, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">{result.cancerType}</h3>
                                <Badge className={`${getUrgencyColor(result.urgency)} flex items-center gap-2 px-3 py-1 font-medium`}>
                                  {getUrgencyIcon(result.urgency)}
                                  {result.urgency.toUpperCase()} PRIORITY
                                </Badge>
                              </div>

                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-medium text-gray-600">Confidence Level</span>
                                  <span className="text-sm font-bold text-gray-900">{result.confidence}%</span>
                                </div>
                                <Progress value={result.confidence} className="h-2" />
                              </div>

                              <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Matching Symptoms:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result.symptoms.map((symptom, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <Separator className="my-6" />

                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-medium text-blue-800 mb-2">Recommendation:</h4>
                                <p className="text-blue-700">{result.recommendation}</p>
                              </div>
                            </div>
                          ))}

                          <Alert className="border-red-200 bg-red-50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">
                              <strong className="font-semibold">Critical Reminder:</strong> These results are generated by an AI system and should not be considered a medical diagnosis. Please consult with a licensed healthcare professional immediately for proper evaluation and treatment.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Find Oncologists Tab */}
            <TabsContent value="oncologists" className="space-y-8">
              <Card className="shadow-sm border border-gray-200 bg-white">
                <CardHeader className="bg-green-50 border-b border-gray-100">
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
                    <MapPin className="w-6 h-6 mr-3 text-green-600" />
                    Professional Oncologists Near You
                  </CardTitle>
                  <p className="text-gray-600 mt-2">Connect with board-certified oncologists in your area</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid gap-8">
                    {oncologists.map((doctor) => (
                      <Card key={doctor.id} className="border border-gray-200 hover:border-blue-300 transition-all duration-300 bg-white">
                        <CardContent className="p-8">
                          <div className="flex flex-col lg:flex-row gap-8">
                            {/* Doctor Image */}
                            <div className="flex-shrink-0">
                              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                <Users className="w-16 h-16 text-white" />
                              </div>
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-grow space-y-6">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                                  <p className="text-lg text-blue-600 font-medium">{doctor.specialty}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 lg:mt-0">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                  <span className="font-semibold">{doctor.rating}</span>
                                  <span className="text-gray-600">({doctor.reviews} reviews)</span>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{doctor.distance} away</span>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <span className="text-sm text-gray-600">{doctor.address}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{doctor.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{doctor.email}</span>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Award className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{doctor.experience} experience</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Available: {doctor.availability.join(', ')}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Languages */}
                              <div>
                                <h4 className="font-medium text-gray-700 mb-3">Languages:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {doctor.languages.map((lang, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {lang}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Certifications */}
                              <div>
                                <h4 className="font-medium text-gray-700 mb-3">Certifications:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {doctor.certifications.map((cert, idx) => (
                                    <Badge key={idx} className="bg-green-100 text-green-800">
                                      <Award className="w-3 h-3 mr-1" />
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Insurance */}
                              <div>
                                <h4 className="font-medium text-gray-700 mb-3">Accepted Insurance:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {doctor.insurance.map((ins, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-gray-100 text-gray-700">
                                      {ins}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-4 pt-6">
                                <Button 
                                  onClick={() => bookAppointment(doctor.id)}
                                  className="bg-green-600 hover:bg-green-700 px-6 py-3 h-12 font-medium"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Book Appointment
                                </Button>
                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 h-12 font-medium">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call Office
                                </Button>
                                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 h-12 font-medium">
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Alert className="border-blue-200 bg-blue-50 mt-8 rounded-lg">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong className="font-semibold">Professional Network:</strong> All listed oncologists are licensed medical professionals. Appointment availability and insurance coverage should be confirmed directly with each practice.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medicine Scanner Tab */}
            <TabsContent value="medicine" className="space-y-8">
              <MedicineScanner />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What People Are Saying</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
              {/* Remove avatar image */}
              <p className="text-gray-700 mb-4 italic">“{t.text}”</p>
              <div className="font-semibold text-blue-700">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
          {trustedBy.map((logo, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg width="32" height="32" fill="none"><circle cx="16" cy="16" r="16" fill="#6366F1" fillOpacity="0.12" /></svg>
              <span className="font-semibold text-gray-700 text-lg">{logo}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-gray-500">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <span className="font-bold text-blue-700">MyOncologist</span> &copy; {new Date().getFullYear()} &mdash; AI Cancer Care
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-700 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-700 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-700 transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
