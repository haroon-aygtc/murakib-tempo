import AIAssistantWidget from "./AIAssistantWidget";
import DemoForm from "./DemoForm";

function Home() {
  return (
    <div className="w-screen h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Murakib AI Assistant Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the power of AI-driven form assistance with real-time
            guidance, multilingual support, and voice interaction capabilities.
          </p>
        </div>

        <DemoForm />
      </div>

      {/* AI Assistant Widget */}
      <AIAssistantWidget
        position="bottom-right"
        primaryColor="#7C3AED"
        assistantName="Murakib"
        assistantAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=murakib"
        languages={["en", "ar", "fr", "es", "zh", "de"]}
        defaultLanguage="en"
        voiceEnabled={true}
      />
    </div>
  );
}

export default Home;
