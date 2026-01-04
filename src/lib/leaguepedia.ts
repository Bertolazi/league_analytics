import { CargoMatch } from "@/types/leaguepedia";
import { cache } from 'react';

const BASE_URL = "https://lol.fandom.com/api.php";

// Usamos cache para evitar que o Next.js 16 dispare a mesma busca duas vezes no terminal
export const fetchLeaguepediaMatches = cache(async (league: string, year: string, split: string): Promise<CargoMatch[]> => {
  let searchLeague = league;
  let searchSplit = split;

  // 1. Mapeamento de Mudança de Nome (2025)
  if (year === "2025") {
    if (league === "CBLOL") searchLeague = "LTA South"; //
    if (league === "LCS") searchLeague = "LTA North";   //
  }

  // 2. Tradução de Splits Internacionais (Spring/Summer)
  const intlLitues = ["LCK", "LPL", "LEC", "LCS", "LTA North", "LTA South"];
  if (intlLitues.includes(searchLeague)) {
    if (split === "Split 1") searchSplit = "Spring";
    if (split === "Split 2") searchSplit = "Summer";
  }

  // Busca flexível com LIKE para evitar erros de nomenclatura exata
  const queryWhere = `SG.Tournament LIKE '%${searchLeague}%' AND SG.Tournament LIKE '%${year}%' AND SG.Tournament LIKE '%${searchSplit}%'`;

  const params = new URLSearchParams({
    action: "cargoquery",
    format: "json",
    tables: "ScoreboardGames=SG",
    fields: "SG.Tournament, SG.Team1, SG.Team2, SG.WinTeam, SG.DateTime_UTC",
    where: queryWhere,
    order_by: "SG.DateTime_UTC DESC",
    limit: "100"
  });

  console.log(`🔍 API: ${searchLeague} ${year} ${searchSplit}`);

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: { "User-Agent": "ProjetoVerao_Analytics_v5_Bertolazi" },
      next: { revalidate: 3600 } 
    });

    const data = await response.json();
    if (data.error || !data.cargoquery) return [];
    
    return data.cargoquery.map((item: any) => item.title as CargoMatch);
  } catch (error) {
    console.error("❌ Erro:", error);
    return [];
  }
}); // <-- Certifique-se de que este fechamento está exatamente assim