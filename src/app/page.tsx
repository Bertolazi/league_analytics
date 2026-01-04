import { CargoMatch } from "@/types/leaguepedia";
import { fetchLeaguepediaMatches } from "@/lib/leaguepedia";
import Filters from "@/components/Filters"; // Certifique-se de ter criado este arquivo

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

const league = typeof resolvedParams.league === 'string' ? resolvedParams.league : "CBLOL";
const year = typeof resolvedParams.year === 'string' ? resolvedParams.year : "2024";
const split = typeof resolvedParams.split === 'string' ? resolvedParams.split : "Split 1";

const matches = await fetchLeaguepediaMatches(league, year, split);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* HEADER */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 p-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tighter text-cyan-500">
            PROJETO VERÃO <span className="text-zinc-500">| ANALYTICS</span>
          </h1>
          <div className="text-xs bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full border border-cyan-500/20">
            LIVE DATA: LEAGUEPEDIA
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Análise de Confrontos</h2>
          <p className="text-zinc-400 mt-2">Selecione o campeonato e o tempo para filtrar os dados.</p>
        </header>

        {/* 4. COMPONENTE DE FILTROS (Onde o usuário muda o torneio/tempo) */}
        <Filters />

        {/* LISTA DE JOGOS */}
        <div className="grid gap-4">
          {matches.length > 0 ? (
            matches.map((match: CargoMatch, index: number) => (
              <div 
                key={index} 
                className="group bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center hover:border-cyan-500/50 transition-all shadow-sm"
              >
                <div className="flex flex-col mb-4 md:mb-0">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                    {match.Tournament}
                  </span>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                       <span className={`text-lg ${match.WinTeam === match.Team1 ? 'text-cyan-400 font-bold' : 'text-zinc-300'}`}>
                        {match.Team1}
                      </span>
                    </div>
                    
                    <span className="text-zinc-700 font-black italic">VS</span>

                    <div className="flex flex-col">
                      <span className={`text-lg ${match.WinTeam === match.Team2 ? 'text-cyan-400 font-bold' : 'text-zinc-300'}`}>
                        {match.Team2}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium text-zinc-300">Vencedor</p>
                    <p className="text-cyan-500 font-bold">{match.WinTeam}</p>
                  </div>
                  <span className="text-xs text-zinc-600 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                    {new Date(match.DateTime_UTC).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-500">Nenhuma partida encontrada para este filtro.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}