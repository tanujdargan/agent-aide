"use client";

import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PlayerCardProps {
  player: {
    ign: string;
    name: string;
    team: string;
    role: string;
    agents: string[];
    metrics: {
      impact: number;
      flexibility: number;
      consistency: number;
    };
    image: string;
  };
  delay?: number;
}

export default function PlayerCard({ player, delay = 0 }: PlayerCardProps) {
  // Ensure that metrics are available and have default values if not
  const metrics = player.metrics || {
    impact: 0,
    flexibility: 0,
    consistency: 0,
  };

  return (
    <Card className="p-3 hover:border-primary transition-colors">
      <div className="flex items-start space-x-2">
        <Avatar className="w-12 h-12 border-2 border-primary">
          <img src={player.image || "/default-avatar.png"} alt={player.ign} className="object-cover" />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-primary truncate">{player.ign}</h3>
          <p className="text-xs text-muted-foreground truncate">{player.name}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="secondary" className="text-xs">{player.team}</Badge>
            <Badge variant="outline" className="text-xs">{player.role}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Impact</span>
            <span className="text-primary">{metrics.impact}%</span>
          </div>
          <Progress value={metrics.impact} className="h-1" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Flexibility</span>
            <span className="text-primary">{metrics.flexibility}%</span>
          </div>
          <Progress value={metrics.flexibility} className="h-1" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Consistency</span>
            <span className="text-primary">{metrics.consistency}%</span>
          </div>
          <Progress value={metrics.consistency} className="h-1" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium mb-1">Agent Pool</p>
        <div className="flex flex-wrap gap-1">
          {player.agents && player.agents.map((agent) => (
            <Badge key={agent} variant="secondary" className="text-xs">
              {agent}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}