import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-primary to-primary-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Chat in Real-Time
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Experience seamless communication with beautiful iPhone-inspired design. 
              Connect instantly with friends and colleagues.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <Zap className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-Time</h3>
              <p className="text-sm text-white/80">Instant message delivery with live updates</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <Users className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Online Status</h3>
              <p className="text-sm text-white/80">See who's online and active</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
              <MessageCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Beautiful UI</h3>
              <p className="text-sm text-white/80">iPhone-inspired clean design</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full shadow-2xl"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
