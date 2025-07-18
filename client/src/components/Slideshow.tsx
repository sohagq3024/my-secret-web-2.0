import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SlideshowImage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { MembershipModal } from "./MembershipModal";
import { useAuth } from "@/contexts/AuthContext";

export function Slideshow() {
  const { isLoggedIn, hasValidMembership } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMembership, setShowMembership] = useState(false);

  const { data: slides = [], isLoading } = useQuery<SlideshowImage[]>({
    queryKey: ["/api/slideshow"],
  });

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const handleGetStarted = () => {
    if (!isLoggedIn || !hasValidMembership) {
      setShowMembership(true);
    }
  };

  if (isLoading || slides.length === 0) {
    return (
      <section className="relative h-96 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-4">Premium Content Awaits</h2>
          <p className="text-xl mb-8">Exclusive access to high-quality digital content</p>
          <Button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-primary hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.imageUrl})`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-xl mb-8">{slide.subtitle}</p>
                  {index === currentSlide && (
                    <Button
                      onClick={handleGetStarted}
                      className="px-8 py-3 gradient-primary text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      <MembershipModal 
        isOpen={showMembership} 
        onClose={() => setShowMembership(false)} 
      />
    </>
  );
}
