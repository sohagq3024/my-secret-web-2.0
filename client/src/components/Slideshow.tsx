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
      <section className="relative h-[70vh] hero-gradient flex items-center justify-center">
        <div className="absolute inset-0 matrix-bg"></div>
        <div className="relative text-center text-green-100 z-10">
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent neon-text">
            Premium Content Awaits
          </h2>
          <p className="text-xl mb-8 text-green-300/80">Exclusive access to encrypted digital content</p>
          <Button
            onClick={handleGetStarted}
            className="cyber-button text-lg px-10 py-4 hover:shadow-green-500/25"
          >
            <span className="mr-2">🔓</span>
            Access Portal
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative h-[70vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(6, 78, 59, 0.5)), url(${slide.imageUrl})`,
              }}
            >
              <div className="absolute inset-0 matrix-bg"></div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-center text-green-100">
                  <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent neon-text">
                    {slide.title}
                  </h2>
                  <p className="text-xl mb-8 text-green-300/80">{slide.subtitle}</p>
                  {index === currentSlide && (
                    <Button
                      onClick={handleGetStarted}
                      className="cyber-button text-lg px-10 py-4 hover:shadow-green-500/25"
                    >
                      <span className="mr-2">🔓</span>
                      Access Portal
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
