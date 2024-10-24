// components/chat-interface.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Trophy,
  UserPlus,
  Users2,
  Globe,
  Star,
  Send,
  Loader2,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import PlayerCard from "@/components/player-card";

const teamOptions = [
  { icon: Trophy, label: "Professional Team", id: "pro" },
  { icon: Users, label: "Semi-Professional Team", id: "semi-pro" },
  { icon: UserPlus, label: "VCT Game Changers Team", id: "game-changers" },
  { icon: Users2, label: "Mixed-Gender Team", id: "mixed" },
  { icon: Globe, label: "Cross-Regional Team", id: "cross-regional" },
  { icon: Star, label: "Rising Star Team", id: "rising" },
];

interface NewsItem {
  title: string;
  url: string;
  date: string;
}

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [playerData, setPlayerData] = useState<any[]>([]);
  const [additionalOutput, setAdditionalOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const handleOptionClick = async (option: string) => {
    const userMessage = `Build me a ${option}`;
    setMessage(userMessage);
    await handleSubmit(userMessage);
  };

  const handleSubmit = async (userInput: string) => {
    if (userInput.trim()) {
      setLoading(true);
      setPlayerData([]);
      setAdditionalOutput("");
      setMessage("");
  
      try {
        const formData = new FormData();
        formData.append("userMessage", userInput);
  
        const response = await fetch("/api/bedrock", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Data received from API:", data);
  
        if (data.result?.playerData) {
          setPlayerData(data.result.playerData);
        }
        if (data.result?.additionalOutput) {
          setAdditionalOutput(data.result.additionalOutput);
        }
      } catch (error) {
        console.error("Error:", error);
        setAdditionalOutput("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(message);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch("https://vlrggapi.vercel.app/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data.slice(0, 5)); // Limit to 5 news items
      } else {
        console.error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setNewsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="nav-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <img
                src="/vct.png?height=50&width=100&text=VCT"
                alt="VCT Logo"
                className="h-8 w-auto"
              />
            </div>
            {/* Center */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <h1 className="text-2xl font-bold text-[#fd4556]">
                  VCT x AWS Team Builder
                </h1>
              </div>
            </div>
            {/* Right side */}
            <div className="flex items-center">
              <img
                src="/aws.png?height=50&width=100&text=AWS"
                alt="AWS Logo"
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Options */}
        <div className="animated-gradient rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {teamOptions.map((option) => (
              <Button
                key={option.id}
                variant="secondary"
                className="flex items-center space-x-2 h-auto py-4 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleOptionClick(option.label)}
                disabled={loading}
              >
                <option.icon className="w-5 h-5" />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center my-10">
              <Loader2 className="animate-spin w-6 h-6 mr-2" />
              <span>Building...</span>
            </div>
          )}

          {/* Player Data */}
          {!loading && playerData.length > 0 && (
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {playerData.map((player, i) => (
                  <div
                    key={i}
                    className="card-enter"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <PlayerCard player={player} delay={i * 0.1} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Additional Output */}
          {!loading && additionalOutput && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-primary">
                Additional Output
              </h2>
              <p className="text-gray-300">{additionalOutput}</p>
            </div>
          )}

          {/* No Data Message */}
          {!loading && playerData.length === 0 && !additionalOutput && (
            <div className="text-center text-gray-400">No data available.</div>
          )}

          {/* News Section */}
          <div className="animated-gradient rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary flex items-center">
              <Newspaper className="w-6 h-6 mr-2" />
              Latest News
            </h2>
            {newsLoading ? (
              <div className="flex justify-center items-center my-10">
                <Loader2 className="animate-spin w-6 h-6 mr-2" />
                <span>Loading news...</span>
              </div>
            ) : (
              <ul className="space-y-4">
                {news.map((item, index) => (
                  <li key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:bg-gray-800 rounded-lg p-4 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* User Input Form */}
        <form onSubmit={onFormSubmit} className="flex flex-col space-y-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for a specific team composition..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Building...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
