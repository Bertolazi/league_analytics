'use client'
import { useRouter, useSearchParams } from 'next/navigation';

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`); // Atualiza a URL
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      {/* Seleção de Campeonato */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Campeonato</label>
        <select 
          onChange={(e) => updateFilter('tournament', e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none focus:border-cyan-500"
          defaultValue={searchParams.get('tournament') || "CBLOL 2025 Split 2"}
        >
          <option value="CBLOL 2025 Split 2">CBLOL Split 2</option>
          <option value="CBLOL 2025 Split 1">CBLOL Split 1</option>
          <option value="LCK 2025 Summer">LCK Summer</option>
          <option value="LPL 2025 Summer">LPL Summer</option>
          <option value="Demacia Cup 2025">Demacia Cup</option>
        </select>
      </div>

      {/* Intervalo de Tempo */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Período</label>
        <select 
          onChange={(e) => updateFilter('days', e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none focus:border-cyan-500"
          defaultValue={searchParams.get('days') || "30"}
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 3 meses</option>
        </select>
      </div>
    </div>
  );
}