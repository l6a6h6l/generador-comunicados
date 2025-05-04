import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, RefreshCw, Copy, Trash2, Wrench, ChevronRight, Zap, MessageSquare, AlertTriangle, Bell, Settings } from 'lucide-react';

const GeneradorComunicados = () => {
  // Estados
  const [tipo, setTipo] = useState('evento-inicio');
  const [formData, setFormData] = useState({
    descripcion: '',
    impacto: '',
    motivo: '',
    impactoMant: '',
    ejecutor: '',
    fechaInicio: '',
    horaInicio: '',
    estadoInicio: 'En revisión',
    acciones: '',
    accionesEjecutadas: '',
    accionesEnCurso: '',
    fechaInicioFin: '',
    horaInicioFin: '',
    fechaFin: '',
    horaFin: '',
    duracionCalculada: '00:00:00',
    estadoFin: 'Recuperado',
    nota: ''
  });
  const [resultado, setResultado] = useState('');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [alertaMensaje, setAlertaMensaje] = useState('¡Comunicado copiado al portapapeles!');

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Calcular duración cuando cambien las fechas u horas relevantes
  useEffect(() => {
    const calcularDuracionInterna = () => {
      try {
        if (!formData.fechaInicioFin || !formData.horaInicioFin || !formData.fechaFin || !formData.horaFin) {
          return;
        }
        
        const inicio = new Date(`${formData.fechaInicioFin}T${formData.horaInicioFin}`);
        const fin = new Date(`${formData.fechaFin}T${formData.horaFin}`);
        
        const diferencia = fin - inicio;
        
        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
        
        const duracion = 
          `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
        
        setFormData(prev => ({ ...prev, duracionCalculada: duracion }));
      } catch (error) {
        console.error('Error al calcular duración:', error);
      }
    };
    
    calcularDuracionInterna();
  }, [formData.fechaInicioFin, formData.horaInicioFin, formData.fechaFin, formData.horaFin]);
  
  // Actualizar estados por defecto cuando cambia el tipo
  useEffect(() => {
    setFormData(prev => {
      let estadoInicio = prev.estadoInicio;
      let estadoFin = prev.estadoFin;
      
      if (tipo === 'evento-inicio' || tipo === 'incidente-inicio') {
        estadoInicio = 'En revisión';
      } else if (tipo === 'evento-fin' || tipo === 'incidente-fin') {
        estadoFin = 'Recuperado';
      } else if (tipo === 'mantenimiento-inicio') {
        estadoInicio = 'En curso';
      } else if (tipo === 'mantenimiento-fin') {
        estadoFin = 'Finalizado';
      }
      
      return { ...prev, estadoInicio, estadoFin };
    });
  }, [tipo]);

  // Funciones
  const establecerFechaHoraActual = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    
    setFormData(prev => ({
      ...prev,
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaInicioFin: fechaActual,
      horaInicioFin: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual
    }));
  };
  
  const limpiarCampos = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    
    setFormData(prev => ({
      ...prev,
      descripcion: '',
      impacto: '',
      motivo: '',
      impactoMant: '',
      ejecutor: '',
      acciones: '',
      accionesEjecutadas: '',
      accionesEnCurso: '',
      nota: '',
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaInicioFin: fechaActual,
      horaInicioFin: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual
    }));
    
    setAlertaMensaje('¡Campos limpiados correctamente!');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const seleccionarTipo = (nuevoTipo) => {
    const tipoAnterior = tipo;
    setTipo(nuevoTipo);
    
    // Transferir datos entre tipos del mismo grupo
    
    // Para eventos
    if (tipoAnterior.startsWith('evento-') && nuevoTipo.startsWith('evento-')) {
      if (nuevoTipo === 'evento-fin') {
        setFormData(prev => ({
          ...prev,
          fechaInicioFin: prev.fechaInicio,
          horaInicioFin: prev.horaInicio,
          nota: tipoAnterior === 'evento-seguimiento' && prev.acciones && !prev.nota ? 
                "Acciones realizadas:\n" + prev.acciones : prev.nota
        }));
      }
      
      if (nuevoTipo === 'evento-seguimiento' && tipoAnterior === 'evento-inicio' && !formData.acciones) {
        setFormData(prev => ({ ...prev, acciones: "Acciones en proceso:\n" }));
      }
    }
    
    // Para incidentes
    if (tipoAnterior.startsWith('incidente-') && nuevoTipo.startsWith('incidente-')) {
      if (nuevoTipo === 'incidente-fin') {
        setFormData(prev => ({
          ...prev,
          fechaInicioFin: prev.fechaInicio,
          horaInicioFin: prev.horaInicio
        }));
      }
      
      if (nuevoTipo === 'incidente-avance' && tipoAnterior === 'incidente-inicio') {
        setFormData(prev => ({ ...prev, accionesEnCurso: "Acción 1. Proveedor / Área interna\n" }));
      }
    }
    
    // Para mantenimientos
    if (tipoAnterior.startsWith('mantenimiento-') && nuevoTipo.startsWith('mantenimiento-')) {
      if (tipoAnterior === 'mantenimiento-inicio' && nuevoTipo === 'mantenimiento-fin') {
        setFormData(prev => ({
          ...prev,
          fechaInicioFin: prev.fechaInicio,
          horaInicioFin: prev.horaInicio
        }));
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
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = formData.impacto || "Impacto servicio / usuarios";
      const estadoVal = formData.estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      
      mensaje = `*GESTIÓN EVENTO*\n🟡 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'evento-seguimiento') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = formData.impacto || "Impacto servicio / usuarios";
      
      mensaje = `*GESTIÓN EVENTO*\n🔁 *Seguimiento*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Acciones:*`;
      
      if (formData.acciones) {
        const lineasAcciones = formData.acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            if (linea.includes('%%')) {
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      } else {
        mensaje += "\n        • Sin acciones registradas";
      }
    }
    else if (tipo === 'evento-fin') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = formData.impacto || "Impacto servicio / usuarios";
      const estadoVal = formData.estadoFin || "Recuperado";
      
      const fechaInicioFormateada = formatearFecha(formData.fechaInicioFin);
      const fechaFinFormateada = formatearFecha(formData.fechaFin);
      
      mensaje = `*GESTIÓN EVENTO*\n🟢 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${formData.horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${formData.horaFin}\n*Duración:* ${formData.duracionCalculada}\n*Acciones:*`;
      
      if (formData.acciones) {
        const lineasAcciones = formData.acciones.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            if (linea.includes('%%')) {
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      } else {
        mensaje += "\n        • Sin acciones registradas";
      }
    }
    else if (tipo === 'mantenimiento-inicio') {
      const motivoVal = formData.motivo || "Descripción del Mantenimiento";
      const impactoVal = formData.impactoMant || "Impacto servicio / usuarios / clientes";
      const ejecutorVal = formData.ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = formData.estadoInicio || "En curso";
      
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      
      mensaje = `⚠️ *MANTENIMIENTO*\n\n*Estado:* ${estadoVal}\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'mantenimiento-fin') {
      const motivoVal = formData.motivo || "Descripción del Mantenimiento";
      const impactoVal = formData.impactoMant || "Impacto servicio / usuarios / clientes";
      const ejecutorVal = formData.ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = formData.estadoFin || "Finalizado";
      
      const fechaInicioFormateada = formatearFecha(formData.fechaInicioFin);
      const fechaFinFormateada = formatearFecha(formData.fechaFin);
      
      mensaje = `✅ *MANTENIMIENTO*\n\n*Estado:* ${estadoVal}\n*Motivo:* ${motivoVal}\n*Impacto:* ${impactoVal}\n*Ejecutor:* ${ejecutorVal}\n*Inicio:* ${fechaInicioFormateada} - ${formData.horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${formData.horaFin}\n*Duración:* ${formData.duracionCalculada}`;
    }
    else if (tipo === 'incidente-inicio') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = formData.impacto || "Impacto servicio / usuarios";
      const estadoVal = formData.estadoInicio || "En revisión";
      
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      
      mensaje = `*GESTIÓN INCIDENTE*\n🟡 *${estadoVal}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'incidente-avance') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = formData.impacto || "Impacto servicio / usuarios";
      
      mensaje = `*GESTIÓN INCIDENTE*\n🔁 *Avance*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}`;
      
      if (formData.accionesEnCurso) {
        mensaje += "\n*Acciones en curso:*";
        const lineasAcciones = formData.accionesEnCurso.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            if (linea.includes('%%')) {
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      }
      
      if (formData.accionesEjecutadas) {
        mensaje += "\n*Acciones ejecutadas:*";
        const lineasAcciones = formData.accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            if (linea.includes('%%')) {
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      }
    }
    else if (tipo === 'incidente-fin') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoVal = formData.impacto || "Impacto servicio / usuarios";
      const estadoFin = 'Recuperado';
      
      const fechaInicioFormateada = formatearFecha(formData.fechaInicioFin);
      const fechaFinFormateada = formatearFecha(formData.fechaFin);
      
      mensaje = `*GESTIÓN INCIDENTE*\n🟢 *${estadoFin}*\n\n*Descripción:* ${descripcionVal}\n*Impacto:* ${impactoVal}\n*Inicio:* ${fechaInicioFormateada} - ${formData.horaInicioFin}\n*Fin:* ${fechaFinFormateada} - ${formData.horaFin}\n*Duración:* ${formData.duracionCalculada}\n*Acciones ejecutadas:*`;
      
      if (formData.accionesEjecutadas) {
        const lineasAcciones = formData.accionesEjecutadas.split('\n');
        for (let i = 0; i < lineasAcciones.length; i++) {
          const linea = lineasAcciones[i].trim();
          if (linea) {
            if (linea.includes('%%')) {
              const [accion, responsable] = linea.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) {
                mensaje += `\n          Responsable: ${responsable}`;
              }
            } else {
              mensaje += `\n        • ${linea}`;
            }
          }
        }
      } else {
        mensaje += "\n        • Sin acciones ejecutadas";
      }
    }
    
    // Agregar nota si existe
    if (formData.nota) {
      if (tipo.startsWith('mantenimiento-')) {
        mensaje += `\n\n*📣 NOTA:*\n        Observaciones con detalle que permitan brindar más información en el caso que amerite.`;
        if (formData.nota.trim() !== "") {
          mensaje = mensaje.replace("Observaciones con detalle que permitan brindar más información en el caso que amerite.", formData.nota);
        }
      } else {
        mensaje += `\n\n*📣 NOTA:*\n        ${formData.nota}`;
      }
    }
    
    setResultado(mensaje);
    setMostrarAlerta(false);
  };

  const copiar = () => {
    if (!resultado) {
      alert("No hay ningún comunicado generado para copiar.");
      return;
    }
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(resultado)
        .then(() => {
          setAlertaMensaje('¡Comunicado copiado al portapapeles!');
          setMostrarAlerta(true);
          setTimeout(() => setMostrarAlerta(false), 3000);
        })
        .catch(err => {
          console.error('Error al copiar:', err);
          copiarMetodoAlternativo();
        });
    } else {
      copiarMetodoAlternativo();
    }
  };

  const copiarMetodoAlternativo = () => {
    const textArea = document.createElement("textarea");
    textArea.value = resultado;
    
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
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
        alert("No se pudo copiar automáticamente. Por favor, selecciona y copia el texto manualmente:\n\n" + resultado);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
      alert("Error al copiar. Por favor, selecciona y copia el texto manualmente.");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // Componente de tipo de comunicado
  const TipoComunicado = ({ icon: Icon, label, value, isActive, color }) => (
    <div 
      className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isActive 
          ? `bg-${color}-600/90 text-white shadow-lg shadow-${color}-600/30 ring-2 ring-${color}-400/50` 
          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70 hover:text-white'
      }`}
      onClick={() => seleccionarTipo(value)}
    >
      {typeof Icon === 'string' ? (
        <span className="text-3xl mb-2">{Icon}</span>
      ) : (
        <Icon className="w-8 h-8 mb-2" />
      )}
      <span className="font-semibold text-sm text-center">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 backdrop-blur-lg p-8 text-center rounded-3xl mb-10 border border-blue-500/20 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wider mb-3">
            Generador de Comunicados
          </h1>
          <p className="text-xl text-gray-300">
            Sistema Avanzado de Comunicaciones para el Grupo de Monitoreo
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Bell className="w-4 h-4" />
              Notificaciones en tiempo real
            </span>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Configuración avanzada
            </span>
          </div>
        </header>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de tipos de comunicado */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700/50 sticky top-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                <ChevronRight className="w-6 h-6 text-blue-400" />
                Tipo de Comunicado
              </h2>
              
              {/* Eventos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                  Eventos
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <TipoComunicado 
                    icon="🟡" 
                    label="Inicio" 
                    value="evento-inicio" 
                    isActive={tipo === 'evento-inicio'} 
                    color="yellow" 
                  />
                  <TipoComunicado 
                    icon={RefreshCw} 
                    label="Seguimiento" 
                    value="evento-seguimiento" 
                    isActive={tipo === 'evento-seguimiento'} 
                    color="blue" 
                  />
                  <TipoComunicado 
                    icon="🟢" 
                    label="Fin" 
                    value="evento-fin" 
                    isActive={tipo === 'evento-fin'} 
                    color="green" 
                  />
                </div>
              </div>
              
              {/* Mantenimientos */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Wrench className="w-5 h-5 mr-2 text-orange-400" />
                  Mantenimientos
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <TipoComunicado 
                    icon="⚠️" 
                    label="Inicio" 
                    value="mantenimiento-inicio" 
                    isActive={tipo === 'mantenimiento-inicio'} 
                    color="orange" 
                  />
                  <TipoComunicado 
                    icon="✅" 
                    label="Fin" 
                    value="mantenimiento-fin" 
                    isActive={tipo === 'mantenimiento-fin'} 
                    color="green" 
                  />
                </div>
              </div>
              
              {/* Incidentes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Incidentes
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <TipoComunicado 
                    icon="🟡" 
                    label="Inicio" 
                    value="incidente-inicio" 
                    isActive={tipo === 'incidente-inicio'} 
                    color="red" 
                  />
                  <TipoComunicado 
                    icon={RefreshCw} 
                    label="Avance" 
                    value="incidente-avance" 
                    isActive={tipo === 'incidente-avance'} 
                    color="orange" 
                  />
                  <TipoComunicado 
                    icon="🟢" 
                    label="Fin" 
                    value="incidente-fin" 
                    isActive={tipo === 'incidente-fin'} 
                    color="green" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel de formulario y resultado */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formulario */}
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-blue-400" />
                Detalles del Comunicado
              </h2>

              {/* Campos para Evento o Incidente */}
              {(tipo.startsWith('evento-') || tipo.startsWith('incidente-')) && (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Descripción:</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="text" 
                        name="descripcion"
                        placeholder="DESCRIPCION DEL INCIDENTE"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="text" 
                        name="impacto"
                        placeholder="Impacto servicio / usuarios"
                        value={formData.impacto}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Campos para Mantenimiento */}
              {tipo.startsWith('mantenimiento-') && (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Motivo:</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="text" 
                        name="motivo"
                        placeholder="Descripción del Mantenimiento"
                        value={formData.motivo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Impacto:</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="text" 
                        name="impactoMant"
                        placeholder="Impacto servicio / usuarios / clientes"
                        value={formData.impactoMant}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Ejecutor:</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="text" 
                        name="ejecutor"
                        placeholder="Nombre del proveedor o área interna que ejecuta el mantenimiento"
                        value={formData.ejecutor}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Campos comunes para Inicio */}
              {(tipo.endsWith('-inicio')) && (
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha:
                      </label>
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="date" 
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Hora:
                      </label>
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="time" 
                        step="1"
                        name="horaInicio"
                        value={formData.horaInicio}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
                    <input 
                      className="w-full p-4 bg-gray-900/30 border border-gray-600/50 rounded-xl text-gray-400 cursor-not-allowed"
                      type="text" 
                      value={formData.estadoInicio}
                      readOnly
                    />
                  </div>
                </div>
              )}

              {/* Campos para Seguimiento (solo Eventos) */}
              {tipo === 'evento-seguimiento' && (
                <div className="mt-6">
                  <label className="block mb-2 font-semibold text-gray-300">Acciones (una por línea):</label>
                  <textarea 
                    className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Monitoreo continuo del servicio %% Equipo NOC
Validación de métricas %% Soporte N2
Revisión de logs de aplicación"
                    name="acciones"
                    value={formData.acciones}
                    onChange={handleInputChange}
                  ></textarea>
                  <p className="text-sm text-gray-400 mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Use %% para separar la acción del responsable. Si no incluye responsable, solo escriba la acción.
                  </p>
                </div>
              )}
              
              {/* Campos para Avance (solo Incidentes) */}
              {tipo === 'incidente-avance' && (
                <div className="space-y-6 mt-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Acciones en curso (una por línea):</label>
                    <textarea 
                      className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Análisis de logs %% Equipo de Monitoreo
Revisión de configuración %% DBA Team
Escalamiento a proveedor"
                      name="accionesEnCurso"
                      value={formData.accionesEnCurso}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Acciones ejecutadas (una por línea):</label>
                    <textarea 
                      className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Reinicio de servicios %% Equipo de Infraestructura
Limpieza de caché %% Soporte N1
Verificación inicial"
                      name="accionesEjecutadas"
                      value={formData.accionesEjecutadas}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Use %% para separar la acción del responsable. Si no incluye responsable, solo escriba la acción.
                  </p>
                </div>
              )}
              
              {/* Campos para Fin */}
              {tipo.endsWith('-fin') && (
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha inicio:
                      </label>
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="date" 
                        name="fechaInicioFin"
                        value={formData.fechaInicioFin}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Hora inicio:
                      </label>
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="time" 
                        step="1"
                        name="horaInicioFin"
                        value={formData.horaInicioFin}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha fin:
                      </label>
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="date" 
                        name="fechaFin"
                        value={formData.fechaFin}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Hora fin:
                      </label>
                      <input 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        type="time" 
                        step="1"
                        name="horaFin"
                        value={formData.horaFin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Duración calculada:</label>
                    <div className="p-6 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-xl text-center">
                      <span className="text-3xl font-bold text-blue-400">{formData.duracionCalculada}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
                    <input 
                      className="w-full p-4 bg-gray-900/30 border border-gray-600/50 rounded-xl text-gray-400 cursor-not-allowed"
                      type="text" 
                      value={formData.estadoFin}
                      readOnly
                    />
                  </div>
                  
                  {(tipo === 'evento-fin' || tipo === 'incidente-fin') && (
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300">Acciones ejecutadas:</label>
                      <textarea 
                        className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Formato: Acción %% Responsable (opcional)
Ejemplo:
Reinicio del servidor %% Equipo de Infraestructura
Actualización de base de datos %% DBA Team
Verificación de logs"
                        name={tipo === 'evento-fin' ? 'acciones' : 'accionesEjecutadas'}
                        value={tipo === 'evento-fin' ? formData.acciones : formData.accionesEjecutadas}
                        onChange={handleInputChange}
                      ></textarea>
                      <p className="text-sm text-gray-400 mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Use %% para separar la acción del responsable. Si no incluye responsable, solo escriba la acción.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8">
                <label className="block mb-2 font-semibold text-gray-300">Nota adicional (opcional):</label>
                <textarea 
                  className="w-full p-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="Observaciones con detalle que permitan brindar más información en el caso que amerite"
                  name="nota"
                  value={formData.nota}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={generarMensaje}
                >
                  <Zap className="w-5 h-5" />
                  Generar Comunicado
                </button>
              </div>
            </div>
            
            {/* Resultado */}
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                Comunicado Generado
              </h2>
              <div className="bg-gray-900/80 p-6 rounded-xl font-mono border-l-4 border-blue-500 mt-4 min-h-[200px] overflow-x-auto leading-relaxed">
                <pre className="whitespace-pre-wrap text-gray-100">{resultado || 'El comunicado generado aparecerá aquí...'}</pre>
              </div>
              
              {mostrarAlerta && (
                <div className="my-6 p-4 rounded-xl bg-green-500/20 border-l-4 border-green-500 backdrop-blur-sm">
                  <p className="text-green-400 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {alertaMensaje}
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 mt-8">
                <button 
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={copiar}
                >
                  <Copy className="w-5 h-5" />
                  Copiar al Portapapeles
                </button>
                <button 
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={limpiarCampos}
                >
                  <Trash2 className="w-5 h-5" />
                  Limpiar Campos
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center py-8 mt-12 text-gray-400 text-sm border-t border-gray-700/50">
          <p className="mb-2">Desarrollado por Luis Alberto Herrera Lara</p>
          <p>Generador de Comunicados Pro - Versión 2.0</p>
          <p className="text-xs mt-1">Sistema Avanzado de Comunicaciones</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
