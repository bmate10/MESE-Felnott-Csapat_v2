
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Match, Season } from '../types';

const Dashboard: React.FC = () => {
  const { data, currentSeason } = useAppContext();

  const allMatches = useMemo(() => {
    return [...data.matches[Season.SPRING], ...data.matches[Season.FALL]];
  }, [data.matches]);

  const upcomingMatches = useMemo(() => {
    return allMatches
      .filter(m => new Date(m.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  }, [allMatches]);

  const pastMatches = useMemo(() => {
    return allMatches
      .filter(m => new Date(m.date) < new Date() && m.results)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allMatches]);

  const stats = useMemo(() => {
    const totalPlayed = pastMatches.length;
    if (totalPlayed === 0) {
      return { wins: 0, losses: 0, winRate: '0%' };
    }
    const wins = pastMatches.filter(m => m.results && m.results.teamScore[0] > m.results.teamScore[1]).length;
    const losses = totalPlayed - wins;
    const winRate = ((wins / totalPlayed) * 100).toFixed(0) + '%';
    return { wins, losses, winRate };
  }, [pastMatches]);
  
  const StatCard: React.FC<{ title: string; value: string | number; subtext?: string }> = ({ title, value, subtext }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-1">
          {currentSeason} Season {data.year} Overview
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Win Rate" value={stats.winRate} />
        <StatCard title="Matches Won" value={stats.wins} subtext={`${pastMatches.length} played`} />
        <StatCard title="Matches Lost" value={stats.losses} subtext={`${pastMatches.length} played`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Matches</h2>
          <div className="space-y-4">
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map(match => <UpcomingMatchCard key={match.id} match={match} />)
            ) : (
              <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm border">No upcoming matches scheduled.</p>
            )}
          </div>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Results</h2>
          <div className="space-y-4">
            {pastMatches.length > 0 ? (
              pastMatches.slice(0, 3).map(match => <PastMatchCard key={match.id} match={match} />)
            ) : (
              <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm border">No past match results available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const UpcomingMatchCard: React.FC<{ match: Match }> = ({ match }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
    <div>
      <p className="font-semibold text-gray-800">vs {match.opponent}</p>
      <p className="text-sm text-gray-500">{match.location} | {new Date(match.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
    </div>
    <div className="text-right">
       <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">Upcoming</span>
    </div>
  </div>
);

const PastMatchCard: React.FC<{ match: Match }> = ({ match }) => {
    const won = match.results && match.results.teamScore[0] > match.results.teamScore[1];
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="font-semibold text-gray-800">vs {match.opponent}</p>
                <p className="text-sm text-gray-500">{new Date(match.date).toLocaleDateString()}</p>
            </div>
            <div className={`text-lg font-bold ${won ? 'text-green-600' : 'text-red-600'}`}>
                {won ? 'W' : 'L'} {match.results?.teamScore.join(' - ')}
            </div>
        </div>
    );
}


export default Dashboard;
