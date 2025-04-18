import React, { useState, useEffect } from 'react';

const GeneradorComunicados = () => {
  // Estados
  const [tipo, setTipo] = useState('evento-inicio');
  const [descripcion, setDescripcion] = useState('');
  const [impacto, setImpacto] = useState('');
  const [motivo, setMotivo] = useState('');
  const [impactoMant, setImpactoMant] = useState('');
  const [ejecutor, setEjecutor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [estadoInicio, setEstadoInicio] = useState('');
  const [acciones, setAcciones] = useState('');
  const [fechaInicioFin, setFechaInicioFin] = useState('');
  const [horaInicioFin, setHoraInicioFin] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [duracionCalculada, setDuracionCalculada] = useState('00:00:00');
  const [estadoFin, setEstadoFin] = useState('');
  const [nota, setNota] = useState('');
  const [resultado, setResultado] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('¡Comunicado copiado al portapapeles!');

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Calcular duración cuando cambien las fechas u horas relevantes
  useEffect(() => {
    calcularDuracion();
  }, [fechaInicioFin, horaInicioFin, fechaFin, horaFin]);
  
  // Cuando cambie el tipo, actualizar automáticamente el estado correspondiente
  useEffect(() => {
    if (tipo === 'evento-inicio') {
      setEstadoInicio('En revisión');
    } else if (tipo === 'evento-fin') {
      setEstadoFin('Recuperado');
    } else if (tipo === 'mantenimiento-inicio') {
      setEstadoInicio('En curso');
    } else if (tipo === 'mantenimiento-fin') {
      setEstadoFin('Finalizado');
    }
  }, [tipo]);

  // Funciones
  const establecerFechaHoraActual = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    
    setFechaInicio(fechaActual);
    setHoraInicio(horaActual);
    setFechaInicioFin(fechaActual);
    setHoraInicioFin(horaActual);
    setFechaFin(fechaActual);
    setHoraFin(horaActual);
  };
  
  const limpiarCampos = () => {
    // Mantener el tipo de comunicado seleccionado
    const tipoActual = tipo;
    
    // Limpiar campos de texto
    setDescripcion('');
    setImpacto('');
    setMotivo('');
    setImpactoMant('');
    setEjecutor('');
    setAcciones('');
    setNota('');
    
    // Restablecer fechas y horas actuales
    establecerFechaHoraActual();
    
    // Mostrar alerta
    setAlertaMensaje('¡Campos limpiados correctamente!');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const seleccionarTipo = (nuevoTipo) => {
    const tipoAnterior = tipo;
    setTipo(nuevoTipo);
    
    // Transferir datos solo entre tipos del mismo grupo de comunicados
    
    // Para eventos: preservar datos solo entre tipos de eventos
    if (tipoAnterior.startsWith('evento-') && nuevoTipo.startsWith('evento-')) {
      // Si vamos a "evento-fin", transferimos fecha y hora de inicio
      if (nuevoTipo === 'evento-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
        // Si venimos de seguimiento, también podríamos transferir acciones a notas
        if (tipoAnterior === 'evento-seguimiento' && acciones && !nota) {
          setNota("Acciones realizadas:\n" + acciones);
        }
      }
      
      // Si vamos a "evento-seguimiento", podríamos inicializar algún texto para acciones
      if (nuevoTipo === 'evento-seguimiento' && tipoAnterior === 'evento-inicio' && !acciones) {
        setAcciones("Acciones en proceso:\n");
      }
    }
    
    // Para mantenimientos: preservar datos solo entre tipos de mantenimientos
    if (tipoAnterior.startsWith('mantenimiento-') && nuevoTipo.startsWith('mantenimiento-')) {
      // Si pasamos de inicio a fin, transferimos fecha y hora
      if (tipoAnterior === 'mantenimiento-inicio' && nuevoTipo === 'mantenimiento-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
      }
    }
  };

  const calcularDuracion = () => {
    try {
      if (!fechaInicioFin || !horaInicioFin || !fechaFin || !horaFin) {
        return;
      }
      
      const inicio = new Date(`${fechaInicioFin}T${horaInicioFin}`);
      const fin = new Date(`${fechaFin}T${horaFin}`);
      
      const diferencia = fin - inicio;
      
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      
      const duracion = 
        `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
      
      setDuracionCalculada(duracion);
    } catch (error) {
      console.error('Error al calcular duración:', error);
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    
    const partes = fechaISO.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const generarMensaje = () => {
    let mensaje = "";
    
    if (tipo === 'evento-inicio') {
      const descripcionVal = descripcion || "INFORMACIÓN NO DISPONIBLE";
      const impactoVal = impacto || "No especificado";
      const estadoVal = estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `🟡 *GESTIÓN EVENTOS*\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}\n*Estado:* ${estadoVal}`;
    }
    else if (tipo === 'evento-seguimiento') {
      const descripcionVal = descripcion || "INFORMACIÓN NO DISPONIBLE";
      const impactoVal = impacto || "No especificado";
      
      mensaje = `🔁 *GESTIÓN EVENTOS*\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Acciones:*`;
      
      if (acciones) {
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n·         ${lineasAcciones[i]}`;
          }
        }
      } else {
        mensaje += "\n·         Sin acciones registradas";
      }
    }
    else if (tipo === 'evento-fin') {
      const descripcionVal = descripcion || "INFORMACIÓN NO DISPONIBLE";
      const impactoVal = impacto || "No especificado";
      const estadoVal = estadoFin || "Recuperado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `🟢 *GESTIÓN EVENTOS*\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}\n*Estado:* ${estadoVal}`;
    }
    else if (tipo === 'mantenimiento-inicio') {
      const motivoVal = motivo || "INFORMACIÓN NO DISPONIBLE";
      const impactoVal = impactoMant || "No especificado";
      const ejecutorVal = ejecutor || "No especificado";
      const estadoVal = estadoInicio || "En curso";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `⚠️ *MANTENIMIENTO:*\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}\n*Estado:* ${estadoVal}`;
    }
    else if (tipo === 'mantenimiento-fin') {
      const motivoVal = motivo || "INFORMACIÓN NO DISPONIBLE";
      const impactoVal = impactoMant || "No especificado";
      const ejecutorVal = ejecutor || "No especificado";
      const estadoVal = estadoFin || "Finalizado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `✅ *MANTENIMIENTO:*\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}\n*Estado:* ${estadoVal}`;
    }
    
    // Agregar nota si existe
    if (nota) {
      mensaje += `\n\n*📣 NOTA*:\n${nota}`;
    }
    
    setResultado(mensaje);
    setMostrarAlerta(false);
  };

  const copiar = () => {
    if (!resultado) {
      alert("No hay ningún comunicado generado para copiar.");
      return;
    }
    
    setAlertaMensaje('¡Comunicado copiado al portapapeles!');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  // JSX
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto p-4">
        <header className="bg-black bg-opacity-40 p-5 text-center rounded-lg mb-8 border border-white border-opacity-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center text-5xl text-gray-900 font-bold">
              📝
            </div>
            <h1 className="text-4xl font-bold uppercase tracking-wider text-yellow-400 m-0 text-shadow">
              Generador de Comunicados
            </h1>
            <p className="mt-2 text-lg opacity-80">
              Sistema de creación de comunicados para el Grupo de Monitoreo
            </p>
          </div>
        </header>
        
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-8 shadow-lg border border-white border-opacity-10">
          <h2 className="text-2xl text-yellow-400 mt-0 border-b border-yellow-400 border-opacity-30 pb-3">
            Tipo de Comunicado
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <div 
              className={`flex-1 min-w-[120px] text-center p-3 rounded-lg cursor-pointer transition ${tipo === 'evento-inicio' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border border-white border-opacity-20 text-gray-300'}`}
              onClick={() => seleccionarTipo('evento-inicio')}
            >
              <span className="block text-2xl mb-1">🟡</span>
              <span>Evento - Inicio</span>
            </div>
            <div 
              className={`flex-1 min-w-[120px] text-center p-3 rounded-lg cursor-pointer transition ${tipo === 'evento-seguimiento' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border border-white border-opacity-20 text-gray-300'}`}
              onClick={() => seleccionarTipo('evento-seguimiento')}
            >
              <span className="block text-2xl mb-1">🔁</span>
              <span>Evento - Seguimiento</span>
            </div>
            <div 
              className={`flex-1 min-w-[120px] text-center p-3 rounded-lg cursor-pointer transition ${tipo === 'evento-fin' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border border-white border-opacity-20 text-gray-300'}`}
              onClick={() => seleccionarTipo('evento-fin')}
            >
              <span className="block text-2xl mb-1">🟢</span>
              <span>Evento - Fin</span>
            </div>
            <div 
              className={`flex-1 min-w-[120px] text-center p-3 rounded-lg cursor-pointer transition ${tipo === 'mantenimiento-inicio' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border border-white border-opacity-20 text-gray-300'}`}
              onClick={() => seleccionarTipo('mantenimiento-inicio')}
            >
              <span className="block text-2xl mb-1">⚠️</span>
              <span>Mantenimiento - Inicio</span>
            </div>
            <div 
              className={`flex-1 min-w-[120px] text-center p-3 rounded-lg cursor-pointer transition ${tipo === 'mantenimiento-fin' ? 'bg-green-600 border-green-600 text-white' : 'bg-gray-800 border border-white border-opacity-20 text-gray-300'}`}
              onClick={() => seleccionarTipo('mantenimiento-fin')}
            >
              <span className="block text-2xl mb-1">✅</span>
              <span>Mantenimiento - Fin</span>
            </div>
          </div>
          
          {/* Campos para Evento */}
          {tipo.startsWith('evento') && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="descripcion">Descripción:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="text" 
                id="descripcion" 
                placeholder="Ej: INTERMITENCIAS CON LA URL DE PEOPLE HATS"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="impacto">Impacto:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="text" 
                id="impacto" 
                placeholder="Ej: Hats PeopleSoft"
                value={impacto}
                onChange={(e) => setImpacto(e.target.value)}
              />
            </div>
          )}
          
          {/* Campos para Mantenimiento */}
          {tipo.startsWith('mantenimiento') && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="motivo">Motivo:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="text" 
                id="motivo" 
                placeholder="Ej: VENTANA DE TRABAJO EMERGENTE DE CNEL"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="impacto-mant">Impacto:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="text" 
                id="impacto-mant" 
                placeholder="Ej: Pago de planillas eléctricas en todas las unidades de CNEL"
                value={impactoMant}
                onChange={(e) => setImpactoMant(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="ejecutor">Ejecutor:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="text" 
                id="ejecutor" 
                placeholder="Ej: CNEL"
                value={ejecutor}
                onChange={(e) => setEjecutor(e.target.value)}
              />
            </div>
          )}
          
          {/* Campos comunes para Inicio */}
          {tipo.endsWith('inicio') && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="fecha-inicio">Fecha:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="date" 
                id="fecha-inicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="hora-inicio">Hora:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="time" 
                id="hora-inicio" 
                step="1"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="estado-inicio">Estado:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white text-base cursor-not-allowed"
                type="text" 
                id="estado-inicio" 
                value={estadoInicio}
                readOnly
              />
            </div>
          )}
          
          {/* Campos para Seguimiento (solo Eventos) */}
          {tipo === 'evento-seguimiento' && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="acciones">Acciones (una por línea):</label>
              <textarea 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base h-32 resize-y"
                id="acciones" 
                placeholder="Ejemplo:
Reinicio del driver de interconexión entre el AS400 CAO y Broker. ✅
Reinicio de los microservicios de conexión AS400 en OpenShift ✅
Reinicio progresivo de los nodos del Bróker de Core (10)  ⏳"
                value={acciones}
                onChange={(e) => setAcciones(e.target.value)}
              ></textarea>
            </div>
          )}
          
          {/* Campos para Fin */}
          {tipo.endsWith('fin') && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="fecha-inicio-fin">Fecha inicio:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="date" 
                id="fecha-inicio-fin"
                value={fechaInicioFin}
                onChange={(e) => setFechaInicioFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="hora-inicio-fin">Hora inicio:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="time" 
                id="hora-inicio-fin" 
                step="1"
                value={horaInicioFin}
                onChange={(e) => setHoraInicioFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="fecha-fin">Fecha fin:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="date" 
                id="fecha-fin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="hora-fin">Hora fin:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base"
                type="time" 
                id="hora-fin" 
                step="1"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Duración calculada:</label>
              <div className="font-bold text-2xl text-yellow-400 text-center bg-gray-800 p-3 rounded-md mb-5">{duracionCalculada}</div>
              
              <label className="block mb-2 font-semibold text-gray-300" htmlFor="estado-fin">Estado:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white text-base cursor-not-allowed"
                type="text" 
                id="estado-fin" 
                value={estadoFin}
                readOnly
              />
            </div>
          )}
          
          <label className="block mb-2 font-semibold text-gray-300" htmlFor="nota">Nota adicional (opcional):</label>
          <textarea 
            className="w-full p-3 mb-5 bg-gray-800 bg-opacity-80 border border-white border-opacity-20 rounded-md text-white text-base h-32 resize-y"
            id="nota" 
            placeholder="Nota adicional"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          ></textarea>
          
          <div className="flex gap-4 mt-6">
            <button 
              className="flex-1 bg-green-600 text-white border-none py-3 px-6 text-base rounded-md cursor-pointer font-semibold uppercase tracking-wider transition-all shadow-md hover:bg-green-700"
              onClick={generarMensaje}
            >
              Generar Comunicado
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 mb-8 shadow-lg border border-white border-opacity-10">
          <h2 className="text-2xl text-yellow-400 mt-0 border-b border-yellow-400 border-opacity-30 pb-3">
            Comunicado Generado
          </h2>
          <div className="bg-gray-800 p-5 rounded-md whitespace-pre-wrap font-mono border-l-4 border-yellow-400 mt-4 min-h-[150px] overflow-x-auto leading-relaxed">
            {resultado}
          </div>
          
          {mostrarAlerta && (
            <div className="p-4 my-4 rounded-md bg-green-800 bg-opacity-20 border-l-4 border-green-600">
              {alertaMensaje}
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <button 
              className="flex-1 bg-blue-700 text-white border-none py-3 px-6 text-base rounded-md cursor-pointer font-semibold uppercase tracking-wider transition-all shadow-md hover:bg-blue-800"
              onClick={copiar}
            >
              Copiar al Portapapeles
            </button>
            <button 
              className="flex-1 bg-red-600 text-white border-none py-3 px-6 text-base rounded-md cursor-pointer font-semibold uppercase tracking-wider transition-all shadow-md hover:bg-red-700"
              onClick={limpiarCampos}
            >
              Limpiar Campos
            </button>
          </div>
        </div>
        
        <footer className="text-center py-5 mt-8 text-gray-400 text-sm border-t border-white border-opacity-10">
          <p>Desarrollado por Luis Herrera | Grupo Fractalia</p>
          <p>Generador de Comunicados para el Grupo de Monitoreo - Versión 1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
