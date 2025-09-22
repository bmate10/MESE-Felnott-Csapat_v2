
export enum Availability {
  YES = 'Yes',
  NO = 'No',
  IF_NEEDED = 'If Needed',
}

export interface Player {
  id: string;
  name: string;
  rank: number;
}

export interface PlayerAvailability {
  playerId: string;
  status: Availability;
}

export interface MatchResult {
  playerIds: string[];
  opponentNames: string[];
  score: string;
  win: boolean;
}

export interface Match {
  id: string;
  opponent: string;
  location: string;
  date: string; // ISO string for simplicity
  availability: PlayerAvailability[];
  lineup?: {
    singles: (string | null)[];
    doubles: ([string, string] | [null, null])[];
  };
  results?: {
    teamScore: [number, number];
    matchResults: MatchResult[];
  };
  mvpVote?: Record<string, number>;
  mvp?: string;
}

export enum Season {
  SPRING = 'Spring',
  FALL = 'Fall',
}

export interface LeagueYearData {
  year: number;
  players: Player[];
  matches: {
    [Season.SPRING]: Match[];
    [Season.FALL]: Match[];
  };
}

export interface AppContextType {
  data: LeagueYearData;
  loading: boolean;
  currentSeason: Season;
  addPlayer: (name: string, rank: number) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
  deletePlayer: (playerId: string) => Promise<void>;
  addMatch: (season: Season, opponent: string, location: string, date: string) => Promise<void>;
  updateMatch: (season: Season, match: Match) => Promise<void>;
  deleteMatch: (season: Season, matchId: string) => Promise<void>;
  setPlayerAvailability: (season: Season, matchId: string, playerId: string, status: Availability) => Promise<void>;
}
