'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const league = searchParams.get('league') || "CBLOL";
  const year = searchParams.get('year') || "2024";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const allYears = Array.from({ length: currentYear - 2011 }, (_, i) => (currentYear - i).toString());

  // Lógica de Anos Disponíveis
  const availableYears = allYears.filter(y => {
    if (league === "CBLOL") return y !== "2025"; //
    if (league === "LTA South" || league === "LTA North") return y === "2025"; //
    if (league === "LCS") return parseInt(y) <= 2024; //
    return true;
  });

  useEffect(() => {
    if (!availableYears.includes(year)) {
      updateFilter('year', availableYears[0]);
    }
  }, [league, availableYears, year]);

  return (
    <div className="flex flex-wrap gap-4 mb-8 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Liga</label>
        <select 
          onChange={(e) => updateFilter('league', e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none focus:border-cyan-500"
          value={league}
        >
          <option value="CBLOL">CBLOL (Brasil)</option>
          <option value="LTA South">LTA South (BR 2025)</option>
          <option value="LTA North">LTA North (NA 2025)</option>
          <option value="LCS">LCS (NA antigo)</option>
          <option value="LCK">LCK (Coreia)</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Ano</label>
        <select 
          onChange={(e) => updateFilter('year', e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none focus:border-cyan-500"
          value={year}
        >
          {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">Split</label>
        <select 
          onChange={(e) => updateFilter('split', e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded border border-zinc-700 outline-none focus:border-cyan-500"
          value={searchParams.get('split') || "Split 1"}
        >
          <option value="Split 1">Split 1 / Spring</option>
          <option value="Split 2">Split 2 / Summer</option>
          <option value="Playoffs">Playoffs</option>
        </select>
      </div>
    </div>
  );
}