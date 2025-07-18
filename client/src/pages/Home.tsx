import { Header } from "@/components/Header";
import { Slideshow } from "@/components/Slideshow";
import { CelebritySection } from "@/components/CelebritySection";
import { AlbumSection } from "@/components/AlbumSection";
import { VideoSection } from "@/components/VideoSection";
import { Lock, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Slideshow />
        <CelebritySection />
        <AlbumSection />
        <VideoSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Lock className="text-white w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold">My Secret Web</h3>
              </div>
              <p className="text-gray-400">
                Premium digital content platform providing exclusive access to high-quality albums and videos.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#celebrity" className="hover:text-primary transition-colors">Celebrity</a></li>
                <li><a href="#albums" className="hover:text-primary transition-colors">Albums</a></li>
                <li><a href="#videos" className="hover:text-primary transition-colors">Videos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 My Secret Web. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
