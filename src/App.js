/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, RefreshCw, Copy, Trash2, Wrench, ChevronRight, Zap, MessageSquare, AlertTriangle, Bell, Settings, Plus, Minus, User, Lock, Eye, EyeOff, CreditCard, Building, Globe } from 'lucide-react';
/* eslint-enable no-unused-vars */

const GeneradorComunicados = () => {
  // Servicios transaccionales
  const SERVICIOS_TRANSACCIONALES = [
    {
      id: 'datafast-visa-mc',
      nombre: 'DATAFAST VISA-MC',
      descripcion: 'Transacciones locales Visa (débito/crédito) y MasterCard (crédito) en red propia',
      categoria: 'datafast',
      icono: '💳'
    },
    {
      id: 'datafast-diners-dc',
      nombre: 'DATAFAST DINERS-DC', 
      descripcion: 'Transacciones locales Diners (débito/crédito) y Discover (crédito) en red propia',
      categoria: 'datafast',
      icono: '💳'
    },
    {
      id: 'banred-pago-tc',
      nombre: 'BANRED (PAGO A TARJETA DE CRÉDITO)',
      descripcion: 'Transacciones entre bancos asociados BANRED: tarjetas de crédito, cuentas corrientes y ahorro',
      categoria: 'banred',
      icono: '🏦'
    },
    {
      id: 'banred-base24',
      nombre: 'BANRED BASE 24 (DÉBITOS)',
      descripcion: 'Transacciones tarjetas de débito Banco Pichincha y bancos asociados BANRED',
      categoria: 'banred',
      icono: '🏦'
    },
    {
      id: 'banred-base25',
      nombre: 'BANRED BASE 25 (ATM - TARJETAS DE CRÉDITO)',
      descripcion: 'Transacciones ATM tarjetas de crédito Banco Pichincha y bancos asociados BANRED',
      categoria: 'banred',
      icono: '🏧'
    },
    {
      id: 'usp-atalla',
      nombre: 'USP ATALLA',
      descripcion: 'Validación de tarjetas propias de débito y crédito BANCO PICHINCHA',
      categoria: 'validacion',
      icono: '🔐'
    },
    {
      id: 'efectivo-express',
      nombre: 'EFECTIVO EXPRESS',
      descripcion: 'Avances de efectivo por ventanilla Banco Pichincha',
      categoria: 'efectivo',
      icono: '💵'
    },
    {
      id: 'diners-internacional-1',
      nombre: 'DINERS CLUB INTERNACIONAL 1',
      descripcion: 'Transacciones crédito Diners/Discover: tarjetas propias en red ajena y ajenas en red propia',
      categoria: 'internacional',
      icono: '🌐'
    },
    {
      id: 'diners-internacional-2',
      nombre: 'DINERS CLUB INTERNACIONAL 2',
      descripcion: 'Transacciones crédito Diners/Discover: tarjetas propias en red ajena y ajenas en red propia',
      categoria: 'internacional',
      icono: '🌐'
    },
    {
      id: 'pulse-discover',
      nombre: 'PULSE / DISCOVER FS',
      descripcion: 'Transacciones tarjetas ajenas Diners y Discover en cajeros autorizados',
      categoria: 'internacional',
      icono: '🏧'
    },
    {
      id: 'llaves-dci',
      nombre: 'LLAVES DCI',
      descripcion: 'Intercambio de llaves con franquicias DCI/Discover',
      categoria: 'seguridad',
      icono: '🔑'
    },
    {
      id: 'visa-int-emision',
      nombre: 'VISA INTERNACIONAL EMISIÓN',
      descripcion: 'Transacciones débito/crédito tarjetas propias en red ajena',
      categoria: 'internacional',
      icono: '🌍'
    },
    {
      id: 'visa-int-adquirencia',
      nombre: 'VISA INTERNACIONAL ADQUIRENCIA',
      descripcion: 'Transacciones crédito tarjetas ajenas en red propia',
      categoria: 'internacional',
      icono: '🌍'
    },
    {
      id: 'mastercard-mci',
      nombre: 'MASTERCARD INTERNACIONAL MCI',
      descripcion: 'Transacciones crédito tarjetas propias en red ajena',
      categoria: 'internacional',
      icono: '🌍'
    },
    {
      id: 'mastercard-mds',
      nombre: 'MASTERCARD INTERNACIONAL MDS',
      descripcion: 'Transacciones crédito tarjetas ajenas en red propia',
      categoria: 'internacional',
      icono: '🌍'
    },
    {
      id: 'broker',
      nombre: 'BROKER',
      descripcion: 'Avances de efectivo en cajeros ATM sin tarjeta de crédito',
      categoria: 'efectivo',
      icono: '🏧'
    },
    {
      id: 'jardin-azuayo',
      nombre: 'JARDÍN AZUAYO',
      descripcion: 'Transacciones débito Visa de Cooperativa Jardín Azuayo',
      categoria: 'cooperativas',
      icono: '🏛️'
    },
    {
      id: 'dock',
      nombre: 'DOCK (EN PROCESO DE IMPLEMENTACIÓN)',
      descripcion: 'Transacciones débito Banco Diners Club del Ecuador',
      categoria: 'implementacion',
      icono: '⚡'
    },
    {
      id: 'bpc-bp',
      nombre: 'BPC-BP',
      descripcion: 'Transacciones tarjeta prepago de transporte Banco Pichincha',
      categoria: 'prepago',
      icono: '🚌'
    }
  ];

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ usuario: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Credenciales - Usuarios válidos
  const USUARIOS_VALIDOS = [
    { usuario: 'fractalia', password: 'fractalia4ever' },
    { usuario: 'gabriela', password: 'gabyRocks2025' },
    { usuario: 'gestores', password: 'todosLosSapitos' },
    { usuario: 'dorian', password: 'dorianGrayIncidentes' }
  ];

  // Estados principales
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
  const [mostrarServicios, setMostrarServicios] = useState(false);
  
  // Estados del semáforo
  const [tiempoAbierto, setTiempoAbierto] = useState(Date.now());
  const [mostrarActualizacion, setMostrarActualizacion] = useState(false);
  const [mostrarConfirmacionDuracion, setMostrarConfirmacionDuracion] = useState(false);
  const [noPreguntar, setNoPreguntar] = useState(false);

  // Establecer fechas y horas actuales al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Timer del semáforo - actualizar cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const horasAbierto = (Date.now() - tiempoAbierto) / (1000 * 60 * 60);
      
      // Auto-refresh cada hora (si no ha dicho "no preguntar")
      if (!noPreguntar && horasAbierto >= 1 && horasAbierto % 1 < 0.017) { // ~1 minuto de margen
        setMostrarActualizacion(true);
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [tiempoAbierto, noPreguntar]);

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

  // Funciones de autenticación
  const handleLogin = () => {
    // Verificar si las credenciales coinciden con algún usuario válido
    const usuarioValido = USUARIOS_VALIDOS.find(
      user => user.usuario === loginForm.usuario && user.password === loginForm.password
    );
    
    if (usuarioValido) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('¡Credenciales incorrectas! ¿Eres realmente del equipo? 🤔');
      setTimeout(() => setLoginError(''), 3000);
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ usuario: '', password: '' });
  };

  // Funciones de servicios transaccionales
  const seleccionarServicio = (servicio) => {
    const campoImpacto = tipo.startsWith('mantenimiento-') ? 'impactoMant' : 'impacto';
    const impactoActual = formData[campoImpacto];
    
    // Usar solo la descripción del servicio afectado
    const servicioTexto = servicio.descripcion;
    
    // Agregar al campo de impacto
    let nuevoImpacto;
    if (!impactoActual || impactoActual.trim() === '') {
      nuevoImpacto = servicioTexto;
    } else {
      // Si ya hay contenido, agregar en nueva línea
      nuevoImpacto = impactoActual + '\n' + servicioTexto;
    }
    
    setFormData(prev => ({ ...prev, [campoImpacto]: nuevoImpacto }));
    
    // Mostrar confirmación
    setAlertaMensaje(`✅ Servicio "${servicio.nombre}" agregado al impacto`);
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 2000);
  };

  const limpiarImpactos = () => {
    const campoImpacto = tipo.startsWith('mantenimiento-') ? 'impactoMant' : 'impacto';
    setFormData(prev => ({ ...prev, [campoImpacto]: '' }));
    
    setAlertaMensaje('🧹 Impactos limpiados');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 2000);
  };

  // Funciones del semáforo
  const calcularTiempoAbierto = () => {
    const diferencia = Date.now() - tiempoAbierto;
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    return { horas, minutos, total: diferencia / (1000 * 60 * 60) };
  };

  const getEstadoSemaforo = () => {
    const { total } = calcularTiempoAbierto();
    if (total < 1) return { color: '🟢', estado: 'Fechas actualizadas', clase: 'text-green-400' };
    if (total < 4) return { color: '🟡', estado: 'Revisar fechas', clase: 'text-yellow-400' };
    return { color: '🔴', estado: '¡Fechas desactualizadas!', clase: 'text-red-400' };
  };

  const actualizarFechasAhora = () => {
    establecerFechaHoraActual();
    setTiempoAbierto(Date.now());
    setMostrarActualizacion(false);
    setAlertaMensaje('🔄 Fechas actualizadas a la hora actual');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const verificarDuracionSospechosa = () => {
    if (!formData.fechaInicioFin || !formData.horaInicioFin || !formData.fechaFin || !formData.horaFin) {
      return false;
    }

    try {
      const inicio = new Date(`${formData.fechaInicioFin}T${formData.horaInicioFin}`);
      const fin = new Date(`${formData.fechaFin}T${formData.horaFin}`);
      const diferencia = fin - inicio;
      const horas = diferencia / (1000 * 60 * 60);
      
      return horas > 4; // Más de 4 horas es sospechoso
    } catch {
      return false;
    }
  };

  // Funciones principales
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
    // Verificar duración sospechosa antes de generar
    if ((tipo.endsWith('-fin')) && verificarDuracionSospechosa()) {
      setMostrarConfirmacionDuracion(true);
      return;
    }

    // Continúa con la generación normal
    generarMensajeInterno();
  };

  const generarMensajeInterno = () => {
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

  // Renderizado condicional para login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-emerald-400/40">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                <MessageSquare className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">
                Generador de Comunicados
              </h1>
              <p className="text-gray-400 text-sm">Versión 5.0 - Acceso Restringido</p>
            </div>

            {/* Formulario de login */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    type="text"
                    name="usuario"
                    value={loginForm.usuario}
                    onChange={handleLoginInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
                    placeholder="Ingresa tu usuario"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginInputChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-4 rounded-xl bg-red-500/20 border-l-4 border-red-500">
                  <p className="text-red-300 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {loginError}
                  </p>
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  Acceder al Sistema
                </div>
              </button>
            </div>

            {/* Banner informativo */}
            <div className="mt-6 p-4 bg-emerald-700/15 border border-emerald-400/30 rounded-xl">
              <p className="text-emerald-200/70 text-xs text-center">
                💬 <strong>Generador de Comunicados</strong> - Eventos, Incidentes y Mantenimientos
              </p>
              <p className="text-emerald-200/50 text-xs text-center mt-2">
                Sistema especializado para comunicaciones de monitoreo
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs">
              Generador de Comunicados Pro v5.0 - Desarrollado por Luis Alberto Herrera Lara
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Aplicación principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="bg-gradient-to-r from-emerald-700/30 via-teal-700/30 to-green-700/30 backdrop-blur-lg p-8 text-center rounded-3xl mb-10 border border-emerald-400/30 shadow-2xl relative">
          {/* Semáforo de estado */}
          <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-400/30">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getEstadoSemaforo().color}</span>
              <div>
                <div className={`font-semibold ${getEstadoSemaforo().clase}`}>
                  {calcularTiempoAbierto().horas}h {calcularTiempoAbierto().minutos}m abierta
                </div>
                <div className="text-xs text-gray-400">{getEstadoSemaforo().estado}</div>
              </div>
              <button
                onClick={actualizarFechasAhora}
                className="ml-2 bg-teal-600/20 hover:bg-teal-600/40 text-teal-300 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-slate-700/60 hover:bg-slate-600/60 text-gray-300 hover:text-white p-2 rounded-lg transition-all duration-200 text-sm flex items-center gap-1"
            title="Cerrar Sesión"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>

          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-green-300 bg-clip-text text-transparent tracking-wider mb-3">
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
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="flex items-center gap-1 text-emerald-300">
              <User className="w-4 h-4" />
              Usuario: {loginForm.usuario || 'invitado'}
            </span>
          </div>
        </header>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Panel de tipos de comunicado */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-emerald-400/40 sticky top-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-2 mb-4">
                  <ChevronRight className="w-5 h-5 text-emerald-400" />
                  Tipo de Comunicado
                </h2>
                
                <div className="space-y-4">
                  {/* Eventos */}
                  <div className="border border-emerald-400/40 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                      <AlertCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                      Eventos
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'evento-inicio'
                            ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-emerald-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('evento-inicio')}
                      >
                        <span className="text-lg mb-1">🟡</span>
                        <span className="text-xs font-medium">Inicio</span>
                      </button>
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'evento-seguimiento'
                            ? 'bg-teal-600/90 text-white shadow-lg shadow-teal-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-teal-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('evento-seguimiento')}
                      >
                        <RefreshCw className="w-4 h-4 mb-1" />
                        <span className="text-xs font-medium">Seguim.</span>
                      </button>
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'evento-fin'
                            ? 'bg-green-600/90 text-white shadow-lg shadow-green-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-green-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('evento-fin')}
                      >
                        <span className="text-lg mb-1">🟢</span>
                        <span className="text-xs font-medium">Fin</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Mantenimientos */}
                  <div className="border border-emerald-400/40 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                      <Wrench className="w-4 h-4 mr-1.5 text-teal-400" />
                      Mantenimientos
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'mantenimiento-inicio'
                            ? 'bg-emerald-700/90 text-white shadow-lg shadow-emerald-700/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-emerald-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('mantenimiento-inicio')}
                      >
                        <span className="text-lg mb-1">⚠️</span>
                        <span className="text-xs font-medium">Inicio</span>
                      </button>
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'mantenimiento-fin'
                            ? 'bg-green-600/90 text-white shadow-lg shadow-green-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-green-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('mantenimiento-fin')}
                      >
                        <span className="text-lg mb-1">✅</span>
                        <span className="text-xs font-medium">Fin</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Incidentes */}
                  <div className="border border-emerald-400/40 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 mr-1.5 text-emerald-300" />
                      Incidentes
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'incidente-inicio'
                            ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-emerald-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('incidente-inicio')}
                      >
                        <span className="text-lg mb-1">🟡</span>
                        <span className="text-xs font-medium">Inicio</span>
                      </button>
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'incidente-avance'
                            ? 'bg-teal-600/90 text-white shadow-lg shadow-teal-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-teal-400/20 border border-transparent'
                        }`}
                        onClick={() => seleccionarTipo('incidente-avance')}
                      >
                        <RefreshCw className="w-4 h-4 mb-1" />
                        <span className="text-xs font-medium">Avance</span>
                      </button>
                      <button
                        className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                          tipo === 'incidente-fin'
                            ? 'bg-green-600/90 text-white shadow-lg shadow-green-600/40'
                            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/70 hover:border-green-400/20 border border-transparent'
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

              {/* Panel de Servicios Transaccionales */}
              <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-emerald-400/40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    Servicios Transaccionales
                  </h2>
                  <button
                    onClick={() => setMostrarServicios(!mostrarServicios)}
                    className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 p-2 rounded-lg transition-all duration-200"
                  >
                    {mostrarServicios ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {mostrarServicios && (
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={limpiarImpactos}
                        className="text-xs bg-slate-700/60 hover:bg-slate-600/60 text-gray-300 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Limpiar
                      </button>
                    </div>

                    {/* DATAFAST */}
                    <div className="border border-blue-400/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-blue-300 mb-2 uppercase tracking-wider">
                        💳 DATAFAST
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {SERVICIOS_TRANSACCIONALES.filter(s => s.categoria === 'datafast').map(servicio => (
                          <button
                            key={servicio.id}
                            onClick={() => seleccionarServicio(servicio)}
                            className="text-left bg-slate-700/50 hover:bg-blue-600/30 border border-transparent hover:border-blue-400/40 text-gray-300 hover:text-blue-200 p-2 rounded-lg transition-all duration-200 text-xs"
                          >
                            <div className="font-medium">{servicio.nombre}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BANRED */}
                    <div className="border border-purple-400/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wider">
                        🏦 BANRED
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {SERVICIOS_TRANSACCIONALES.filter(s => s.categoria === 'banred').map(servicio => (
                          <button
                            key={servicio.id}
                            onClick={() => seleccionarServicio(servicio)}
                            className="text-left bg-slate-700/50 hover:bg-purple-600/30 border border-transparent hover:border-purple-400/40 text-gray-300 hover:text-purple-200 p-2 rounded-lg transition-all duration-200 text-xs"
                          >
                            <div className="font-medium">{servicio.nombre}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* INTERNACIONAL */}
                    <div className="border border-teal-400/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-teal-300 mb-2 uppercase tracking-wider">
                        🌍 INTERNACIONAL
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {SERVICIOS_TRANSACCIONALES.filter(s => s.categoria === 'internacional').map(servicio => (
                          <button
                            key={servicio.id}
                            onClick={() => seleccionarServicio(servicio)}
                            className="text-left bg-slate-700/50 hover:bg-teal-600/30 border border-transparent hover:border-teal-400/40 text-gray-300 hover:text-teal-200 p-2 rounded-lg transition-all duration-200 text-xs"
                          >
                            <div className="font-medium">{servicio.nombre}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* OTROS SERVICIOS */}
                    <div className="border border-emerald-400/30 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-emerald-300 mb-2 uppercase tracking-wider">
                        ⚡ OTROS SERVICIOS
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {SERVICIOS_TRANSACCIONALES.filter(s => !['datafast', 'banred', 'internacional'].includes(s.categoria)).map(servicio => (
                          <button
                            key={servicio.id}
                            onClick={() => seleccionarServicio(servicio)}
                            className="text-left bg-slate-700/50 hover:bg-emerald-600/30 border border-transparent hover:border-emerald-400/40 text-gray-300 hover:text-emerald-200 p-2 rounded-lg transition-all duration-200 text-xs"
                          >
                            <div className="font-medium">{servicio.icono} {servicio.nombre}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Panel de formulario y resultado */}
          <div className="lg:col-span-3 space-y-8">
            {/* Formulario */}
            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-emerald-400/40">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-emerald-400" />
                Detalles del Comunicado
              </h2>

              {/* Campos para Evento o Incidente */}
              {(tipo.startsWith('evento-') || tipo.startsWith('incidente-')) && (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Descripción:</label>
                    <div className="relative">
                      <input 
                        className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                        className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                        className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                        className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                        className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                        <span className="text-sm">{getEstadoSemaforo().color}</span>
                      </label>
                      <input 
                        className={`w-full p-4 bg-slate-900/60 border rounded-xl text-white focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 ${
                          getEstadoSemaforo().color === '🔴' ? 'border-red-500/60' : 
                          getEstadoSemaforo().color === '🟡' ? 'border-yellow-500/60' : 'border-emerald-500/40'
                        }`}
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
                        <span className="text-sm">{getEstadoSemaforo().color}</span>
                      </label>
                      <input 
                        className={`w-full p-4 bg-slate-900/60 border rounded-xl text-white focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 ${
                          getEstadoSemaforo().color === '🔴' ? 'border-red-500/60' : 
                          getEstadoSemaforo().color === '🟡' ? 'border-yellow-500/60' : 'border-emerald-500/40'
                        }`}
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
                      className="w-full p-4 bg-slate-900/30 border border-emerald-500/30 rounded-xl text-gray-300 cursor-not-allowed"
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
                    className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                      className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                      className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                  <div className="bg-emerald-700/15 border border-emerald-400/30 rounded-xl p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={multiplesAlertamientos}
                        onChange={(e) => setMultiplesAlertamientos(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 border-2 border-emerald-400 rounded focus:ring-2 focus:ring-teal-400 focus:ring-offset-0 bg-slate-800"
                      />
                      <span className="text-emerald-200 font-semibold">Múltiples alertamientos temporales</span>
                    </label>
                    <p className="text-sm text-emerald-200/70 mt-2 ml-8">
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
                          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Período
                        </button>
                      </div>
                      
                      {periodosAlertamiento.map((periodo, index) => (
                        <div key={index} className="bg-slate-700/60 rounded-xl p-6 relative border border-emerald-400/20">
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
                                className="w-full p-3 bg-slate-900/60 border border-emerald-500/40 rounded-lg text-white focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                                className="w-full p-3 bg-slate-900/60 border border-emerald-500/40 rounded-lg text-white focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                                className="w-full p-3 bg-slate-900/60 border border-emerald-500/40 rounded-lg text-white focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                                className="w-full p-3 bg-slate-900/60 border border-emerald-500/40 rounded-lg text-white focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
                                type="time" 
                                step="1"
                                value={periodo.horaFin}
                                onChange={(e) => actualizarPeriodo(index, 'horaFin', e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block mb-2 font-semibold text-gray-300">Duración:</label>
                            <div className="p-4 bg-gradient-to-r from-teal-600/15 to-emerald-600/15 border border-teal-400/25 rounded-lg text-center">
                              <span className="text-2xl font-bold text-teal-300">{periodo.duracion}</span>
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
                            <span className="text-sm">{getEstadoSemaforo().color}</span>
                          </label>
                          <input 
                            className={`w-full p-4 bg-slate-900/60 border rounded-xl text-white focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 ${
                              getEstadoSemaforo().color === '🔴' ? 'border-red-500/60' : 
                              getEstadoSemaforo().color === '🟡' ? 'border-yellow-500/60' : 'border-emerald-500/40'
                            }`}
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
                            <span className="text-sm">{getEstadoSemaforo().color}</span>
                          </label>
                          <input 
                            className={`w-full p-4 bg-slate-900/60 border rounded-xl text-white focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 ${
                              getEstadoSemaforo().color === '🔴' ? 'border-red-500/60' : 
                              getEstadoSemaforo().color === '🟡' ? 'border-yellow-500/60' : 'border-emerald-500/40'
                            }`}
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
                            <span className="text-sm">{getEstadoSemaforo().color}</span>
                          </label>
                          <input 
                            className={`w-full p-4 bg-slate-900/60 border rounded-xl text-white focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 ${
                              getEstadoSemaforo().color === '🔴' ? 'border-red-500/60' : 
                              getEstadoSemaforo().color === '🟡' ? 'border-yellow-500/60' : 'border-emerald-500/40'
                            }`}
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
                            <span className="text-sm">{getEstadoSemaforo().color}</span>
                          </label>
                          <input 
                            className={`w-full p-4 bg-slate-900/60 border rounded-xl text-white focus:ring-2 focus:ring-teal-400/20 transition-all duration-200 ${
                              getEstadoSemaforo().color === '🔴' ? 'border-red-500/60' : 
                              getEstadoSemaforo().color === '🟡' ? 'border-yellow-500/60' : 'border-emerald-500/40'
                            }`}
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
                        <div className="p-6 bg-gradient-to-r from-teal-600/15 to-emerald-600/15 border border-teal-400/25 rounded-xl text-center">
                          <span className="text-3xl font-bold text-teal-300">{formData.duracionCalculada}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Estado:</label>
                    <input 
                      className="w-full p-4 bg-slate-900/30 border border-emerald-500/30 rounded-xl text-gray-300 cursor-not-allowed"
                      type="text" 
                      value={formData.estadoFin}
                      readOnly
                    />
                  </div>
                  
                  {(tipo === 'evento-fin' || tipo === 'incidente-fin') && (
                    <div>
                      <label className="block mb-2 font-semibold text-gray-300">Acciones ejecutadas:</label>
                      <textarea 
                        className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-40 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
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
                  className="w-full p-4 bg-slate-900/60 border border-emerald-500/40 rounded-xl text-white placeholder-gray-400 h-32 resize-y focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 transition-all duration-200"
                  placeholder="Observaciones con detalle que permitan brindar más información en el caso que amerite"
                  name="nota"
                  value={formData.nota}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button 
                  className={`flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                    getEstadoSemaforo().color === '🔴' ? 'ring-2 ring-red-500/50' : 
                    getEstadoSemaforo().color === '🟡' ? 'ring-1 ring-yellow-500/30' : ''
                  }`}
                  onClick={generarMensaje}
                >
                  <Zap className="w-5 h-5" />
                  Generar Comunicado
                  <span className="ml-2">{getEstadoSemaforo().color}</span>
                </button>
              </div>
            </div>
            
            {/* Resultado */}
            <div className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-emerald-400/40">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-2 mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                Comunicado Generado
              </h2>
              <div className="bg-slate-900/90 p-6 rounded-xl font-mono border-l-4 border-teal-500 mt-4 min-h-[200px] overflow-x-auto leading-relaxed">
                <pre className="whitespace-pre-wrap text-gray-100">{resultado || 'El comunicado generado aparecerá aquí...'}</pre>
              </div>
              
              {mostrarAlerta && (
                <div className="my-6 p-4 rounded-xl bg-teal-500/20 border-l-4 border-teal-500 backdrop-blur-sm">
                  <p className="text-teal-300 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {alertaMensaje}
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 mt-8">
                <button 
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold uppercase transition-all duration-300 shadow-lg hover:shadow-teal-500/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
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
        
        {/* Modal de actualización automática */}
        {mostrarActualizacion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 border border-emerald-400/40 max-w-md mx-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">⏰</div>
                <h3 className="text-xl font-bold text-emerald-300 mb-2">Actualización de Fechas</h3>
                <p className="text-gray-300 text-sm">
                  La página lleva abierta {calcularTiempoAbierto().horas}h {calcularTiempoAbierto().minutos}m
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  ¿Deseas actualizar las fechas a la hora actual?
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={actualizarFechasAhora}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  ✅ Sí, actualizar
                </button>
                <button
                  onClick={() => setMostrarActualizacion(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  ⏰ Después
                </button>
              </div>
              
              <button
                onClick={() => {
                  setNoPreguntar(true);
                  setMostrarActualizacion(false);
                }}
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-300 py-1"
              >
                ❌ No preguntar más (esta sesión)
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmación de duración */}
        {mostrarConfirmacionDuracion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 border border-yellow-400/40 max-w-md mx-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🤔</div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2">Confirmación de Duración</h3>
                <p className="text-gray-300 text-sm mb-2">
                  Duración calculada: <span className="font-bold text-yellow-300">{formData.duracionCalculada}</span>
                </p>
                <p className="text-gray-400 text-xs">
                  ¿El incidente realmente duró tanto tiempo?
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarConfirmacionDuracion(false);
                    generarMensajeInterno();
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  ✅ Sí, correcto
                </button>
                <button
                  onClick={() => setMostrarConfirmacionDuracion(false)}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200"
                >
                  🔄 Revisar fechas
                </button>
              </div>
            </div>
          </div>
        )}
        
        <footer className="text-center py-8 mt-12 text-gray-300 text-sm border-t border-emerald-400/30">
          <p className="mb-2">Desarrollado por Luis Alberto Herrera Lara</p>
          <p className="text-emerald-200">Generador de Comunicados Pro - Versión 5.0</p>
          <p className="text-xs mt-1">Sistema Avanzado de Comunicaciones</p>
          <p className="text-xs text-emerald-300/70 mt-2">Actualizado el 13 de junio de 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
