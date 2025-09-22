
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Match, Season } from '../types';
import MatchCard from '../components/matches/MatchCard';

const Matches: React.FC = () => {
  const { data, currentSeason } = useAppContext();
  const [activeSeason, setActiveSeason] = useState<Season>(currentSeason);

  const upcomingMatches = useMemo(() => {
    return data.matches[activeSeason]
      .filter(m => new Date(m.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.matches, activeSeason]);

  const pastMatches = useMemo(() => {
    return data.matches[activeSeason]
      .filter(m => new Date(m.date) < new Date())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.matches, activeSeason]);

  const SeasonTab: React.FC<{ season: Season }> = ({ season }) => (
    <button
      onClick={() => setActiveSeason(season)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeSeason === season
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {season} Season
    </button>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
            <p className="text-lg text-gray-600 mt-1">Schedule and results for {data.year}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gray-200 p-1 rounded-lg">
          <SeasonTab season={Season.SPRING} />
          <SeasonTab season={Season.FALL} />
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Upcoming Matches</h2>
        {upcomingMatches.length > 0 ? (
          <div className="space-y-4">
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} season={activeSeason} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No upcoming matches for the {activeSeason} season.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Past Matches</h2>
        {pastMatches.length > 0 ? (
          <div className="space-y-4">
            {pastMatches.map(match => (
              <MatchCard key={match.id} match={match} season={activeSeason} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No past matches for the {activeSeason} season.</p>
        )}
      </section>
    </div>
  );
};

export default Matches;
