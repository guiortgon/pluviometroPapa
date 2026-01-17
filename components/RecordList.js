import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function RecordList({ records, onDelete, isDeleting }) {
    if (records.length === 0) {
        return (
            <div className="glass-panel text-center py-16 rounded-2xl flex flex-col items-center justify-center text-blue-200/60">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" /></svg>
                <p className="text-lg font-medium">No hay registros de lluvia aún.</p>
                <p className="text-sm mt-1">Añade el primero usando el formulario.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 text-left">
                            <th className="px-6 py-5 text-xs font-semibold text-blue-200 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-5 text-xs font-semibold text-blue-200 uppercase tracking-wider">Litros</th>
                            <th className="px-6 py-5 text-right text-xs font-semibold text-blue-200 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4 text-slate-100">
                                    <div className="flex flex-col">
                                        <span className="capitalize font-medium text-lg">
                                            {format(new Date(record.fecha), "d 'of' MMMM", { locale: es })}
                                        </span>
                                        <span className="text-xs text-slate-400 capitalize">
                                            {format(new Date(record.fecha), "EEEE, yyyy", { locale: es })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                                        </div>
                                        <span className="font-bold text-xl text-white">
                                            {record.litros}
                                        </span>
                                        <span className="text-sm text-slate-400">L/m²</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onDelete(record.id)}
                                        disabled={isDeleting === record.id}
                                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Eliminar"
                                    >
                                        {isDeleting === record.id ? (
                                            <div className="h-4 w-4 border-2 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
