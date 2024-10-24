// components/chat-interface.tsx

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Users, 
  Trophy, 
  UserPlus, 
  Users2, 
  Globe, 
  Star,
  Send,
  Bot,
  Sparkles,
  Loader2
} from 'lucide-react';
import PlayerCard from '@/components/player-card';

const teamOptions = [
  { icon: Trophy, label: 'Professional Team', id: 'pro' },
  { icon: Users, label: 'Semi-Professional Team', id: 'semi-pro' },
  { icon: UserPlus, label: 'VCT Game Changers Team', id: 'game-changers' },
  { icon: Users2, label: 'Mixed-Gender Team', id: 'mixed' },
  { icon: Globe, label: 'Cross-Regional Team', id: 'cross-regional' },
  { icon: Star, label: 'Rising Star Team', id: 'rising' },
];

export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [playerData, setPlayerData] = useState<any[]>([]);
  const [additionalOutput, setAdditionalOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionClick = (option: string) => {
    const userMessage = `Build me a ${option}`;
    setMessage(userMessage);
    handleSubmit(userMessage);
  };

  const handleSubmit = async (userMessage: string) => {
    if (userMessage.trim()) {
      setLoading(true);
      setPlayerData([]);
      setAdditionalOutput('');
      setMessage(''); // Clear input immediately

      try {
        const response = await fetch('/api/bedrock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userMessage }),
        });

        if (response.ok) {
          const data = await response.json();

          // Parse and set the data
          if (data.result.playerData) {
            setPlayerData(data.result.playerData);
          }
          if (data.result.additionalOutput) {
            setAdditionalOutput(data.result.additionalOutput);
          }
        } else {
          const errorData = await response.json();
          console.error('Error from API:', errorData.error);
          setAdditionalOutput('An error occurred. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        setAdditionalOutput('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(message);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar code remains unchanged */}
      <nav className="nav-gradient border-b">
        {/* ... */}
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
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

          {loading && (
            <div className="flex justify-center items-center my-10">
              <Loader2 className="animate-spin w-6 h-6 mr-2" />
              <span>Building...</span>
            </div>
          )}

          {!loading && playerData.length > 0 && (
            <ScrollArea className="h-[500px] rounded-md border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {playerData.map((player, i) => (
                  <div key={i} className="card-enter" style={{ animationDelay: `${i * 0.1}s` }}>
                    <PlayerCard player={player} delay={i * 0.1} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {!loading && additionalOutput && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-primary">
                Additional Output
              </h2>
              <p className="text-gray-300">{additionalOutput}</p>
            </div>
          )}
        </div>

        <form onSubmit={onFormSubmit} className="flex space-x-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for a specific team composition..."
            className="flex-1"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onFormSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}