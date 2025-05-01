
import { useState } from 'react';
import './App.css'; // Ensure App.css is imported if needed, though index.css handles Tailwind
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { Copy, RefreshCw, Sparkles } from 'lucide-react'; // Import icons

function App() {
  const [userInput, setUserInput] = useState('');
  const [prayer, setPrayer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setPrayer('');
    setCopied(false);
    setError(null); // Clear previous errors

    try {
      // --- Call the backend API function --- 
      // IMPORTANT: Replace '/api/generate-prayer' with the actual URL 
      // where your backend function is deployed.
      const response = await fetch('/api/generate-prayer', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.prayer) {
          throw new Error("Received empty prayer from server.");
      }
      
      setPrayer(data.prayer);
      // --- End API Call --- 

    } catch (err: any) {
      console.error("Error fetching prayer:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prayer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const handleResubmit = () => {
    setUserInput('');
    setPrayer('');
    setCopied(false);
    setError(null); // Clear error on resubmit
  };

  return (
    // Updated background with image and overlay
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 font-['Inter',sans-serif] relative" 
      style={{ backgroundImage: `url('/assets/spiritual_background_abstract.jpeg')` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-sky-100/80 to-amber-50/80 z-0"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* App Title Added Here */}
        <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center tracking-tight flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-amber-600" />
          Personal Prayer Generator
        </h1>

        <Card className="w-full max-w-xl shadow-xl bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200">
          <CardHeader className="text-center bg-gradient-to-r from-sky-100/80 to-blue-100/80 p-6 border-b border-gray-200/50">
            <CardTitle className="text-2xl font-semibold text-blue-800 tracking-tight">Feeling Overwhelmed?</CardTitle>
            <CardDescription className="text-blue-700 mt-1 text-md">Receive a Personalized Prayer Now</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Display Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {!prayer && !error ? (
              // Landing Section (Show if no prayer and no error)
              <div className="space-y-5">
                <Textarea
                  placeholder="Tell us what you're going through…"
                  value={userInput}
                  onChange={handleInputChange}
                  className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-base p-3 shadow-sm bg-white/70"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSubmit}
                  size="lg" // Larger button
                  className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out disabled:opacity-60 shadow-md hover:shadow-lg text-lg"
                  disabled={isLoading || !userInput.trim()}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Generating Prayer...
                    </>
                  ) : (
                    'Send My Prayer'
                  )}
                </Button>
              </div>
            ) : (
              // Result Section (Show if prayer exists OR if there was an error)
              <div className="space-y-5 animate-fade-in">
                {prayer && (
                  <>
                    <h3 className="text-xl font-semibold text-center text-blue-700">Your Personalized Prayer:</h3>
                    <ScrollArea className="h-60 w-full rounded-md border border-blue-100 bg-sky-50/70 p-4 shadow-inner">
                      <p className="text-gray-900 whitespace-pre-wrap font-[Georgia,serif] text-lg leading-relaxed">{prayer}</p>
                    </ScrollArea>
                  </>
                )}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                  {prayer && (
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-100 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center bg-white/80 hover:bg-blue-50/80"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy Prayer'}
                    </Button>
                  )}
                  <Button
                    onClick={handleResubmit}
                    variant="outline"
                    className="w-full sm:w-auto border-amber-500 text-amber-700 hover:bg-amber-100 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center bg-white/80 hover:bg-amber-50/80"
                  >
                     <RefreshCw className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50/80 p-4 border-t border-gray-200/50">
              <p className="text-center text-gray-600 text-xs italic w-full">"Come to me, all you who are weary and burdened, and I will give you rest." - Matthew 11:28</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;

