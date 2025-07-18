import { Lock, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { Link } from "wouter";

export function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowAdmin = () => {
    if (user?.role === "admin") {
      // Navigate to admin panel
      window.location.href = "/admin";
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Lock className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">My Secret Web</h1>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/celebrities" className="text-gray-600 hover:text-primary transition-colors">
                Celebrity
              </Link>
              <Link href="/albums" className="text-gray-600 hover:text-primary transition-colors">
                Albums
              </Link>
              <Link href="/videos" className="text-gray-600 hover:text-primary transition-colors">
                Videos
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.firstName}
                  </span>
                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShowAdmin}
                      className="text-primary border-primary hover:bg-primary hover:text-white"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowLogin(true)}
                    className="text-primary border-primary hover:bg-primary hover:text-white"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setShowRegister(true)}
                    className="gradient-primary text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      
      <RegisterModal 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}
