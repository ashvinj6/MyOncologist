import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Upload, RotateCcw, CheckCircle, AlertTriangle, Pill, Info, Download, Share2, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MedicineInfo {
  name: string;
  genericName: string;
  strength: string;
  form: string;
  manufacturer: string;
  description: string;
  uses: string[];
  sideEffects: string[];
  warnings: string[];
  interactions: string[];
  dosage: string;
  imageUrl?: string;
  confidence: number;
}

const MedicineScanner = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [scanHistory, setScanHistory] = useState<MedicineInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock medicine database for demonstration
  const mockMedicineDatabase = [
    {
      name: "Ibuprofen",
      genericName: "Ibuprofen",
      strength: "200mg",
      form: "Tablet",
      manufacturer: "Generic",
      description: "Nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation",
      uses: ["Pain relief", "Fever reduction", "Inflammation", "Headaches", "Arthritis", "Menstrual cramps"],
      sideEffects: ["Stomach upset", "Heartburn", "Dizziness", "Mild headache", "Ringing in ears"],
      warnings: ["Take with food or milk", "Do not exceed recommended dosage", "Avoid if allergic to aspirin", "Consult doctor if pregnant"],
      interactions: ["Aspirin", "Blood thinners", "Other NSAIDs", "Alcohol"],
      dosage: "200-400mg every 4-6 hours as needed",
      confidence: 95
    },
    {
      name: "Lisinopril",
      genericName: "Lisinopril",
      strength: "10mg",
      form: "Tablet",
      manufacturer: "Generic",
      description: "ACE inhibitor used to treat high blood pressure and heart failure",
      uses: ["High blood pressure", "Heart failure", "Heart attack recovery"],
      sideEffects: ["Dizziness", "Dry cough", "Fatigue", "Headache"],
      warnings: ["Do not take if pregnant", "Avoid potassium supplements", "Monitor kidney function"],
      interactions: ["NSAIDs", "Lithium", "Potassium supplements"],
      dosage: "10mg once daily",
      confidence: 95
    },
    {
      name: "Metformin",
      genericName: "Metformin Hydrochloride",
      strength: "500mg",
      form: "Tablet",
      manufacturer: "Generic",
      description: "Oral diabetes medicine that helps control blood sugar levels",
      uses: ["Type 2 diabetes", "Polycystic ovary syndrome"],
      sideEffects: ["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
      warnings: ["Take with food", "Avoid alcohol", "Monitor blood sugar"],
      interactions: ["Alcohol", "Contrast dye", "Other diabetes medications"],
      dosage: "500mg twice daily with meals",
      confidence: 92
    },
    {
      name: "Atorvastatin",
      genericName: "Atorvastatin Calcium",
      strength: "20mg",
      form: "Tablet",
      manufacturer: "Generic",
      description: "Statin medication used to lower cholesterol and reduce heart disease risk",
      uses: ["High cholesterol", "Heart disease prevention", "Stroke prevention"],
      sideEffects: ["Muscle pain", "Headache", "Nausea", "Liver problems"],
      warnings: ["Avoid grapefruit", "Monitor liver function", "Report muscle pain"],
      interactions: ["Grapefruit juice", "Warfarin", "Birth control pills"],
      dosage: "20mg once daily in the evening",
      confidence: 88
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setMedicineInfo(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      analyzeMedicine(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeMedicine = async (imageData: string) => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    // For testing, always return ibuprofen on first scan
    let selectedMedicine;
    if (scanHistory.length === 0) {
      selectedMedicine = mockMedicineDatabase[0]; // Ibuprofen
    } else {
      selectedMedicine = mockMedicineDatabase[Math.floor(Math.random() * mockMedicineDatabase.length)];
    }
    const analyzedMedicine = {
      ...selectedMedicine,
      imageUrl: imageData,
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100% confidence
    };
    setMedicineInfo(analyzedMedicine);
    setScanHistory(prev => [analyzedMedicine, ...prev.slice(0, 4)]); // Keep last 5 scans
    setIsAnalyzing(false);
    toast({
      title: "Medicine Identified",
      description: `Successfully identified ${analyzedMedicine.name}`,
    });
  };

  const retakePhoto = () => {
    setUploadedImage(null);
    setMedicineInfo(null);
    setError(null);
  };

  const downloadImage = () => {
    if (uploadedImage) {
      const link = document.createElement('a');
      link.download = 'medicine-upload.jpg';
      link.href = uploadedImage;
      link.click();
    }
  };

  const shareResults = () => {
    if (navigator.share && medicineInfo) {
      navigator.share({
        title: 'Medicine Scan Results',
        text: `Identified: ${medicineInfo.name} ${medicineInfo.strength}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Medicine: ${medicineInfo?.name} ${medicineInfo?.strength}`);
      toast({
        title: "Copied to Clipboard",
        description: "Medicine information copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      {!uploadedImage && !isAnalyzing && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="bg-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <Upload className="w-6 h-6 mr-3 text-blue-600" />
              Upload Medicine Photo
            </CardTitle>
            <p className="text-gray-600 mt-2">Upload a clear photo of the medicine label or pill to identify it</p>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <Alert className="border-red-200 bg-red-50 mb-6 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col items-center space-y-6">
              <label className="w-full flex flex-col items-center px-4 py-8 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition">
                <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
                <span className="text-gray-600 mb-2">Click to upload or drag and drop</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Section */}
      {isAnalyzing && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <h3 className="text-xl font-semibold text-gray-900">Analyzing Medicine...</h3>
              <p className="text-gray-600">Using AI to identify the medication</p>
              <Progress value={75} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {medicineInfo && uploadedImage && !isAnalyzing && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="bg-green-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
              Medicine Identified
            </CardTitle>
            <p className="text-gray-600 mt-2">AI-powered medicine identification results</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image and Basic Info */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded medicine" 
                    className="w-full rounded-lg border border-gray-200"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={retakePhoto}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Upload Another
                    </Button>
                    <Button
                      onClick={downloadImage}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={shareResults}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Medicine Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{medicineInfo.name}</h3>
                  <p className="text-lg text-gray-600 mb-4">{medicineInfo.genericName}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {medicineInfo.strength}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {medicineInfo.form}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      {medicineInfo.manufacturer}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      {Math.round(medicineInfo.confidence)}% Match
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-6">{medicineInfo.description}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Uses:</h4>
                    <div className="flex flex-wrap gap-2">
                      {medicineInfo.uses.map((use, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Dosage:</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{medicineInfo.dosage}</p>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-8" />
            {/* Detailed Information */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Side Effects:</h4>
                <ul className="space-y-2">
                  {medicineInfo.sideEffects.map((effect, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Warnings:</h4>
                <ul className="space-y-2">
                  {medicineInfo.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Drug Interactions:</h4>
              <div className="flex flex-wrap gap-2">
                {medicineInfo.interactions.map((interaction, idx) => (
                  <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {interaction}
                  </Badge>
                ))}
              </div>
            </div>
            <Alert className="border-amber-200 bg-amber-50 mt-6 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong className="font-semibold">Important:</strong> This identification is for informational purposes only. Always verify with your pharmacist or healthcare provider before taking any medication.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-xl font-semibold text-gray-900">
              <Pill className="w-6 h-6 mr-3 text-gray-600" />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {scanHistory.map((medicine, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Pill className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-600">{medicine.strength} • {medicine.form}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round(medicine.confidence)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicineScanner; 