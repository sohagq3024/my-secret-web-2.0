import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/Home";
import { AllCelebrities } from "@/pages/AllCelebrities";
import { AllAlbums } from "@/pages/AllAlbums";
import { AllVideos } from "@/pages/AllVideos";
import { ContentViewer } from "@/pages/ContentViewer";
import { AdminPanel } from "@/components/AdminPanel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/celebrities" component={AllCelebrities} />
      <Route path="/albums" component={AllAlbums} />
      <Route path="/videos" component={AllVideos} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/content/:type/:id" component={ContentViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
