"use client";

interface StatsPanelProps {
  stats: {
    dishStats: Map<string, number>;
  };
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid gap-6 p-6 bg-white rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium mb-2">Dish Statistics</h3>
        <div className="grid gap-2">
          {Array.from(stats.dishStats.entries())
            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
            .map(([dish, count]) => (
              <div key={dish} className="flex justify-between items-center">
                <span>{dish}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
