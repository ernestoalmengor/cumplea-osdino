import React, { useState, useEffect } from "react";
import { Users, Copy, CheckCircle, Clock } from "lucide-react";

const Admin = () => {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // La URL del Apps Script que procesa los datos
  const urlAppScript = "https://script.google.com/macros/s/AKfycbz8dBEXRWwzWcR33laXORLVPsSJR-D2gfovNwy5mtXFjMZLWUlmmN3-zbZ6CdonNp7ECA/exec";

  useEffect(() => {
    const fetchInvitados = async () => {
      try {
        const response = await fetch(`${urlAppScript}?action=getGuests`);
        if (!response.ok) {
          throw new Error("Error en la petición");
        }
        const data = await response.json();
        setInvitados(data);
      } catch (err) {
        setError("Error al cargar la lista de invitados. Asegúrate de actualizar el Google Apps Script.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitados();
  }, []);

  const handleCopyLink = (invitado) => {
    // Tomamos la URL base actual de forma dinámica, quitando el hash y query params
    const currentUrl = window.location.href.split('#')[0].split('?')[0];
    
    // Generamos el link usando el formato del HashRouter
    const link = `${currentUrl}#/?id=${invitado.id}&family=${encodeURIComponent(invitado.invitacion)}&pass=${invitado.pases}`;
    
    navigator.clipboard.writeText(link).then(() => {
      alert(`Enlace copiado para: ${invitado.invitacion}\n\nLink: ${link}`);
    }).catch(err => {
      console.error("No se pudo copiar el texto: ", err);
      prompt("Copia el siguiente enlace manualmente:", link);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Users className="w-10 h-10 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Cargando invitados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Invitado</th>
                    <th className="p-4 font-semibold text-center">Pases Asignados</th>
                    <th className="p-4 font-semibold text-center">Confirmados</th>
                    <th className="p-4 font-semibold text-center">Estado</th>
                    <th className="p-4 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invitados.map((invitado) => {
                    const confirmados = parseInt(invitado.confirmados) || 0;
                    const haConfirmado = invitado.confirmados !== "" && invitado.confirmados !== null && invitado.confirmados !== undefined;

                    return (
                      <tr key={invitado.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 text-slate-500 font-medium">#{invitado.id}</td>
                        <td className="p-4 font-bold text-slate-700">{invitado.invitacion}</td>
                        <td className="p-4 text-center">
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
                            {invitado.pases}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {haConfirmado ? (
                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full font-bold text-sm">
                              {confirmados}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {haConfirmado ? (
                            <div className="flex items-center justify-center gap-1 text-green-500 text-sm font-bold">
                              <CheckCircle size={16} /> Confirmado
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-orange-400 text-sm font-bold">
                              <Clock size={16} /> Pendiente
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleCopyLink(invitado)}
                            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md"
                          >
                            <Copy size={16} /> Copiar Link
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {invitados.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  No se encontraron invitados en la hoja de cálculo.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
