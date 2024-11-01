import React, { useState } from 'react';
import { Clock, Users, Swords } from 'lucide-react';
import { GameMode, GameSettings, Player, Team } from '../types';

interface GameSetupProps {
  onComplete: (settings: GameSettings) => void;
}

const DURATION_OPTIONS = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
  { value: 180, label: '3 minutes' },
  { value: 300, label: '5 minutes' },
];

export const GameSetup: React.FC<GameSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<GameSettings>({
    duration: 60,
    mode: 'solo',
    players: [],
    teams: [],
  });

  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');

  const handleModeSelect = (mode: GameMode) => {
    setSettings({ ...settings, mode });
    setStep(2);
  };

  const handleDurationSelect = (duration: number) => {
    setSettings({ ...settings, duration });
    if (settings.mode === 'solo') {
      onComplete(settings);
    } else {
      setStep(3);
    }
  };

  const addPlayer = () => {
    if (!playerName.trim()) return;
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: playerName,
      score: 0,
    };

    if (settings.mode === 'versus') {
      setSettings({
        ...settings,
        players: [...(settings.players || []), newPlayer],
      });
    }
    
    setPlayerName('');
    
    if (settings.mode === 'versus' && settings.players?.length === 1) {
      onComplete(settings);
    }
  };

  const addTeam = () => {
    if (!teamName.trim()) return;
    
    const newTeam: Team = {
      id: Date.now().toString(),
      name: teamName,
      players: [],
      score: 0,
    };

    setSettings({
      ...settings,
      teams: [...(settings.teams || []), newTeam],
    });
    setTeamName('');
  };

  const addPlayerToTeam = (teamId: string) => {
    if (!playerName.trim()) return;

    const updatedTeams = settings.teams?.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          players: [
            ...team.players,
            { id: Date.now().toString(), name: playerName, score: 0 },
          ],
        };
      }
      return team;
    });

    setSettings({ ...settings, teams: updatedTeams });
    setPlayerName('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Select Game Mode</h2>
          <button
            onClick={() => handleModeSelect('solo')}
            className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Solo Play
          </button>
          <button
            onClick={() => handleModeSelect('versus')}
            className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            1 vs 1
          </button>
          <button
            onClick={() => handleModeSelect('teams')}
            className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            Teams
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Select Duration</h2>
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDurationSelect(option.value)}
              className="w-full p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" />
              {option.label}
            </button>
          ))}
        </div>
      )}

      {step === 3 && settings.mode === 'versus' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Add Players</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addPlayer}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Players:</h3>
            {settings.players?.map((player) => (
              <div key={player.id} className="p-2 bg-gray-100 rounded mb-2">
                {player.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && settings.mode === 'teams' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Create Teams</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addTeam}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add Team
            </button>
          </div>

          {settings.teams?.map((team) => (
            <div key={team.id} className="p-4 bg-gray-100 rounded mb-4">
              <h3 className="font-semibold mb-2">{team.name}</h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Add player to team"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => addPlayerToTeam(team.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {team.players.map((player) => (
                  <div key={player.id} className="p-2 bg-white rounded">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {settings.teams && settings.teams.length >= 2 && (
            <button
              onClick={() => onComplete(settings)}
              className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Game
            </button>
          )}
        </div>
      )}
    </div>
  );
};