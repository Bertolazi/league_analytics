export interface CargoMatch {
  Tournament: string;
  Team1: string;
  Team2: string;
  WinTeam: string;
  DateTime_UTC: string;
  MatchId?: string;
}

export interface PlayerStats {
  Name: string;
  Champion: string;
  Kills: number;
  Deaths: number;
  Assists: number;
  Team: string;
}
