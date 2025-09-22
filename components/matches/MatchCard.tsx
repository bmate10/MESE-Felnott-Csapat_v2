
import React, { useMemo, useState } from 'react';
import { Match, Season, Availability } from '../../types';
import { useAppContext } from '../../context/AppContext';
import LineupModal from './LineupModal';

const MatchCard: React.FC<{ match: Match; season: Season }> = ({ match, season }) => {
  const { data } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLineupModal, setShowLineupModal] = useState(false);

  const isPast = useMemo(() => new Date(match.date) < new Date(), [match.date]);

  const availabilitySummary = useMemo(() => {
    const yes = match.availability.filter(a => a.status === Availability.YES).length;
    const ifNeeded = match.availability.filter(a => a.status === Availability.IF_NEEDED).length;
    return { yes, ifNeeded };
  }, [match.availability]);
  
  const getPlayerName = (id: string) => data.players.find(p => p.id === id)?.name || 'Unknown Player';

  const MvpDisplay: React.FC = () => {
    if (!match.mvp) return null;
    return (
        <div className="flex items-center text-sm font-medium text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            MVP: {getPlayerName(match.mvp)}
        </div>
    );
  };

  const ResultDisplay: React.FC = () => {
    if (!match.results) return null;
    const won = match.results.teamScore[0] > match.results.teamScore[1];
    return (
        <div className={`text-lg font-bold px-3 py-1 rounded-md ${won ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
            {won ? 'W' : 'L'} {match.results.teamScore.join(' - ')}
        </div>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-semibold text-lg text-gray-800">vs {match.opponent}</p>
              <p className="text-sm text-gray-500">{match.location} | {new Date(match.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                {isPast ? <ResultDisplay /> : (
                    <div className="text-right">
                        <p className="font-medium text-gray-700">{availabilitySummary.yes} Available</p>
                        <p className="text-sm text-gray-500">{availabilitySummary.ifNeeded} Reserves</p>
                    </div>
                )}
                {isPast && <MvpDisplay />}
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        {isExpanded && (
            <div className="mt-4 pt-4 border-t">
                {/* Detailed view - can add availability signup, lineup view etc. here */}
                <h4 className="font-semibold mb-2">Details</h4>
                 {!isPast && (
                    <div className="text-sm">
                        <button onClick={() => setShowLineupModal(true)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors">Set Lineup</button>
                    </div>
                 )}
                 {match.lineup && (
                    <div className="text-sm mt-2">
                        <p><strong>Lineup set.</strong></p>
                    </div>
                 )}
                 <p className="text-sm mt-2">More actions like 'Enter Results' or 'Vote MVP' would go here.</p>
            </div>
        )}
      </div>
      {showLineupModal && <LineupModal match={match} season={season} onClose={() => setShowLineupModal(false)} />}
    </>
  );
};

export default MatchCard;
