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
  const [activeTab, setActiveTab] = useState('formulario');

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Calcular duración cuando cambien las fechas u horas relevantes
  useEffect(() => {
    const calcularDuracionInterna = () => {
      try {
        if (!fechaInicioFin || !horaInicioFin || !fechaFin || !horaFin) {
          return;
        }
        
        const inicio = new Date(`${fechaInicioFin}T${horaInicioFin}`);
        const fin = new Date(`${fechaFin}T${horaFin}`);
        
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
          console.error('Fechas u horas inválidas:', fechaInicioFin, horaInicioFin, fechaFin, horaFin);
          return;
        }
        
        const diferencia = fin - inicio;
        
        // Si la diferencia es negativa (fecha de fin anterior a inicio), usar 0
        const diferenciaAjustada = diferencia < 0 ? 0 : diferencia;
        
        const horas = Math.floor(diferenciaAjustada / (1000 * 60 * 60));
        const minutos = Math.floor((diferenciaAjustada % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenciaAjustada % (1000 * 60)) / 1000);
        
        const duracion = 
          `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
        
        setDuracionCalculada(duracion);
      } catch (error) {
        console.error('Error al calcular duración:', error);
      }
    };
    
    calcularDuracionInterna();
  }, [fechaInicioFin, horaInicioFin, fechaFin, horaFin, tipo]);
  
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
            mensaje += `\n• ${lineasAcciones[i]}`;
          }
        }
      } else {
        mensaje += "\n• Sin acciones registradas";
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
            mensaje += `\n• ${lineasAcciones[i]}`;
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
            mensaje += `\n• ${lineasAcciones[i]}`;
          }
        }
      }
      
      if (accionesEjecutadas) {
        mensaje += "\n*Acciones ejecutadas:*";
        const lineasAcciones = accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          if (lineasAcciones[i].trim()) {
            mensaje += `\n• ${lineasAcciones[i]}`;
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
            mensaje += `\n• ${lineasAcciones[i]}`;
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
    
    // Cambiar a la pestaña de resultado
    setActiveTab('resultado');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header mejorado */}
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-center rounded-lg mb-8 border border-gray-700 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center text-3xl text-gray-900 font-bold">
              📝
            </div>
            <h1 className="text-4xl font-bold text-yellow-400">
              Generador de Comunicados
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              Sistema de creación de comunicados para el Grupo de Monitoreo
            </p>
          </div>
        </header>
        
        {/* Navegación por pestañas */}
        <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <button 
            className={`flex-1 py-3 px-4 ${activeTab === 'formulario' ? 'bg-gray-700 text-white font-semibold border-b-2 border-yellow-500' : 'text-gray-400 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('formulario')}
          >
            Formulario
          </button>
          <button 
            className={`flex-1 py-3 px-4 ${activeTab === 'resultado' ? 'bg-gray-700 text-white font-semibold border-b-2 border-yellow-500' : 'text-gray-400 hover:bg-gray-700'}`}
            onClick={() => setActiveTab('resultado')}
          >
            Comunicado
          </button>
        </div>
        
        {/* Contenido de las pestañas */}
        <div className="relative">
          {/* Formulario */}
          <div className={`transition-opacity duration-300 ${activeTab === 'formulario' ? 'opacity-100 visible' : 'opacity-0 invisible absolute top-0 left-0 w-full'}`}>
            <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-2">
                Tipo de Comunicado
              </h2>
              
              {/* Tipos de comunicados agrupados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Eventos */}
                <div className="bg-gray-900 rounded-lg p-4 border border-blue-900 shadow-md">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3 border-b border-blue-900 pb-2">
                    Eventos
                  </h3>
                  <div className="space-y-2">
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'evento-inicio' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('evento-inicio')}
                    >
                      <span className="mr-2">🟡</span>Inicio
                    </button>
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'evento-seguimiento' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('evento-seguimiento')}
                    >
                      <span className="mr-2">🔁</span>Seguimiento
                    </button>
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'evento-fin' ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('evento-fin')}
                    >
                      <span className="mr-2">🟢</span>Fin
                    </button>
                  </div>
                </div>
                
                {/* Mantenimientos */}
                <div className="bg-gray-900 rounded-lg p-4 border border-amber-900 shadow-md">
                  <h3 className="text-lg font-semibold text-amber-400 mb-3 border-b border-amber-900 pb-2">
                    Mantenimientos
                  </h3>
                  <div className="space-y-2">
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'mantenimiento-inicio' ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('mantenimiento-inicio')}
                    >
                      <span className="mr-2">⚠️</span>Inicio
                    </button>
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'mantenimiento-fin' ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('mantenimiento-fin')}
                    >
                      <span className="mr-2">✅</span>Fin
                    </button>
                  </div>
                </div>
                
                {/* Incidentes */}
                <div className="bg-gray-900 rounded-lg p-4 border border-red-900 shadow-md">
                  <h3 className="text-lg font-semibold text-red-400 mb-3 border-b border-red-900 pb-2">
                    Incidentes
                  </h3>
                  <div className="space-y-2">
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'incidente-inicio' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('incidente-inicio')}
                    >
                      <span className="mr-2">🟡</span>Inicio
                    </button>
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'incidente-avance' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('incidente-avance')}
                    >
                      <span className="mr-2">🔁</span>Avance
                    </button>
                    <button 
                      className={`w-full py-2 px-3 rounded-md ${tipo === 'incidente-fin' ? 'bg-red-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => seleccionarTipo('incidente-fin')}
                    >
                      <span className="mr-2">🟢</span>Fin
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenedor principal del formulario */}
              <div className="p-5 rounded-lg bg-gray-900 border border-gray-700 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Detalles del {tipo.startsWith('evento-') ? 'Evento' : 
                              tipo.startsWith('mantenimiento-') ? 'Mantenimiento' : 'Incidente'}
                </h3>
                
                {/* Campos para Evento o Incidente */}
                {(tipo.startsWith('evento-') || tipo.startsWith('incidente-')) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Descripción:</label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                        type="text" 
                        placeholder="DESCRIPCION DEL INCIDENTE"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Impacto:</label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                        type="text" 
                        placeholder="Impacto servicio / usuarios"
                        value={impacto}
                        onChange={(e) => setImpacto(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {/* Campos para Mantenimiento */}
                {tipo.startsWith('mantenimiento-') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Motivo:</label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-amber-500"
                        type="text" 
                        placeholder="Descripción del Mantenimiento"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Impacto:</label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-amber-500"
                        type="text" 
                        placeholder="Impacto servicio / usuarios / clientes"
                        value={impactoMant}
                        onChange={(e) => setImpactoMant(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Ejecutor:
                 label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:border-amber-500"
                        type="text" 
                        placeholder="Nombre del proveedor o área interna que ejecuta el mantenimiento"
                        value={ejecutor}
                        onChange={(e) => setEjecutor(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {/* Campos comunes para Inicio */}
                {(tipo.endsWith('-inicio')) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Fecha:</label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                        type="date" 
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Hora:</label>
                      <input 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                        type="time" 
                        step="1"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-2 font-medium text-gray-300">Estado:</label>
                      <div className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white font-semibold">
                        {estadoInicio}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Campos para Seguimiento (solo Eventos) */}
                {tipo === 'evento-seguimiento' && (
                  <div className="mt-4">
                    <label className="block mb-2 font-medium text-gray-300">Acciones (una por línea):</label>
                    <textarea 
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white h-32 resize-y focus:outline-none focus:border-blue-500"
                      placeholder="Acción 1. Proveedor / Área interna&#10;Acción 2. Proveedor / Área interna"
                      value={acciones}
                      onChange={(e) => setAcciones(e.target.value)}
                    ></textarea>
                  </div>
                )}
                
                {/* Campos para Avance (solo Incidentes) */}
                {tipo === 'incidente-avance' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Acciones en curso (una por línea):</label>
                      <textarea 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white h-32 resize-y focus:outline-none focus:border-red-500"
                        placeholder="Acción 1. Proveedor / Área interna&#10;Acción 2. Proveedor / Área interna"
                        value={accionesEnCurso}
                        onChange={(e) => setAccionesEnCurso(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Acciones ejecutadas (una por línea):</label>
                      <textarea 
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white h-32 resize-y focus:outline-none focus:border-red-500"
                        placeholder="Acción 1. Proveedor / Área interna&#10;Acción 2. Proveedor / Área interna"
                        value={accionesEjecutadas}
                        onChange={(e) => setAccionesEjecutadas(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                )}
                
                {/* Campos para Fin */}
                {tipo.endsWith('-fin') && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-300">Fecha inicio:</label>
                        <input 
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                          type="date" 
                          value={fechaInicioFin}
                          onChange={(e) => setFechaInicioFin(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-300">Hora inicio:</label>
                        <input 
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                          type="time" 
                          step="1"
                          value={horaInicioFin}
                          onChange={(e) => setHoraInicioFin(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-300">Fecha fin:</label>
                        <input 
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                          type="date" 
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium text-gray-300">Hora fin:</label>
                        <input 
                          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                          type="time" 
                          step="1"
                          value={horaFin}
                          onChange={(e) => setHoraFin(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Duración calculada:</label>
                      <div className="p-4 text-center text-2xl font-bold text-yellow-400 bg-gray-800 border border-gray-600 rounded-md">
                        {duracionCalculada}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium text-gray-300">Estado:</label>
                      <div className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white font-semibold">
                        {estadoFin}
                      </div>
                    </div>
                    
                    {(tipo === 'evento-fin' || tipo === 'incidente-fin') && (
                      <>
                        <div>
                          <label className="block mb-2 font-medium text-gray-300">Acciones:</label>
                          <textarea 
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white h-32 resize-y"
                            placeholder="Acciones que permitieron la recuperación del servicio"
                            value={tipo === 'evento-fin' ? acciones : accionesEjecutadas}
                            onChange={(e) => tipo === 'evento-fin' ? setAcciones(e.target.value) : setAccionesEjecutadas(e.target.value)}
                          ></textarea>
                        </div>
                        
                        <div>
                          <label className="block mb-2 font-medium text-gray-300">Causa raíz:</label>
                          <input 
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
                            type="text" 
                            placeholder="Descripción de la causa"
                            value={causaRaiz}
                            onChange={(e) => setCausaRaiz(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                <div className="mt-6">
                  <label className="block mb-2 font-medium text-gray-300">Nota adicional (opcional):</label>
                  <textarea 
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md text-white h-32 resize-y"
                    placeholder="Observaciones con detalle que permitan brindar más información en el caso que amerite"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex justify-center mt-8">
                  <button 
                    className="py-3 px-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-md font-bold shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                    onClick={generarMensaje}
                  >
                    Generar Comunicado
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Resultado */}
          <div className={`transition-opacity duration-300 ${activeTab === 'resultado' ? 'opacity-100 visible' : 'opacity-0 invisible absolute top-0 left-0 w-full'}`}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 border-b border-gray-700 pb-2">
                Comunicado Generado
              </h2>
              
              {resultado ? (
                <div className="relative">
                  <div className="bg-gray-900 p-6 rounded-md border border-gray-700 whitespace-pre-wrap font-mono text-gray-200 leading-relaxed min-h-64 overflow-x-auto">
                    {resultado}
                  </div>
                  
                  {mostrarAlerta && (
                    <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border-l-4 border-green-500 text-green-300 rounded-md">
                      {alertaMensaje}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-900 p-12 rounded-md border border-gray-700 text-center text-gray-400 min-h-64">
                  <p className="text-lg">No hay ningún comunicado generado.</p>
                  <p className="mt-2 text-sm">Completa el formulario y haz clic en "Generar Comunicado".</p>
                  <button 
                    className="mt-6 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-md border border-gray-700"
                    onClick={() => setActiveTab('formulario')}
                  >
                    Ir al formulario
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 mt-6">
                <button 
                  className={`flex-1 py-3 px-6 rounded-md font-semibold text-white ${resultado ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                  onClick={copiar}
                  disabled={!resultado}
                >
                  Copiar al Portapapeles
                </button>
                <button 
                  className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                  onClick={limpiarCampos}
                >
                  Limpiar Campos
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center py-6 mt-8 text-gray-400 text-sm border-t border-gray-800">
          <p className="font-medium">Desarrollado por Luis Herrera | Grupo Fractalia</p>
          <p>Generador de Comunicados para el Grupo de Monitoreo - Versión 1.1</p>
          <p className="text-xs text-gray-500 mt-1">© {new Date().getFullYear()} Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
