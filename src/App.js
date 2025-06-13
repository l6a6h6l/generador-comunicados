import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, RefreshCw, Copy, Trash2, Wrench, ChevronRight, Zap, MessageSquare, AlertTriangle, Bell, Settings, Plus, Minus } from 'lucide-react';

const GeneradorComunicados = () => {
  // Estados
  const [tipo, setTipo] = useState('evento-inicio');
  const [multiplesAlertamientos, setMultiplesAlertamientos] = useState(false);
  const [periodosAlertamiento, setPeriodosAlertamiento] = useState([
    { fechaInicio: '', horaInicio: '', fechaFin: '', horaFin: '', duracion: '00:00:00' }
  ]);
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

  // Calcular duraciones de múltiples períodos
  useEffect(() => {
    if (multiplesAlertamientos) {
      const nuevosPeriodos = periodosAlertamiento.map(periodo => {
        if (!periodo.fechaInicio || !periodo.horaInicio || !periodo.fechaFin || !periodo.horaFin) {
          return { ...periodo, duracion: '00:00:00' };
        }
        
        try {
          const inicio = new Date(`${periodo.fechaInicio}T${periodo.horaInicio}`);
          const fin = new Date(`${periodo.fechaFin}T${periodo.horaFin}`);
          const diferencia = fin - inicio;
          
          if (diferencia < 0) {
            return { ...periodo, duracion: '00:00:00' };
          }
          
          const horas = Math.floor(diferencia / (1000 * 60 * 60));
          const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
          
          const duracion = `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
          
          return { ...periodo, duracion };
        } catch (error) {
          return { ...periodo, duracion: '00:00:00' };
        }
      });
      
      // Solo actualizar si hay cambios reales en las duraciones
      const hayChangios = nuevosPeriodos.some((periodo, index) => 
        !periodosAlertamiento[index] || periodo.duracion !== periodosAlertamiento[index].duracion
      );
      
      if (hayChangios) {
        setPeriodosAlertamiento(nuevosPeriodos);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplesAlertamientos, periodosAlertamiento]);
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
    
    // Actualizar también el primer período
    setPeriodosAlertamiento([{
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual,
      duracion: '00:00:00'
    }]);
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
    
    // Resetear múltiples alertamientos
    setMultiplesAlertamientos(false);
    setPeriodosAlertamiento([
      { fechaInicio: fechaActual, horaInicio: horaActual, fechaFin: fechaActual, horaFin: horaActual, duracion: '00:00:00' }
    ]);
    
    setAlertaMensaje('¡Campos limpiados correctamente!');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const agregarPeriodo = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    
    setPeriodosAlertamiento(prev => [...prev, {
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual,
      duracion: '00:00:00'
    }]);
  };

  const eliminarPeriodo = (index) => {
    if (periodosAlertamiento.length > 1) {
      setPeriodosAlertamiento(prev => prev.filter((_, i) => i !== index));
    }
  };

  const actualizarPeriodo = (index, campo, valor) => {
    setPeriodosAlertamiento(prev => 
      prev.map((periodo, i) => {
        if (i === index) {
          const nuevoPeriodo = { ...periodo, [campo]: valor };
          
          // Calcular duración si tenemos todos los datos necesarios
          if (nuevoPeriodo.fechaInicio && nuevoPeriodo.horaInicio && nuevoPeriodo.fechaFin && nuevoPeriodo.horaFin) {
            try {
              const inicio = new Date(`${nuevoPeriodo.fechaInicio}T${nuevoPeriodo.horaInicio}`);
              const fin = new Date(`${nuevoPeriodo.fechaFin}T${nuevoPeriodo.horaFin}`);
              const diferencia = fin - inicio;
              
              if (diferencia >= 0) {
                const horas = Math.floor(diferencia / (1000 * 60 * 60));
                const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
                
                nuevoPeriodo.duracion = `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
              } else {
                nuevoPeriodo.duracion = '00:00:00';
              }
            } catch (error) {
              nuevoPeriodo.duracion = '00:00:00';
            }
          } else {
            nuevoPeriodo.duracion = '00:00:00';
          }
          
          return nuevoPeriodo;
        }
        return periodo;
      })
    );
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

  const calcularDuracionTotal = () => {
    if (!multiplesAlertamientos || periodosAlertamiento.length === 0) {
      return formData.duracionCalculada;
    }
    
    let totalSegundos = 0;
    
    periodosAlertamiento.forEach(periodo => {
      if (periodo.duracion !== '00:00:00') {
        const [horas, minutos, segundos] = periodo.duracion.split(':').map(Number);
        totalSegundos += (horas * 3600) + (minutos * 60) + segundos;
      }
    });
    
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    
    return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}:${segundos < 10 ? '0' + segundos : segundos}`;
  };

  const formatearPeriodosMultiples = () => {
    if (!multiplesAlertamientos || periodosAlertamiento.length === 0) {
      const fechaInicioFormateada = formatearFecha(formData.fechaInicioFin);
      const fechaFinFormateada = formatearFecha(formData.fechaFin);
      return `Inicio: ${fechaInicioFormateada} - ${formData.horaInicioFin}\nFin: ${fechaFinFormateada} - ${formData.horaFin}\nDuración: ${formData.duracionCalculada}`;
    }
    
    let resultado = `Duración Total: ${calcularDuracionTotal()}\nPeríodos de Alertamiento:`;
    
    periodosAlertamiento.forEach((periodo, index) => {
      const fechaInicioFormateada = formatearFecha(periodo.fechaInicio);
      const fechaFinFormateada = formatearFecha(periodo.fechaFin);
      resultado += `\n        Período ${index + 1}:`;
      resultado += `\n        Inicio: ${fechaInicioFormateada} - ${periodo.horaInicio}`;
      resultado += `\n        Fin: ${fechaFinFormateada} - ${periodo.horaFin}`;
      resultado += `\n        Duración: ${periodo.duracion}`;
      if (index < periodosAlertamiento.length - 1) {
        resultado += `\n`;
      }
    });
    
    return resultado;
  };

  const formatearImpacto = (impacto, valorPorDefecto) => {
    const impactoVal = impacto || valorPorDefecto;
    const lineas = impactoVal.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length <= 1) {
      // Una sola línea: mostrar en la misma línea
      return `Impacto: ${impactoVal}`;
    } else {
      // Múltiples líneas: mostrar debajo
      let resultado = "Impacto:";
      lineas.forEach(linea => {
        const lineaLimpia = linea.trim();
        if (lineaLimpia) {
          // Si la línea ya tiene bullet point, la dejamos como está; si no, la agregamos
          if (lineaLimpia.startsWith('•') || lineaLimpia.startsWith('-') || lineaLimpia.startsWith('*')) {
            resultado += `\n        ${lineaLimpia}`;
          } else {
            resultado += `\n        • ${lineaLimpia}`;
          }
        }
      });
      return resultado;
    }
  };

  const generarMensaje = () => {
    let mensaje = "";
    
    if (tipo === 'evento-inicio') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const estadoVal = formData.estadoInicio || "En revisión";
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `GESTIÓN EVENTO\n🟡 ${estadoVal}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}\nInicio: ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'evento-seguimiento') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `GESTIÓN EVENTO\n🔁 Seguimiento\n\nDescripción: ${descripcionVal}\n${impactoFormateado}`;
      
      if (formData.acciones && formData.acciones.trim()) {
        mensaje += "\nAcciones:";
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
      }
    }
    else if (tipo === 'evento-fin') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const estadoVal = formData.estadoFin || "Recuperado";
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      const periodosFormateados = formatearPeriodosMultiples();
      
      mensaje = `GESTIÓN EVENTO\n🟢 ${estadoVal}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}\n${periodosFormateados}`;
      
      if (formData.acciones && formData.acciones.trim()) {
        mensaje += "\nAcciones:";
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
      }
    }
    else if (tipo === 'mantenimiento-inicio') {
      const motivoVal = formData.motivo || "Descripción del Mantenimiento";
      const ejecutorVal = formData.ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = formData.estadoInicio || "En curso";
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      const impactoFormateado = formatearImpacto(formData.impactoMant, "Impacto servicio / usuarios / clientes");
      
      mensaje = `⚠️ MANTENIMIENTO\n\nEstado: ${estadoVal}\nMotivo: ${motivoVal}\n${impactoFormateado}\nEjecutor: ${ejecutorVal}\nInicio: ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'mantenimiento-fin') {
      const motivoVal = formData.motivo || "Descripción del Mantenimiento";
      const ejecutorVal = formData.ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento";
      const estadoVal = formData.estadoFin || "Finalizado";
      const impactoFormateado = formatearImpacto(formData.impactoMant, "Impacto servicio / usuarios / clientes");
      const periodosFormateados = formatearPeriodosMultiples();
      
      mensaje = `✅ MANTENIMIENTO\n\nEstado: ${estadoVal}\nMotivo: ${motivoVal}\n${impactoFormateado}\nEjecutor: ${ejecutorVal}\n${periodosFormateados}`;
    }
    else if (tipo === 'incidente-inicio') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const estadoVal = formData.estadoInicio || "En revisión";
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `GESTIÓN INCIDENTE\n🟡 ${estadoVal}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}\nInicio: ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'incidente-avance') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `GESTIÓN INCIDENTE\n🔁 Avance\n\nDescripción: ${descripcionVal}\n${impactoFormateado}`;
      
      if (formData.accionesEnCurso && formData.accionesEnCurso.trim()) {
        mensaje += "\nAcciones en curso:";
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
      
      if (formData.accionesEjecutadas && formData.accionesEjecutadas.trim()) {
        mensaje += "\nAcciones ejecutadas:";
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
      const estadoFin = 'Recuperado';
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      const periodosFormateados = formatearPeriodosMultiples();
      
      mensaje = `GESTIÓN INCIDENTE\n🟢 ${estadoFin}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}\n${periodosFormateados}`;
      
      if (formData.accionesEjecutadas && formData.accionesEjecutadas.trim()) {
        mensaje += "\nAcciones ejecutadas:";
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
    
    // Agregar nota si existe
    if (formData.nota) {
      if (tipo.startsWith('mantenimiento-')) {
        mensaje += `\n\n📣 NOTA:\n        Observaciones con detalle que permitan brindar más información en el caso que amerite.`;
        if (formData.nota.trim() !== "") {
          mensaje = mensaje.replace("Observaciones con detalle que permitan brindar más información en el caso que amerite.", formData.nota);
        }
      } else {
        mensaje += `\n\n📣 NOTA:\n        ${formData.nota}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-800 to-indigo-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-gradient-to-r from-blue-700/30 via-indigo-700/30 to-cyan-700/30 backdrop-blur-lg p-8 text-center rounded-3xl mb-10 border border-blue-400/30 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-slate-800">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent tracking-wider mb-3">
            Generador de Comunicados
          </h1>
          <p className="text-xl text-gray-200">
            Sistema Avanzado de Comunicaciones para el Grupo de Monitoreo
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <Bell className="w-4 h-4" />
              Notificaciones en tiempo real
            </span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Configuración avanzada
            </span>
          </div>
        </header>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Panel de tipos de comunicado */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-blue-400/40 sticky top-8">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2 mb-4">
                <ChevronRight className="w-5 h-5 text-blue-400" />
                Tipo de Comunicado
              </h2>
              
              <div className="space-y-4">
                {/* Eventos */}
                <div className="border border-blue-400/40 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 mr-1.5 text-blue-400" />
                    Eventos
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'evento-inicio'
                          ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-blue-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('evento-inicio')}
                    >
                      <span className="text-lg mb-1">🟡</span>
                      <span className="text-xs font-medium">Inicio</span>
                    </button>
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'evento-seguimiento'
                          ? 'bg-cyan-600/90 text-white shadow-lg shadow-cyan-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-cyan-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('evento-seguimiento')}
                    >
                      <RefreshCw className="w-4 h-4 mb-1" />
                      <span className="text-xs font-medium">Seguim.</span>
                    </button>
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'evento-fin'
                          ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-indigo-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('evento-fin')}
                    >
                      <span className="text-lg mb-1">🟢</span>
                      <span className="text-xs font-medium">Fin</span>
                    </button>
                  </div>
                </div>
                
                {/* Mantenimientos */}
                <div className="border border-blue-400/40 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                    <Wrench className="w-4 h-4 mr-1.5 text-cyan-400" />
                    Mantenimientos
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'mantenimiento-inicio'
                          ? 'bg-blue-700/90 text-white shadow-lg shadow-blue-700/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-blue-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('mantenimiento-inicio')}
                    >
                      <span className="text-lg mb-1">⚠️</span>
                      <span className="text-xs font-medium">Inicio</span>
                    </button>
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'mantenimiento-fin'
                          ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-indigo-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('mantenimiento-fin')}
                    >
                      <span className="text-lg mb-1">✅</span>
                      <span className="text-xs font-medium">Fin</span>
                    </button>
                  </div>
                </div>
                
                {/* Incidentes */}
                <div className="border border-blue-400/40 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 mr-1.5 text-blue-300" />
                    Incidentes
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'incidente-inicio'
                          ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-blue-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('incidente-inicio')}
                    >
                      <span className="text-lg mb-1">🟡</span>
                      <span className="text-xs font-medium">Inicio</span>
                    </button>
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'incidente-avance'
                          ? 'bg-cyan-600/90 text-white shadow-lg shadow-cyan-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-cyan-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('incidente-avance')}
                    >
                      <RefreshCw className="w-4 h-4 mb-1" />
                      <span className="text-xs font-medium">Avance</span>
                    </button>
                    <button
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                        tipo === 'incidente-fin'
                          ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/40'
                          : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-indigo-400/20 border border-transparent'
                      }`}
                      onClick={() => seleccionarTipo('incidente-fin')}
                    >
                      <span className="text-lg mb-1">🟢</span>
                      <span className="text-xs font-medium">Fin</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel de formulario y resultado */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formulario */}
            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-400/40">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2 mb-6">
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
                        className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                      <textarea 
                        className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        name="impacto"
                        placeholder="Impacto servicio / usuarios
Ejemplo:
• Servicio de correo intermitente
• Acceso lento a aplicaciones web
• Usuarios reportan demoras"
                        value={formData.impacto}
                        onChange={handleInputChange}
                      ></textarea>
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
                        className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                      <textarea 
                        className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        name="impactoMant"
                        placeholder="Impacto servicio / usuarios / clientes
Ejemplo:
• Indisponibilidad temporal del servicio X
• Lentitud en procesamiento de transacciones
• Acceso limitado a funcionalidades Y"
                        value={formData.impactoMant}
                        onChange={handleInputChange}
                      ></textarea>
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
                        className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                        className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                      className="w-full p-4 bg-slate-900/30 border border-blue-500/30 rounded-xl text-gray-300 cursor-not-allowed"
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
                    className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                  {/* Checkbox para múltiples alertamientos */}
                  <div className="bg-blue-700/15 border border-blue-400/30 rounded-xl p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={multiplesAlertamientos}
                        onChange={(e) => setMultiplesAlertamientos(e.target.checked)}
                        className="w-5 h-5 text-blue-600 border-2 border-blue-400 rounded focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0 bg-slate-800"
                      />
                      <span className="text-blue-200 font-semibold">Múltiples alertamientos temporales</span>
                    </label>
                    <p className="text-sm text-blue-200/70 mt-2 ml-8">
                      Activa esta opción si el incidente tuvo múltiples períodos de activación/recuperación
                    </p>
                  </div>

                  {multiplesAlertamientos ? (
                    /* Campos para múltiples períodos */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-300">Períodos de Alertamiento</h3>
                        <button
                          type="button"
                          onClick={agregarPeriodo}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Período
                        </button>
                      </div>
                      
                      {periodosAlertamiento.map((periodo, index) => (
                        <div key={index} className="bg-slate-700/60 rounded-xl p-6 relative border border-blue-400/20">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-semibold text-gray-200">Período {index + 1}</h4>
                            {periodosAlertamiento.length > 1 && (
                              <button
                                type="button"
                                onClick={() => eliminarPeriodo(index)}
                                className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-lg transition-all duration-200"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Fecha inicio:
                              </label>
                              <input 
                                className="w-full p-3 bg-slate-900/60 border border-blue-500/40 rounded-lg text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                                type="date" 
                                value={periodo.fechaInicio}
                                onChange={(e) => actualizarPeriodo(index, 'fechaInicio', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Hora inicio:
                              </label>
                              <input 
                                className="w-full p-3 bg-slate-900/60 border border-blue-500/40 rounded-lg text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                                type="time" 
                                step="1"
                                value={periodo.horaInicio}
                                onChange={(e) => actualizarPeriodo(index, 'horaInicio', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Fecha fin:
                              </label>
                              <input 
                                className="w-full p-3 bg-slate-900/60 border border-blue-500/40 rounded-lg text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                                type="date" 
                                value={periodo.fechaFin}
                                onChange={(e) => actualizarPeriodo(index, 'fechaFin', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Hora fin:
                              </label>
                              <input 
                                className="w-full p-3 bg-slate-900/60 border border-blue-500/40 rounded-lg text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                                type="time" 
                                step="1"
                                value={periodo.horaFin}
                                onChange={(e) => actualizarPeriodo(index, 'horaFin', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block mb-2 font-semibold text-gray-300">Duración:</label>
                            <div className="p-4 bg-gradient-to-r from-cyan-600/15 to-blue-600/15 border border-cyan-400/25 rounded-lg text-center">
                              <span className="text-2xl font-bold text-cyan-300">{periodo.duracion}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Campos normales de fecha/hora */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-2 font-semibold text-gray-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Fecha inicio:
                          </label>
                          <input 
                            className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                            className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                            className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                            className="w-full p-4 bg-slate-900/60 border border-blue-500/40 rounded-xl text-white focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
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
                        <div className="p-6 bg-gradient-to-r from-cyan-600/15 to-blue-600/15 border border-cyan-400/25 rounded-xl text-center">
                          <span className="text-3xl font-bold text-cyan-300">{formData.duracionCalculada}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={generarMensaje}
                >
                  <Zap className="w-5 h-5" />
                  Generar Comunicado
                </button>
              </div>
            </div>
            
            {/* Resultado */}
            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-400/40">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                Comunicado Generado
              </h2>
              <div className="bg-slate-900/90 p-6 rounded-xl font-mono border-l-4 border-cyan-500 mt-4 min-h-[200px] overflow-x-auto leading-relaxed">
                <pre className="whitespace-pre-wrap text-gray-100">{resultado || 'El comunicado generado aparecerá aquí...'}</pre>
              </div>
              
              {mostrarAlerta && (
                <div className="my-6 p-4 rounded-xl bg-cyan-500/20 border-l-4 border-cyan-500 backdrop-blur-sm">
                  <p className="text-cyan-300 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {alertaMensaje}
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 mt-8">
                <button 
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={copiar}
                >
                  <Copy className="w-5 h-5" />
                  Copiar al Portapapeles
                </button>
                <button 
                  className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-slate-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  onClick={limpiarCampos}
                >
                  <Trash2 className="w-5 h-5" />
                  Limpiar Campos
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center py-8 mt-12 text-gray-300 text-sm border-t border-blue-400/30">
          <p className="mb-2">Desarrollado por Luis Alberto Herrera Lara</p>
          <p className="text-blue-200">Generador de Comunicados Pro - Versión 4.0</p>
          <p className="text-xs mt-1">Sistema Avanzado de Comunicaciones</p>
          <p className="text-xs text-blue-300/70 mt-2">Actualizado el 13 de junio de 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
