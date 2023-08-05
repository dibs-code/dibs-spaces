import { useMemo } from 'react';

const LeaderboardStage = ({ count }: { count: number }) => {
  const leftBoxes = useMemo(() => Array.from({ length: Math.ceil(count / 2.0) }), [count]);
  const rightBoxes = useMemo(() => Array.from({ length: count - leftBoxes.length }), [count, leftBoxes]);
  return useMemo(
    () => (
      <div className="leaderboard-stage flex w-full gap-2.5 h-full items-end">
        {leftBoxes.map((_, i) => (
          <div
            key={i}
            className={`leaderboard-spot__rank rounded-md flex-1 bg-gray6`}
            style={{ height: `${Math.min(100, ((i + 1) * 100) / (count - 1))}%` }}
          ></div>
        ))}
        {rightBoxes.map((_, i) => (
          <div
            key={i}
            className={`leaderboard-spot__rank rounded-md flex-1 bg-gray6`}
            style={{ height: `${((rightBoxes.length - i) * 100) / count}%` }}
          ></div>
        ))}
      </div>
    ),
    [count, leftBoxes, rightBoxes],
  );
};

export default LeaderboardStage;
