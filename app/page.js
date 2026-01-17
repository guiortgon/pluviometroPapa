"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Dashboard from "@/components/Dashboard";
import RainForm from "@/components/RainForm";
import RecordList from "@/components/RecordList";
import AuthForm from "@/components/AuthForm";

export default function Home() {
    const [session, setSession] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

    // Check auth and fetch records
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchRecords();
            else setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchRecords();
            else setRecords([]);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("registros")
                .select("*")
                .order("fecha", { ascending: false });

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error("Error al cargar registros:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add record
    const handleAddRecord = async (newRecord) => {
        try {
            setIsSaving(true);
            // user_id is automatically added by backend RLS with default auth.uid()
            // but explicitly: newRecord should trigger the RLS check

            const { data, error } = await supabase
                .from("registros")
                .insert([newRecord]) // RLS will attach user_id via default or we rely on policy
                .select();

            if (error) throw error;

            fetchRecords();
        } catch (error) {
            console.error("Error al guardar:", error.message);
            alert("Error al guardar el registro.");
        } finally {
            setIsSaving(false);
        }
    };

    // Delete record
    const handleDeleteRecord = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este registro?")) return;

        try {
            setIsDeleting(id);
            const { error } = await supabase
                .from("registros")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setRecords(records.filter((r) => r.id !== id));
        } catch (error) {
            console.error("Error al eliminar:", error.message);
            alert("Error al eliminar el registro.");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (!session && !loading) {
        return (
            <div className="min-h-screen p-6 flex flex-col items-center justify-center">
                <header className="mb-8 text-center animate-fade-in">
                    <div className="inline-flex bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-2xl shadow-xl shadow-cyan-500/20 mb-4 relative">
                        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-lg"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white relative z-10"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" /></svg>
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Pluviómetro</h1>
                    <p className="text-cyan-200">Tu registro personal de lluvias</p>
                </header>
                <AuthForm />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row items-center justify-between animate-fade-in gap-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" /></svg>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Pluviómetro</h1>
                        <p className="text-cyan-200 text-sm font-medium">{session?.user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="glass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 !bg-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Cerrar Sesión
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-cyan-400"></div>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <Dashboard records={records} />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4">
                            <RainForm onAdd={handleAddRecord} isSaving={isSaving} />
                        </div>

                        <div className="lg:col-span-8">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                                    Historial de Registros
                                </h3>
                                <span className="text-sm text-blue-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                                    {records.length} registros
                                </span>
                            </div>
                            <RecordList
                                records={records}
                                onDelete={handleDeleteRecord}
                                isDeleting={isDeleting}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
