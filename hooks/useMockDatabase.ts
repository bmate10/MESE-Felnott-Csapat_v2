
import { useState, useCallback, useMemo } from 'react';
import { LeagueYearData, Player, Match, Season, Availability } from '../types';

const initialData: LeagueYearData = {
  year: 2024,
  players: [
    { id: 'p1', name: 'Alex Johnson', rank: 1 },
    { id: 'p2', name: 'Ben Carter', rank: 2 },
    { id: 'p3', name: 'Chris Davis', rank: 3 },
    { id: 'p4', name: 'David Evans', rank: 4 },
    { id: 'p5', name: 'Ethan Foster', rank: 5 },
    { id: 'p6', name: 'Frank Green', rank: 6 },
    { id: 'p7', name: 'George Hill', rank: 7 },
    { id: 'p8', name: 'Henry Ian', rank: 8 },
  ],
  matches: {
    [Season.SPRING]: [
      {
        id: 'm1s',
        opponent: 'Eagles TC',
        location: 'Home',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        availability: [
          { playerId: 'p1', status: Availability.YES }, { playerId: 'p2', status: Availability.YES },
          { playerId: 'p3', status: Availability.YES }, { playerId: 'p4', status: Availability.YES },
          { playerId: 'p5', status: Availability.YES }, { playerId: 'p6', status: Availability.YES },
          { playerId: 'p7', status: Availability.NO }, { playerId: 'p8', status: Availability.IF_NEEDED },
        ],
        lineup: { singles: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'], doubles: [['p1', 'p2'], ['p3', 'p4'], ['p5', 'p6']] },
        results: { teamScore: [7, 2], matchResults: [] },
        mvp: 'p2',
      },
      {
        id: 'm2s',
        opponent: 'Lions Tennis',
        location: 'Away',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        availability: [
           { playerId: 'p1', status: Availability.YES }, { playerId: 'p2', status: Availability.YES },
        ],
      },
    ],
    [Season.FALL]: [
        {
        id: 'm1f',
        opponent: 'Eagles TC',
        location: 'Away',
        date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        availability: [],
      },
    ],
  },
};

const FAKE_DB_LATENCY = 300;

export const useMockDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LeagueYearData>(initialData);

  const currentSeason = useMemo(() => {
    const month = new Date().getMonth();
    return month >= 1 && month <= 6 ? Season.SPRING : Season.FALL;
  }, []);

  const withLoading = async <T,>(fn: () => Promise<T> | T): Promise<T> => {
    setLoading(true);
    return new Promise(resolve => {
        setTimeout(() => {
            const result = fn();
            setLoading(false);
            resolve(result);
        }, FAKE_DB_LATENCY);
    });
  };

  const addPlayer = useCallback(async (name: string, rank: number) => {
    await withLoading(() => {
        setData(prev => {
            const newPlayer: Player = { id: `p${Date.now()}`, name, rank };
            const updatedPlayers = [...prev.players, newPlayer].sort((a, b) => a.rank - b.rank);
            return { ...prev, players: updatedPlayers };
        });
    });
  }, []);

  const updatePlayer = useCallback(async (playerToUpdate: Player) => {
    await withLoading(() => {
        setData(prev => ({
            ...prev,
            players: prev.players.map(p => p.id === playerToUpdate.id ? playerToUpdate : p).sort((a,b) => a.rank - b.rank),
        }));
    });
  }, []);
  
  const deletePlayer = useCallback(async (playerId: string) => {
    await withLoading(() => {
        setData(prev => ({ ...prev, players: prev.players.filter(p => p.id !== playerId) }));
    });
  }, []);

  const addMatch = async (season: Season, opponent: string, location: string, date: string) => {
    await withLoading(() => {
        setData(prev => {
            const newMatch: Match = { id: `m${Date.now()}`, opponent, location, date, availability: [] };
            return { ...prev, matches: { ...prev.matches, [season]: [...prev.matches[season], newMatch] }};
        });
    });
  };

  const updateMatch = async (season: Season, matchToUpdate: Match) => {
      await withLoading(() => {
        setData(prev => ({
            ...prev,
            matches: {
                ...prev.matches,
                [season]: prev.matches[season].map(m => m.id === matchToUpdate.id ? matchToUpdate : m),
            }
        }))
      });
  };

  const deleteMatch = async (season: Season, matchId: string) => {
    await withLoading(() => {
        setData(prev => ({
            ...prev,
            matches: {
                ...prev.matches,
                [season]: prev.matches[season].filter(m => m.id !== matchId),
            }
        }));
    });
  };

  const setPlayerAvailability = async (season: Season, matchId: string, playerId: string, status: Availability) => {
      await withLoading(() => {
          setData(prev => {
              const newMatches = { ...prev.matches };
              const seasonMatches = [...newMatches[season]];
              const matchIndex = seasonMatches.findIndex(m => m.id === matchId);
              if (matchIndex === -1) return prev;

              const match = { ...seasonMatches[matchIndex] };
              const availability = [...match.availability];
              const playerStatusIndex = availability.findIndex(a => a.playerId === playerId);

              if (playerStatusIndex > -1) {
                  availability[playerStatusIndex] = { playerId, status };
              } else {
                  availability.push({ playerId, status });
              }

              match.availability = availability;
              seasonMatches[matchIndex] = match;
              newMatches[season] = seasonMatches;

              return { ...prev, matches: newMatches };
          });
      });
  };


  return { data, loading, currentSeason, addPlayer, updatePlayer, deletePlayer, addMatch, updateMatch, deleteMatch, setPlayerAvailability };
};
