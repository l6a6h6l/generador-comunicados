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
  const [accionesEjecutadas, setAccionesEjecutadas] = useState('');
  const [accionesEnCurso, setAccionesEnCurso] = useState('');
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
  const [causaRaiz, setCausaRaiz] = useState('');

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Calcular duración cuando cambien las fechas u horas relevantes
  useEffect(() => {
    // Definir calcularDuracion dentro del efecto para evitar dependencia cíclica
    const calcularDuracionInterna = () => {
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
    
    calcularDuracionInterna();
  }, [fechaInicioFin, horaInicioFin, fechaFin, horaFin]);
  
  // Cuando cambie el tipo, actualizar automáticamente el estado correspondiente
  useEffect(() => {
    if (tipo === 'evento-inicio' || tipo === 'incidente-inicio') {
      setEstadoInicio('En revisión');
    } else if (tipo === 'evento-fin' || tipo === 'incidente-fin') {
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
    // Limpiar campos de texto
    setDescripcion('');
    setImpacto('');
    setMotivo('');
    setImpactoMant('');
    setEjecutor('');
    setAcciones('');
    setAccionesEjecutadas('');
    setAccionesEnCurso('');
    setNota('');
    setCausaRaiz('');
    
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
    
    // Transferir datos entre tipos del mismo grupo
    
    // Para eventos
    if (tipoAnterior.startsWith('evento-') && nuevoTipo.startsWith('evento-')) {
      if (nuevoTipo === 'evento-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
        if (tipoAnterior === 'evento-seguimiento' && acciones && !nota) {
          setNota("Acciones realizadas:\n" + acciones);
        }
      }
      
      if (nuevoTipo === 'evento-seguimiento' && tipoAnterior === 'evento-inicio' && !acciones) {
        setAcciones("Acciones en proceso:\n");
      }
    }
    
    // Para incidentes
    if (tipoAnterior.startsWith('incidente-') && nuevoTipo.startsWith('incidente-')) {
      if (nuevoTipo === 'incidente-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
      }
      
      if (nuevoTipo === 'incidente-avance' && tipoAnterior === 'incidente-inicio') {
        setAccionesEnCurso("Acción 1. Proveedor / Área interna\n");
      }
    }
    
    // Para mantenimientos
    if (tipoAnterior.startsWith('mantenimiento-') && nuevoTipo.startsWith('mantenimiento-')) {
      if (tipoAnterior === 'mantenimiento-inicio' && nuevoTipo === 'mantenimiento-fin') {
        setFechaInicioFin(fechaInicio);
        setHoraInicioFin(horaInicio);
      }
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
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `*GESTIÓN EVENTO*\n🟡 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}`;
      
      if (acciones && acciones.trim().length > 0) {
        mensaje += "\n*Acciones:*";
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n    • ${lineasAcciones[i]}`;
          }
        }
      }
    }*Acciones:*";
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n• ${lineasAcciones[i]}`;
          }
        }
      }
    }
    else if (tipo === 'evento-seguimiento') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      
      mensaje = `*GESTIÓN EVENTO*\n🔁 *Seguimiento*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Acciones:*`;
      
      if (acciones) {
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n        • ${lineasAcciones[i]}`;
          }
        }
      } else {
        mensaje += "\n        • Sin acciones registradas";
      }
    }
    else if (tipo === 'evento-fin') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoFin || "Recuperado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `*GESTIÓN EVENTO*\n🟢 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}`;
      
      if (acciones) {
        mensaje += "\n*Acciones:*";
        const lineasAcciones = acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n        • ${lineasAcciones[i]}`;
          }
        }
      }

      if (causaRaiz) {
        mensaje += `\n*Causa raíz:* ${causaRaiz}`;
      }
    }
    else if (tipo === 'mantenimiento-inicio') {
      const motivoVal = motivo || "Descripción del Mantenimiento";
      const impactoVal = impactoMant || "Impacto servicio / usuarios / clientes";
      const ejecutorVal = ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = estadoInicio || "En curso";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `⚠️ *MANTENIMIENTO*\n*Estado:* ${estadoVal}\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}`;
    }
    else if (tipo === 'mantenimiento-fin') {
      const motivoVal = motivo || "Descripción del Mantenimiento";
      const impactoVal = impactoMant || "Impacto servicio / usuarios / clientes";
      const ejecutorVal = ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = estadoFin || "Finalizado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `✅ *MANTENIMIENTO*\n*Estado:* ${estadoVal}\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}`;
    }
    else if (tipo === 'incidente-inicio') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(fechaInicio);
      
      mensaje = `*GESTIÓN INCIDENTE*\n🟡 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${horaInicio}`;
    }
    else if (tipo === 'incidente-avance') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      
      mensaje = `*GESTIÓN INCIDENTE*\n🔁 *Avance*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}`;
      
      if (accionesEnCurso) {
        mensaje += "\n*Acciones en curso:*";
        const lineasAcciones = accionesEnCurso.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n        • ${lineasAcciones[i]}`;
          }
        }
      }
      
      if (accionesEjecutadas) {
        mensaje += "\n*Acciones ejecutadas:*";
        const lineasAcciones = accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n        • ${lineasAcciones[i]}`;
          }
        }
      }
    }
    else if (tipo === 'incidente-fin') {
      const descripcionVal = descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = impacto || "Impacto servicio / usuarios";
      const estadoVal = estadoFin || "Recuperado";
      
      const fechaInicioFormateada = formatearFecha(fechaInicioFin);
      const fechaFinFormateada = formatearFecha(fechaFin);
      
      mensaje = `*GESTIÓN INCIDENTE*\n🟢 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${horaFin}\n*Duración:* ${duracionCalculada}`;
      
      if (accionesEjecutadas) {
        mensaje += "\n*Acciones ejecutadas:*";
        const lineasAcciones = accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n        • ${lineasAcciones[i]}`;
          }
        }
      }
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
    
    // Intentar copiar al portapapeles
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(resultado)
        .then(() => {
          setAlertaMensaje('¡Comunicado copiado al portapapeles!');
          setMostrarAlerta(true);
          setTimeout(() => setMostrarAlerta(false), 3000);
        })
        .catch(err => {
          alert("Error al copiar: " + err);
        });
    } else {
      // Fallback para navegadores que no soporten clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = resultado;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        
        if (successful) {
          setAlertaMensaje('¡Comunicado copiado al portapapeles!');
          setMostrarAlerta(true);
          setTimeout(() => setMostrarAlerta(false), 3000);
        } else {
          alert("No se pudo copiar el texto. Por favor, intenta manualmente.");
        }
      } catch (err) {
        alert("Error al copiar: " + err);
      }
      
      document.body.removeChild(textArea);
    }
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
          
          {/* Tipos de Evento */}
          <div className="mb-4">
            <h3 className="text-xl text-white mt-4 mb-2">Eventos</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'evento-inicio' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('evento-inicio')}
              >
                <span className="block text-2xl mb-1">🟡</span>
                <span>Inicio</span>
              </div>
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'evento-seguimiento' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('evento-seguimiento')}
              >
                <span className="block text-2xl mb-1">🔁</span>
                <span>Seguimiento</span>
              </div>
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'evento-fin' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('evento-fin')}
              >
                <span className="block text-2xl mb-1">🟢</span>
                <span>Fin</span>
              </div>
            </div>
          </div>
          
          {/* Tipos de Mantenimiento */}
          <div className="mb-4">
            <h3 className="text-xl text-white mt-4 mb-2">Mantenimientos</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'mantenimiento-inicio' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('mantenimiento-inicio')}
              >
                <span className="block text-2xl mb-1">⚠️</span>
                <span>Inicio</span>
              </div>
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'mantenimiento-fin' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('mantenimiento-fin')}
              >
                <span className="block text-2xl mb-1">✅</span>
                <span>Fin</span>
              </div>
            </div>
          </div>
          
          {/* Tipos de Incidente */}
          <div className="mb-4">
            <h3 className="text-xl text-white mt-4 mb-2">Incidentes</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'incidente-inicio' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('incidente-inicio')}
              >
                <span className="block text-2xl mb-1">🟡</span>
                <span>Inicio</span>
              </div>
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'incidente-avance' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('incidente-avance')}
              >
                <span className="block text-2xl mb-1">🔁</span>
                <span>Avance</span>
              </div>
              <div 
                className={`flex-1 text-center p-3 rounded-lg cursor-pointer ${tipo === 'incidente-fin' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => seleccionarTipo('incidente-fin')}
              >
                <span className="block text-2xl mb-1">🟢</span>
                <span>Fin</span>
              </div>
            </div>
          </div>
          
          {/* Campos para Evento o Incidente */}
          {(tipo.startsWith('evento-') || tipo.startsWith('incidente-')) && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Descripción:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="text" 
                placeholder="DESCRIPCION DEL INCIDENTE"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="text" 
                placeholder="Impacto servicio / usuarios"
                value={impacto}
                onChange={(e) => setImpacto(e.target.value)}
              />
            </div>
          )}
          
          {/* Campos para Mantenimiento */}
          {tipo.startsWith('mantenimiento-') && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Motivo:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="text" 
                placeholder="Descripción del Mantenimiento"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="text" 
                placeholder="Impacto servicio / usuarios / clientes"
                value={impactoMant}
                onChange={(e) => setImpactoMant(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Ejecutor:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="text" 
                placeholder="Nombre del proveedor o área interna que ejecuta el mantenimiento"
                value={ejecutor}
                onChange={(e) => setEjecutor(e.target.value)}
              />
            </div>
          )}
          
          {/* Campos comunes para Inicio */}
          {(tipo.endsWith('-inicio')) && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Fecha:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="date" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Hora:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="time" 
                step="1"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white cursor-not-allowed"
                type="text" 
                value={estadoInicio}
                readOnly
              />
            </div>
          )}
          
          {/* Campos para Seguimiento (solo Eventos) */}
          {tipo === 'evento-seguimiento' && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Acciones (una por línea):</label>
              <textarea 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white h-32 resize-y"
                placeholder="Acción 1. Proveedor / Área interna
Acción 2. Proveedor / Área interna"
                value={acciones}
                onChange={(e) => setAcciones(e.target.value)}
              ></textarea>
            </div>
          )}
          
          {/* Campos para Avance (solo Incidentes) */}
          {tipo === 'incidente-avance' && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Acciones en curso (una por línea):</label>
              <textarea 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white h-32 resize-y"
                placeholder="Acción 1. Proveedor / Área interna
Acción 2. Proveedor / Área interna"
                value={accionesEnCurso}
                onChange={(e) => setAccionesEnCurso(e.target.value)}
              ></textarea>
              
              <label className="block mb-2 font-semibold text-gray-300">Acciones ejecutadas (una por línea):</label>
              <textarea 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white h-32 resize-y"
                placeholder="Acción 1. Proveedor / Área interna
Acción 2. Proveedor / Área interna"
                value={accionesEjecutadas}
                onChange={(e) => setAccionesEjecutadas(e.target.value)}
              ></textarea>
            </div>
          )}
          
          {/* Campos para Fin */}
          {tipo.endsWith('-fin') && (
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Fecha inicio:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="date" 
                value={fechaInicioFin}
                onChange={(e) => setFechaInicioFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Hora inicio:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="time" 
                step="1"
                value={horaInicioFin}
                onChange={(e) => setHoraInicioFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Fecha fin:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="date" 
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Hora fin:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                type="time" 
                step="1"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
              
              <label className="block mb-2 font-semibold text-gray-300">Duración calculada:</label>
              <div className="font-bold text-2xl text-yellow-400 text-center bg-gray-800 p-3 rounded-md mb-5">{duracionCalculada}</div>
              
              <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
              <input 
                className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white cursor-not-allowed"
                type="text" 
                value={estadoFin}
                readOnly
              />
              
              {(tipo === 'evento-fin' || tipo === 'incidente-fin') && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-300">Acciones:</label>
                  <textarea 
                    className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white h-32 resize-y"
                    placeholder="Acciones que permitieron la recuperación del servicio"
                    value={tipo === 'evento-fin' ? acciones : accionesEjecutadas}
                    onChange={(e) => tipo === 'evento-fin' ? setAcciones(e.target.value) : setAccionesEjecutadas(e.target.value)}
                  ></textarea>
                  
                  <label className="block mb-2 font-semibold text-gray-300">Causa raíz:</label>
                  <input 
                    className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white"
                    type="text" 
                    placeholder="Descripción de la causa"
                    value={causaRaiz}
                    onChange={(e) => setCausaRaiz(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          <label className="block mb-2 font-semibold text-gray-300">Nota adicional (opcional):</label>
          <textarea 
            className="w-full p-3 mb-5 bg-gray-800 border border-white border-opacity-20 rounded-md text-white h-32 resize-y"
            placeholder="Observaciones con detalle que permitan brindar más información en el caso que amerite"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          ></textarea>
          
          <div className="flex gap-4 mt-6">
            <button 
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-semibold uppercase transition-all shadow-md hover:bg-green-700"
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
          <div className="bg-gray-800 p-5 rounded-md whitespace-pre-wrap font-mono border-l-4 border-yellow-400 mt-4 min-h-40 overflow-x-auto leading-relaxed">
            {resultado}
          </div>
          
          {mostrarAlerta && (
            <div className="p-4 my-4 rounded-md bg-green-800 bg-opacity-20 border-l-4 border-green-600">
              {alertaMensaje}
            </div>
          )}
          
          <div className="flex gap-4 mt-6">
            <button 
              className="flex-1 bg-blue-700 text-white py-3 px-6 rounded-md font-semibold uppercase transition-all shadow-md hover:bg-blue-800"
              onClick={copiar}
            >
              Copiar al Portapapeles
            </button>
            <button 
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md font-semibold uppercase transition-all shadow-md hover:bg-red-700"
              onClick={limpiarCampos}
            >
              Limpiar Campos
            </button>
          </div>
        </div>
        
        <footer className="text-center py-5 mt-8 text-gray-400 text-sm border-t border-white border-opacity-10">
          <p>Desarrollado por Luis Herrera | Grupo Fractalia</p>
          <p>Generador de Comunicados para el Grupo de Monitoreo - Versión 1.1</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
