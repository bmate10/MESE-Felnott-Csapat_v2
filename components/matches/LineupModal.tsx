
import React, { useState, useMemo } from 'react';
import { Match, Season, Availability } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface LineupModalProps {
  match: Match;
  season: Season;
  onClose: () => void;
}

const LineupModal: React.FC<LineupModalProps> = ({ match, season, onClose }) => {
  const { data, updateMatch, loading } = useAppContext();
  const [singles, setSingles] = useState<(string | null)[]>(match.lineup?.singles || Array(6).fill(null));
  const [doubles, setDoubles] = useState<([string, string] | [null, null])[]>(match.lineup?.doubles || Array(3).fill([null, null]));

  const availablePlayers = useMemo(() => {
    const availableIds = new Set(match.availability
      .filter(a => a.status === Availability.YES || a.status === Availability.IF_NEEDED)
      .map(a => a.playerId)
    );
    return data.players.filter(p => availableIds.has(p.id));
  }, [data.players, match.availability]);

  const handleSave = async () => {
    const updatedMatch = { ...match, lineup: { singles, doubles } };
    await updateMatch(season, updatedMatch);
    onClose();
  };
  
  const handleSinglesChange = (index: number, value: string) => {
    const newSingles = [...singles];
    newSingles[index] = value === "" ? null : value;
    setSingles(newSingles);
  }
  
  const handleDoublesChange = (pairIndex: number, playerIndex: number, value: string) => {
    const newDoubles = [...doubles] as ([string, string] | [string | null, string | null])[];
    newDoubles[pairIndex][playerIndex] = value === "" ? null : value;
    setDoubles(newDoubles as ([string, string] | [null, null])[]);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Set Lineup</h2>
          <p className="text-gray-600">vs {match.opponent} on {new Date(match.date).toLocaleDateString()}</p>
        </div>

        <div className="px-6 pb-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Singles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {singles.map((playerId, i) => (
                <div key={`s-${i}`} className="flex items-center space-x-2">
                  <label className="w-8 font-medium text-gray-600">{i + 1}.</label>
                  <select value={playerId || ''} onChange={(e) => handleSinglesChange(i, e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option value="">-- Select Player --</option>
                    {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.name} (Rank {p.rank})</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Doubles</h3>
            <div className="space-y-4">
              {doubles.map((pair, i) => (
                <div key={`d-${i}`} className="flex items-center space-x-2">
                  <label className="w-8 font-medium text-gray-600">{i + 1}.</label>
                  <select value={pair[0] || ''} onChange={(e) => handleDoublesChange(i, 0, e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option value="">-- Player 1 --</option>
                    {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <span className="text-gray-500">&</span>
                  <select value={pair[1] || ''} onChange={(e) => handleDoublesChange(i, 1, e.target.value)} className="w-full p-2 border rounded-md bg-white">
                    <option value="">-- Player 2 --</option>
                    {availablePlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Saving...' : 'Save Lineup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineupModal;
