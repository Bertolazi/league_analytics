import { CargoMatch } from "@/types/leaguepedia";

const BASE_URL = "https://lol.fandom.com/api.php";

export async function fetchLeaguepediaMatches(
  tournament: string, 
  days: number        
): Promise<CargoMatch[]> {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateStr = date.toISOString().replace('T', ' ').split('.')[0];

  const params = new URLSearchParams({
    action: "cargoquery",
    format: "json",
    tables: "ScoreboardGames=SG",
    fields: "SG.Tournament, SG.Team1, SG.Team2, SG.WinTeam, SG.DateTime_UTC",
    // Filtro dinâmico: Torneio AND Data
    where: `SG.Tournament = '${tournament}' AND SG.DateTime_UTC >= '${dateStr}'`,
    order_by: "SG.DateTime_UTC DESC",
    limit: "50"
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        // MUDE ESTE USER-AGENT para algo bem específico seu
        "User-Agent": "AnalyticsBetLoL_Project_Verao_v1" 
      },
      next: { revalidate: 60 } // Cache de 1 minuto
    });

    const data = await response.json();

    // DEBUG: Veja no seu terminal o que a API realmente respondeu
    // console.log("Resposta da API:", JSON.stringify(data, null, 2));

    // 1. Verifica se a API retornou um erro estruturado (como Rate Limit)
    if (data.error) {
      console.error("❌ Erro reportado pela API:", data.error.code, "-", data.error.info);
      return [];
    }

    // 2. Verifica se 'cargoquery' existe e é uma lista antes de usar o .map()
    if (!data.cargoquery || !Array.isArray(data.cargoquery)) {
      console.warn("⚠️ A API retornou sucesso, mas sem dados (cargoquery vazio).");
      return [];
    }

    return data.cargoquery.map((item: any) => item.title as CargoMatch);

  } catch (error) {
    console.error("❌ Falha crítica na requisição:", error);
    return [];
  }
}