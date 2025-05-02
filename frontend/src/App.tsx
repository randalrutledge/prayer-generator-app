
import { useState } from 'react';
import './App.css'; // Ensure App.css is imported if needed, though index.css handles Tailwind
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { Copy, RefreshCw } from 'lucide-react'; // Import icons

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
    // Updated background to dark blue, centered content
    <div className="min-h-screen bg-[#0a2540] flex flex-col items-center justify-center p-4 font-['Inter',sans-serif]">
      
      {/* Content container */}
      <div className="flex flex-col items-center w-full max-w-2xl">
        {/* Logo and Title Section */}
        <div className="mb-8 text-center">
          <img src="/assets/logo.png" alt="PowerPrayer.ai Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">POWERPRAYER.AI</h1>
          <p className="text-lg text-gray-300">Empowering Your Spiritual Journey with AI-Driven Prayers</p>
        </div>

        <Card className="w-full shadow-xl bg-[#1e3a5f]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-600/50">
          <CardHeader className="text-center p-6 border-b border-gray-600/50">
            {/* Simplified Header */}
            <h2 className="text-2xl font-semibold text-white tracking-tight">What are you going through?</h2>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {/* Display Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {!prayer && !error ? (
              // Landing Section (Show if no prayer and no error)
              <div className="space-y-5">
                <Textarea
                  placeholder="Tell us here..."
                  value={userInput}
                  onChange={handleInputChange}
                  className="min-h-[120px] border-gray-500 focus:border-[#f0b90b] focus:ring-2 focus:ring-[#f0b90b]/50 rounded-lg text-base p-3 shadow-sm bg-[#0a2540]/70 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSubmit}
                  size="lg" // Larger button
                  className="w-full bg-[#f0b90b] hover:bg-[#f3c84b] text-[#0a2540] font-bold py-3 rounded-lg transition duration-300 ease-in-out disabled:opacity-60 shadow-md hover:shadow-lg text-lg"
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
                    <h3 className="text-xl font-semibold text-center text-gray-200">Your Personalized Prayer:</h3>
                    <ScrollArea className="h-60 w-full rounded-md border border-gray-600 bg-[#0a2540]/70 p-4 shadow-inner">
                      {/* Using a more readable serif font for prayer */}
                      <p className="text-gray-100 whitespace-pre-wrap font-[Georgia,serif] text-lg leading-relaxed">{prayer}</p>
                    </ScrollArea>
                  </>
                )}
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                  {prayer && (
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="w-full sm:w-auto border-[#f0b90b] text-[#f0b90b] hover:bg-[#f0b90b]/20 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center bg-transparent"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? 'Copied!' : 'Copy Prayer'}
                    </Button>
                  )}
                  <Button
                    onClick={handleResubmit}
                    variant="outline"
                    className="w-full sm:w-auto border-gray-500 text-gray-300 hover:bg-gray-700/50 rounded-lg shadow-sm hover:shadow-md flex items-center justify-center bg-transparent"
                  >
                     <RefreshCw className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-[#0a2540]/50 p-4 border-t border-gray-600/50">
              <p className="text-center text-gray-400 text-xs italic w-full">"Come to me, all you who are weary and burdened, and I will give you rest." - Matthew 11:28</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;

