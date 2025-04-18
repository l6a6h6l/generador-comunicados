import React, { useState, useEffect } from 'react';

const GeneradorComunicados = () => {
  // Estados principales
  const [tipo, setTipo] = useState('evento-inicio');
  const [descripcion, setDescripcion] = useState('');
  const [impacto, setImpacto] = useState('');
  const [resultado, setResultado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    
    setFechaInicio(fechaActual);
    setHoraInicio(horaActual);
  }, []);

  // Función simplificada para generar mensaje
  const generarMensaje = () => {
    const descripcionVal = descripcion || "INFORMACIÓN NO DISPONIBLE";
    const impactoVal = impacto || "No especificado";
    const fechaFormateada = fechaInicio ? `${fechaInicio.split('-')[2]}/${fechaInicio.split('-')[1]}/${fechaInicio.split('-')[0]}` : "";
    
    const mensaje = `🟡 *GESTIÓN EVENTOS*\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}\n*Estado:* En revisión`;
    
    setResultado(mensaje);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto p-4">
        <header className="bg-black bg-opacity-40 p-5 text-center rounded-lg mb-8 border border-white border-opacity-10 shadow-lg">
          <div className="w-20 h-20 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center text-5xl text-gray-900 font-bold">
            📝
          </div>
          <h1 className="text-4xl font-bold uppercase tracking-wider text-yellow-400 m-0">
            Generador de Comunicados
          </h1>
          <p className="mt-2 text-lg opacity-80">
            Sistema de creación de comunicados para el Grupo de Monitoreo
          </p>
        </header>
        
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-8 shadow-lg border border-white border-opacity-10">
          <h2 className="text-2xl text-yellow-400 mt-0 border-b border-yellow-400 border-opacity-30 pb-3">
            Tipo de Comunicado
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <div 
              className="flex-1 text-center p-3 rounded-lg cursor-pointer bg-green-600 text-white"
              onClick={() => setTipo('evento-inicio')}
            >
              <span className="block text-2xl mb-1">🟡</span>
              <span>Evento - Inicio</span>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 font-semibold text-gray-300">Descripción:</label>
            <input 
              className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
              type="text" 
              placeholder="Ej: INTERMITENCIAS CON LA URL DE PEOPLE HATS"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            
            <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
            <input 
              className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
              type="text" 
              placeholder="Ej: Hats PeopleSoft"
              value={impacto}
              onChange={(e) => setImpacto(e.target.value)}
            />
            
            <div className="flex gap-4 mt-6">
              <button 
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-semibold uppercase"
                onClick={generarMensaje}
              >
                Generar Comunicado
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-8 shadow-lg border border-white border-opacity-10">
          <h2 className="text-2xl text-yellow-400 mt-0 border-b border-yellow-400 border-opacity-30 pb-3">
            Comunicado Generado
          </h2>
          <div className="bg-gray-800 p-5 rounded-md whitespace-pre-wrap font-mono border-l-4 border-yellow-400 mt-4 min-h-40">
            {resultado}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
