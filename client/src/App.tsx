import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileSearch, TrendingUp } from "lucide-react";
import Home from "@/pages/Home";
import Analysis from "@/pages/Analysis";
import Simulator from "@/pages/Simulator";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dudilig</h1>
            <p className="text-xs text-muted-foreground">From Deck to Deal Terms — with Citations</p>
          </div>
          <nav className="flex gap-2">
            <Button
              asChild
              variant={location === "/" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Link href="/" data-testid="nav-analysis">
                <FileSearch className="w-4 h-4" />
                Compliance Analysis
              </Link>
            </Button>
            <Button
              asChild
              variant={location === "/simulator" ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Link href="/simulator" data-testid="nav-simulator">
                <TrendingUp className="w-4 h-4" />
                Strategy Simulator
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/analysis/:id" component={Analysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <Navigation />
          <main className="flex-1 overflow-hidden">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
