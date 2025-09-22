
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Player } from '../types';

const Players: React.FC = () => {
  const { data, addPlayer, updatePlayer, deletePlayer, loading } = useAppContext();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      deletePlayer(playerId);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Players</h1>
            <p className="text-lg text-gray-600 mt-1">Team Roster for {data.year}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Player
        </button>
      </header>
      
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{player.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button onClick={() => setEditingPlayer(player)} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(player.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingPlayer) && 
        <PlayerFormModal 
          player={editingPlayer} 
          onClose={() => { setShowAddModal(false); setEditingPlayer(null); }}
          onSave={async (name, rank) => {
            if (editingPlayer) {
              await updatePlayer({ ...editingPlayer, name, rank });
            } else {
              await addPlayer(name, rank);
            }
          }}
          loading={loading}
        />
      }
    </div>
  );
};

interface PlayerFormModalProps {
    player: Player | null;
    onClose: () => void;
    onSave: (name: string, rank: number) => Promise<void>;
    loading: boolean;
}

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({ player, onClose, onSave, loading }) => {
    const [name, setName] = useState(player?.name || '');
    const [rank, setRank] = useState(player?.rank || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name && rank > 0) {
            await onSave(name, rank);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full modal-content">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800">{player ? 'Edit Player' : 'Add New Player'}</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Player Name</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="rank" className="block text-sm font-medium text-gray-700">Rank</label>
                                <input type="number" id="rank" value={rank} onChange={e => setRank(parseInt(e.target.value, 10) || 0)} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? 'Saving...' : 'Save Player'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Players;
