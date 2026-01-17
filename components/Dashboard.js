import { useMemo } from 'react';
import { getYear, getMonth, parseISO } from 'date-fns';

export default function Dashboard({ records }) {
    const totals = useMemo(() => {
        const now = new Date();
        const currentYear = getYear(now);
        const currentMonth = getMonth(now); // 0-indexed

        let yearTotal = 0;
        let monthTotal = 0;

        records.forEach(record => {
            // Ensure date is parsed correctly. Supabase returns YYYY-MM-DD
            const date = new Date(record.fecha);
            const rYear = getYear(date);
            const rMonth = getMonth(date);

            if (rYear === currentYear) {
                yearTotal += record.litros;
                if (rMonth === currentMonth) {
                    monthTotal += record.litros;
                }
            }
        });

        return { yearTotal, monthTotal, currentYear, currentMonth };
    }, [records]);

    // Month names in Spanish
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-colors"></div>
                <div className="relative z-10">
                    <h2 className="text-sm font-semibold text-cyan-200 uppercase tracking-widest mb-1">Total Año {totals.currentYear}</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-white tracking-tight">{totals.yearTotal.toFixed(1)}</span>
                        <span className="text-2xl font-medium text-cyan-200/80">L</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-200/60 font-medium">
                        <div className="h-1 w-12 bg-blue-500/50 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 w-2/3"></div>
                        </div>
                        <span>Acumulado anual</span>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors"></div>
                <div className="relative z-10">
                    <h2 className="text-sm font-semibold text-cyan-200 uppercase tracking-widest mb-1">Total {monthNames[totals.currentMonth]}</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-white tracking-tight">{totals.monthTotal.toFixed(1)}</span>
                        <span className="text-2xl font-medium text-cyan-200/80">L</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-blue-200/60 font-medium">
                        <div className="h-1 w-12 bg-blue-500/50 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 w-1/3"></div>
                        </div>
                        <span>Mes actual</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
