import { useState } from 'react';

export default function RainForm({ onAdd, isSaving }) {
    const today = new Date().toISOString().split('T')[0];
    const [fecha, setFecha] = useState(today);
    const [litros, setLitros] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!litros || isNaN(litros)) {
            setError('Introduce una cantidad válida');
            return;
        }

        onAdd({ fecha, litros: parseFloat(litros) });
        setLitros('');
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600"></div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                </div>
                Nuevo Registro
            </h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="glass-input w-full p-4 rounded-xl outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Litros (L/m²)</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.1"
                            value={litros}
                            onChange={(e) => setLitros(e.target.value)}
                            placeholder="0.0"
                            className="glass-input w-full p-4 rounded-xl outline-none"
                            required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">L</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSaving}
                className="w-full mt-8 glass-button font-bold py-4 px-6 rounded-xl flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSaving ? (
                    <>
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Guardando...</span>
                    </>
                ) : (
                    <>
                        <span>Guardar Registro</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                    </>
                )}
            </button>
        </form>
    );
}
