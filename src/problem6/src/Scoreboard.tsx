import React, { useState, useEffect } from 'react';

// --- Type Definitions ---
type UserScore = {
  id: string;
  username: string;
  score: number;
};

// --- Mock Data ---
const initialScores: UserScore[] = [
  { id: 'user-1', username: 'Alice', score: 1050 },
  { id: 'user-2', username: 'Bob', score: 980 },
  { id: 'user-3', username: 'Charlie', score: 975 },
  { id: 'user-4', username: 'David', score: 850 },
  { id: 'user-5', username: 'Eve', score: 845 },
  { id: 'user-6', username: 'Frank', score: 760 },
  { id: 'user-7', username: 'Grace', score: 755 },
  { id: 'user-8', username: 'Heidi', score: 650 },
  { id: 'user-9', username: 'Ivan', score: 640 },
  { id: 'user-10', username: 'Judy', score: 590 },
];

// --- Mock API / WebSocket Simulation ---
const mockApi = {
  // Simulate getting initial data
  getTopScores: (): Promise<UserScore[]> => Promise.resolve(initialScores),

  // Simulate a live update feed (e.g., from a WebSocket)
  onScoreUpdate: (callback: (updatedScore: UserScore) => void) => {
    const intervalId = setInterval(() => {
      // Pick a random user to update
      const randomUserIndex = Math.floor(Math.random() * initialScores.length);
      const userToUpdate = initialScores[randomUserIndex];

      // Increase their score by a random amount
      const newScore = {
        ...userToUpdate,
        score: userToUpdate.score + Math.floor(Math.random() * 20) + 1,
      };

      callback(newScore);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(intervalId); // Cleanup function
  },

  // Simulate the current user performing an action
  updateMyScore: (currentUser: UserScore): Promise<UserScore> => {
    const updatedUser = {
        ...currentUser,
        score: currentUser.score + 50, // Add a fixed amount for the action
    };
    return Promise.resolve(updatedUser);
  },
};

// --- Components ---
const ScoreboardRow: React.FC<{ rank: number; user: UserScore; isCurrentUser: boolean; isUpdated: boolean; }> = ({ rank, user, isCurrentUser, isUpdated }) => (
  <div className={`scoreboard-row ${isCurrentUser ? 'user-highlight' : ''}`}>
    <span className="username">{rank}. {user.username}</span>
    <span className={`score ${isUpdated ? 'score-flash' : ''}`}>{user.score}</span>
  </div>
);

const Scoreboard: React.FC = () => {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [currentUser, setCurrentUser] = useState<UserScore>({ id: 'user-11', username: 'You', score: 450 });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedId, setUpdatedId] = useState<string | null>(null);

  const triggerUpdateAnimation = (id: string) => {
    setUpdatedId(id);
    setTimeout(() => setUpdatedId(null), 700); // Duration of the flash animation
  };

  useEffect(() => {
    mockApi.getTopScores().then(initialData => {
      const allScores = [...initialData, currentUser].sort((a, b) => b.score - a.score);
      setScores(allScores);
    });

    const unsubscribe = mockApi.onScoreUpdate(updatedScore => {
      setScores(prevScores => {
        const newScores = prevScores.map(s => (s.id === updatedScore.id ? updatedScore : s));
        return newScores.sort((a, b) => b.score - a.score);
      });
      triggerUpdateAnimation(updatedScore.id);
    });

    return unsubscribe;
  }, []); // currentUser is not in deps to avoid re-subscribing

  const handleActionClick = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    // Simulate action delay
    setTimeout(async () => {
      const updatedUser = await mockApi.updateMyScore(currentUser);
      setCurrentUser(updatedUser);

      setScores(prevScores => {
        const userExists = prevScores.some(s => s.id === updatedUser.id);
        const newScores = userExists
          ? prevScores.map(s => (s.id === updatedUser.id ? updatedUser : s))
          : [...prevScores, updatedUser];
        return newScores.sort((a, b) => b.score - a.score);
      });

      triggerUpdateAnimation(updatedUser.id);
      setIsUpdating(false);
    }, 1000);
  };

  const top10 = scores.slice(0, 10);

  return (
    <div className="scoreboard-container">
      <h2 className="scoreboard-header">Top 10 Scores</h2>
      <div>
        {top10.map((user, index) => (
          <ScoreboardRow
            key={user.id}
            rank={index + 1}
            user={user}
            isCurrentUser={user.id === currentUser.id}
            isUpdated={user.id === updatedId}
          />
        ))}
      </div>
      <div className="user-actions">
        <p>Your Score: {currentUser.score}</p>
        <button className="action-button" onClick={handleActionClick} disabled={isUpdating}>
          {isUpdating ? 'Performing Action...' : 'Perform Action (+50 pts)'}
        </button>
      </div>
    </div>
  );
};

export default Scoreboard;
