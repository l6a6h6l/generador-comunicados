import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, RefreshCw, Copy, Trash2, Wrench, ChevronRight, Zap, MessageSquare, AlertTriangle, Bell, Settings, Plus, Minus, User, Lock, Eye, EyeOff, CreditCard, FileText, AlertOctagon } from 'lucide-react';

// Constantes
const USUARIOS_VALIDOS = [
  { usuario: 'fractalia', password: 'fractalia4ever' },
  { usuario: 'gabriela', password: 'gabyRocks2025' },
  { usuario: 'gestores', password: 'todosLosSapitos' },
  { usuario: 'dorian', password: 'dorianGrayIncidentes' }
];

const SERVICIOS_TRANSACCIONALES = [
  { id: 'datafast-visa-mc', nombre: 'DATAFAST VISA-MC', descripcion: 'Transacciones locales Visa (débito/crédito) y MasterCard (crédito) en red propia', categoria: 'datafast' },
  { id: 'datafast-diners-dc', nombre: 'DATAFAST DINERS-DC', descripcion: 'Transacciones locales Diners (débito/crédito) y Discover (crédito) en red propia', categoria: 'datafast' },
  { id: 'banred-pago-tc', nombre: 'BANRED (PAGO A TARJETA DE CRÉDITO)', descripcion: 'Transacciones entre bancos asociados BANRED: tarjetas de crédito, cuentas corrientes y ahorro', categoria: 'banred' },
  { id: 'banred-base24', nombre: 'BANRED BASE 24 (DÉBITOS)', descripcion: 'Transacciones tarjetas de débito Banco Pichincha y bancos asociados BANRED', categoria: 'banred' },
  { id: 'banred-base25', nombre: 'BANRED BASE 25 (ATM - TARJETAS DE CRÉDITO)', descripcion: 'Transacciones ATM tarjetas de crédito Banco Pichincha y bancos asociados BANRED', categoria: 'banred' },
  { id: 'usp-atalla', nombre: 'USP ATALLA', descripcion: 'Validación de tarjetas propias de débito y crédito BANCO PICHINCHA', categoria: 'validacion' },
  { id: 'efectivo-express', nombre: 'EFECTIVO EXPRESS', descripcion: 'Avances de efectivo por ventanilla Banco Pichincha', categoria: 'efectivo' },
  { id: 'diners-internacional-1', nombre: 'DINERS CLUB INTERNACIONAL 1', descripcion: 'Transacciones crédito Diners/Discover: tarjetas propias en red ajena y ajenas en red propia', categoria: 'internacional' },
  { id: 'diners-internacional-2', nombre: 'DINERS CLUB INTERNACIONAL 2', descripcion: 'Transacciones crédito Diners/Discover: tarjetas propias en red ajena y ajenas en red propia', categoria: 'internacional' },
  { id: 'pulse-discover', nombre: 'PULSE / DISCOVER FS', descripcion: 'Transacciones tarjetas ajenas Diners y Discover en cajeros autorizados', categoria: 'internacional' },
  { id: 'llaves-dci', nombre: 'LLAVES DCI', descripcion: 'Intercambio de llaves con franquicias DCI/Discover', categoria: 'seguridad' },
  { id: 'visa-int-emision', nombre: 'VISA INTERNACIONAL EMISIÓN', descripcion: 'Transacciones débito/crédito tarjetas propias en red ajena', categoria: 'internacional' },
  { id: 'visa-int-adquirencia', nombre: 'VISA INTERNACIONAL ADQUIRENCIA', descripcion: 'Transacciones crédito tarjetas ajenas en red propia', categoria: 'internacional' },
  { id: 'mastercard-mci', nombre: 'MASTERCARD INTERNACIONAL MCI', descripcion: 'Transacciones crédito tarjetas propias en red ajena', categoria: 'internacional' },
  { id: 'mastercard-mds', nombre: 'MASTERCARD INTERNACIONAL MDS', descripcion: 'Transacciones crédito tarjetas ajenas en red propia', categoria: 'internacional' },
  { id: 'broker', nombre: 'BROKER', descripcion: 'Avances de efectivo en cajeros ATM sin tarjeta de crédito', categoria: 'efectivo' },
  { id: 'jardin-azuayo', nombre: 'JARDÍN AZUAYO', descripcion: 'Transacciones débito Visa de Cooperativa Jardín Azuayo', categoria: 'cooperativas' },
  { id: 'dock', nombre: 'DOCK (EN PROCESO DE IMPLEMENTACIÓN)', descripcion: 'Transacciones débito Banco Diners Club del Ecuador', categoria: 'implementacion' },
  { id: 'bpc-bp', nombre: 'BPC-BP', descripcion: 'Transacciones tarjeta prepago de transporte Banco Pichincha', categoria: 'prepago' }
];

const OPCIONES_ENCOLAMIENTO = [
  'Variable General',
  'OTP General',
  'SMS Masivo',
  'Notificaciones Push',
  'Validaciones KYC'
];

// Funciones utilitarias
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const [year, month, day] = fechaISO.split('-');
  return `${day}/${month}/${year}`;
};

const calcularDuracion = (fechaInicio, horaInicio, fechaFin, horaFin) => {
  try {
    if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) return '00:00:00';
    const inicio = new Date(`${fechaInicio}T${horaInicio}`);
    const fin = new Date(`${fechaFin}T${horaFin}`);
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return '00:00:00';
    const diferencia = fin.getTime() - inicio.getTime();
    if (diferencia < 0) return 'Error';
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  } catch (error) {
    return '00:00:00';
  }
};

export default function GeneradorComunicados() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ usuario: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados principales
  const [tipo, setTipo] = useState('evento-inicio');
  const [modoBLU, setModoBLU] = useState(false);
  const [tipoBLU, setTipoBLU] = useState('aplicacion');
  const [alertaCompleta, setAlertaCompleta] = useState('');
  const [mostrarPegarAlerta, setMostrarPegarAlerta] = useState(false);
  const [multiplesAlertamientos, setMultiplesAlertamientos] = useState(false);
  const [periodosAlertamiento, setPeriodosAlertamiento] = useState([
    { fechaInicio: '', horaInicio: '', fechaFin: '', horaFin: '', duracion: '00:00:00' }
  ]);
  const [multiplesEncolamientos, setMultiplesEncolamientos] = useState(false);
  const [serviciosEncolamiento, setServiciosEncolamiento] = useState([
    { tipo: 'Variable General', tipoCustom: '', fechaInicio: '', horaInicio: '', fechaFin: '', horaFin: '', duracion: '00:00:00', encolados: '' }
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
  const [alertaMensaje, setAlertaMensaje] = useState('');
  const [mostrarServicios, setMostrarServicios] = useState(false);
  const [tiempoAbierto, setTiempoAbierto] = useState(Date.now());
  const [mostrarActualizacion, setMostrarActualizacion] = useState(false);
  const [mostrarConfirmacionDuracion, setMostrarConfirmacionDuracion] = useState(false);
  const [noPreguntar, setNoPreguntar] = useState(false);
  const [errorFechaFin, setErrorFechaFin] = useState('');
  const [mostrarErrorFecha, setMostrarErrorFecha] = useState(false);
  const [sugerenciasFecha, setSugerenciasFecha] = useState([]);
  const [escalamientoBLU, setEscalamientoBLU] = useState('');

  // Establecer fechas al cargar
  useEffect(() => {
    establecerFechaHoraActual();
  }, []);

  // Timer del semáforo
  useEffect(() => {
    const interval = setInterval(() => {
      const horasAbierto = (Date.now() - tiempoAbierto) / (1000 * 60 * 60);
      if (!noPreguntar && horasAbierto >= 1 && horasAbierto % 1 < 0.017) {
        setMostrarActualizacion(true);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [tiempoAbierto, noPreguntar]);

  // Calcular duración
  useEffect(() => {
    if (!formData.fechaInicioFin || !formData.horaInicioFin || !formData.fechaFin || !formData.horaFin) return;
    const duracion = calcularDuracion(formData.fechaInicioFin, formData.horaInicioFin, formData.fechaFin, formData.horaFin);
    setFormData(prev => ({ ...prev, duracionCalculada: duracion }));
  }, [formData.fechaInicioFin, formData.horaInicioFin, formData.fechaFin, formData.horaFin]);

  // Actualizar estados por defecto
  useEffect(() => {
    setFormData(prev => {
      let estadoInicio = prev.estadoInicio;
      let estadoFin = prev.estadoFin;
      if (tipo === 'evento-inicio' || tipo === 'incidente-inicio') estadoInicio = 'En revisión';
      else if (tipo === 'evento-fin' || tipo === 'incidente-fin') estadoFin = 'Recuperado';
      else if (tipo === 'mantenimiento-inicio') estadoInicio = 'En curso';
      else if (tipo === 'mantenimiento-fin') estadoFin = 'Finalizado';
      return { ...prev, estadoInicio, estadoFin };
    });
  }, [tipo]);

  // Funciones de autenticación
  const handleLogin = () => {
    const usuarioValido = USUARIOS_VALIDOS.find(
      user => user.usuario === loginForm.usuario && user.password === loginForm.password
    );
    if (usuarioValido) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas');
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

  // Función para procesar alerta completa BLU 2.0
  const procesarAlertaBLU = () => {
    if (!alertaCompleta) {
      setAlertaMensaje('Por favor, pega el contenido de la alerta');
      setMostrarAlerta(true);
      setTimeout(() => setMostrarAlerta(false), 3000);
      return;
    }

    const texto = alertaCompleta.toLowerCase();
    let descripcionExtraida = '';
    let tipoDetectado = 'aplicacion';
    let fechaExtraida = '';
    let horaExtraida = '';

    // Detectar si es BIAN
    if (texto.includes('namespace.name:') && texto.includes('bian')) {
      const regexNamespace = /namespace\.name:\s*([^\s\n]+)/i;
      const matchNamespace = alertaCompleta.match(regexNamespace);
      if (matchNamespace) {
        descripcionExtraida = `Alertamiento ${matchNamespace[1]}`;
        tipoDetectado = 'bian';
      }
    } else {
      const regexCluster = /cluster\.name:\s*([^\s\n]+)/i;
      const matchCluster = alertaCompleta.match(regexCluster);
      if (matchCluster) {
        descripcionExtraida = `Alertamiento ${matchCluster[1]}`;
      }

      if (texto.includes('application')) {
        tipoDetectado = 'aplicacion';
      } else if (texto.includes('performance') || texto.includes('hardware')) {
        tipoDetectado = 'infraestructura';
      }
    }

    // Extraer fecha y hora
    const regexFecha = /(\d{1,2})\.(\d{2})\.(\d{4})/;
    const matchFecha = alertaCompleta.match(regexFecha);
    if (matchFecha) {
      fechaExtraida = `${matchFecha[3]}-${matchFecha[2]}-${matchFecha[1].padStart(2, '0')}`;
    }

    const regexHora = /(\d{2}):(\d{2})\s*\(UTC\)/;
    const matchHora = alertaCompleta.match(regexHora);
    if (matchHora) {
      horaExtraida = `${matchHora[1]}:${matchHora[2]}:00`;
    }

    if (descripcionExtraida) {
      setFormData(prev => ({
        ...prev,
        descripcion: descripcionExtraida,
        fechaInicio: fechaExtraida || prev.fechaInicio,
        horaInicio: horaExtraida || prev.horaInicio
      }));
    }

    setTipoBLU(tipoDetectado);
    
    if (tipoDetectado === 'bian') {
      setEscalamientoBLU('Miguel Angel López Garavito');
    } else if (tipoDetectado === 'infraestructura') {
      setEscalamientoBLU('Infraestructura Cloud');
    } else {
      setEscalamientoBLU('Paul Chamorro / David Albuja');
    }

    setMostrarPegarAlerta(false);
    setAlertaCompleta('');
    setAlertaMensaje('✅ Alerta procesada correctamente');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  // Funciones de servicios
  const seleccionarServicio = (servicio) => {
    const campoImpacto = tipo.startsWith('mantenimiento-') ? 'impactoMant' : 'impacto';
    const impactoActual = formData[campoImpacto];
    const nuevoImpacto = !impactoActual ? servicio.descripcion : impactoActual + '\n' + servicio.descripcion;
    setFormData(prev => ({ ...prev, [campoImpacto]: nuevoImpacto }));
    setAlertaMensaje(`Servicio agregado: ${servicio.nombre}`);
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 2000);
  };

  const limpiarImpactos = () => {
    const campoImpacto = tipo.startsWith('mantenimiento-') ? 'impactoMant' : 'impacto';
    setFormData(prev => ({ ...prev, [campoImpacto]: '' }));
    setAlertaMensaje('Impactos limpiados');
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
    if (total < 1) return { color: '🟢', estado: 'Actualizado', clase: 'text-green-500' };
    if (total < 4) return { color: '🟡', estado: 'Revisar', clase: 'text-yellow-500' };
    return { color: '🔴', estado: 'Desactualizado', clase: 'text-red-500' };
  };

  const actualizarFechasAhora = () => {
    establecerFechaHoraActual();
    setTiempoAbierto(Date.now());
    setMostrarActualizacion(false);
    setAlertaMensaje('Fechas actualizadas');
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
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
    
    setPeriodosAlertamiento([{
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual,
      duracion: '00:00:00'
    }]);
    
    setServiciosEncolamiento([{
      tipo: 'Variable General',
      tipoCustom: '',
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual,
      duracion: '00:00:00',
      encolados: ''
    }]);
  };

  const limpiarCampos = () => {
    establecerFechaHoraActual();
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
      nota: ''
    }));
    setMultiplesAlertamientos(false);
    setMultiplesEncolamientos(false);
    setMostrarConfirmacionDuracion(false);
    setErrorFechaFin('');
    setMostrarErrorFecha(false);
    setSugerenciasFecha([]);
    setAlertaCompleta('');
    setEscalamientoBLU('');
    setAlertaMensaje('Campos limpiados');
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

  const agregarServicioEncolamiento = () => {
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    const horaActual = hoy.toTimeString().split(' ')[0];
    setServiciosEncolamiento(prev => [...prev, {
      tipo: 'Variable General',
      tipoCustom: '',
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual,
      duracion: '00:00:00',
      encolados: ''
    }]);
  };

  const eliminarServicioEncolamiento = (index) => {
    if (serviciosEncolamiento.length > 1) {
      setServiciosEncolamiento(prev => prev.filter((_, i) => i !== index));
    }
  };

  const actualizarServicioEncolamiento = (index, campo, valor) => {
    setServiciosEncolamiento(prev => 
      prev.map((servicio, i) => {
        if (i === index) {
          const nuevoServicio = { ...servicio, [campo]: valor };
          if (nuevoServicio.fechaInicio && nuevoServicio.horaInicio && nuevoServicio.fechaFin && nuevoServicio.horaFin) {
            nuevoServicio.duracion = calcularDuracion(nuevoServicio.fechaInicio, nuevoServicio.horaInicio, nuevoServicio.fechaFin, nuevoServicio.horaFin);
          }
          return nuevoServicio;
        }
        return servicio;
      })
    );
  };

  const actualizarPeriodo = (index, campo, valor) => {
    setPeriodosAlertamiento(prev => 
      prev.map((periodo, i) => {
        if (i === index) {
          const nuevoPeriodo = { ...periodo, [campo]: valor };
          if (nuevoPeriodo.fechaInicio && nuevoPeriodo.horaInicio && nuevoPeriodo.fechaFin && nuevoPeriodo.horaFin) {
            nuevoPeriodo.duracion = calcularDuracion(nuevoPeriodo.fechaInicio, nuevoPeriodo.horaInicio, nuevoPeriodo.fechaFin, nuevoPeriodo.horaFin);
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
    
    if ((tipoAnterior.endsWith('-inicio') || tipoAnterior.endsWith('-avance') || tipoAnterior.endsWith('-seguimiento')) && nuevoTipo.endsWith('-fin')) {
      const hoy = new Date();
      const fechaActual = hoy.toISOString().split('T')[0];
      const horaActual = hoy.toTimeString().split(' ')[0];
      
      setFormData(prev => ({
        ...prev,
        fechaInicioFin: prev.fechaInicio,
        horaInicioFin: prev.horaInicio,
        fechaFin: fechaActual,
        horaFin: horaActual
      }));
      
      setAlertaMensaje('Fechas auto-completadas');
      setMostrarAlerta(true);
      setTimeout(() => setMostrarAlerta(false), 4000);
    }
  };

  const validarFechasFin = () => {
    const { fechaInicioFin, horaInicioFin, fechaFin, horaFin } = formData;
    
    if (!fechaInicioFin || !horaInicioFin || !fechaFin || !horaFin) {
      setErrorFechaFin('');
      return true;
    }

    try {
      const inicio = new Date(`${fechaInicioFin}T${horaInicioFin}`);
      const fin = new Date(`${fechaFin}T${horaFin}`);
      
      if (fin < inicio) {
        setErrorFechaFin(`La fecha/hora de fin no puede ser anterior al inicio`);
        const hoy = new Date();
        const fechaActual = hoy.toISOString().split('T')[0];
        const horaActual = hoy.toTimeString().split(' ')[0];
        
        setSugerenciasFecha([
          { texto: `Usar fecha y hora actual: ${formatearFecha(fechaActual)} ${horaActual}`, fecha: fechaActual, hora: horaActual }
        ]);
        setMostrarErrorFecha(true);
        return false;
      }
      
      setErrorFechaFin('');
      setSugerenciasFecha([]);
      setMostrarErrorFecha(false);
      return true;
    } catch (error) {
      setErrorFechaFin('Error al procesar las fechas');
      return false;
    }
  };

  const aplicarSugerenciaFecha = (fecha, hora) => {
    setFormData(prev => ({ ...prev, fechaFin: fecha, horaFin: hora }));
    setErrorFechaFin('');
    setSugerenciasFecha([]);
    setMostrarErrorFecha(false);
    setAlertaMensaje(`Fecha corregida`);
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const calcularDuracionTotal = () => {
    if (!multiplesAlertamientos || periodosAlertamiento.length === 0) return formData.duracionCalculada;
    let totalSegundos = 0;
    periodosAlertamiento.forEach(periodo => {
      if (periodo.duracion !== '00:00:00' && periodo.duracion !== 'Error') {
        const [horas, minutos, segundos] = periodo.duracion.split(':').map(Number);
        totalSegundos += (horas * 3600) + (minutos * 60) + segundos;
      }
    });
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
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
      if (index < periodosAlertamiento.length - 1) resultado += `\n`;
    });
    return resultado;
  };

  const formatearImpacto = (impacto, valorPorDefecto) => {
    const impactoVal = impacto || valorPorDefecto;
    const lineas = impactoVal.split('\n').filter(linea => linea.trim() !== '');
    if (lineas.length <= 1) return `Impacto: ${impactoVal}`;
    let resultado = "Impacto:";
    lineas.forEach(linea => {
      const lineaLimpia = linea.trim();
      if (lineaLimpia) {
        resultado += `\n        • ${lineaLimpia}`;
      }
    });
    return resultado;
  };

  const formatearNotaEncolamientos = () => {
    if (!multiplesEncolamientos || serviciosEncolamiento.length === 0) return '';
    let resultado = 'Encolamientos por servicio:';
    serviciosEncolamiento.forEach(servicio => {
      if (servicio.encolados && servicio.encolados.trim() !== '') {
        const tipoServicio = servicio.tipo === 'Otro' ? servicio.tipoCustom : servicio.tipo;
        resultado += `\n        • ${tipoServicio}: ${servicio.encolados}`;
      }
    });
    return resultado;
  };

  const generarMensaje = () => {
    if (tipo.endsWith('-fin') && !validarFechasFin()) {
      return;
    }
    
    // Validar duración mayor a 4 horas
    if (tipo.endsWith('-fin')) {
      let duracionAValidar = '';
      
      if (multiplesAlertamientos && periodosAlertamiento.length > 0) {
        duracionAValidar = calcularDuracionTotal();
      } else {
        duracionAValidar = formData.duracionCalculada;
      }
      
      // Convertir duración a horas
      const [horas, minutos, segundos] = duracionAValidar.split(':').map(Number);
      const duracionEnHoras = horas + (minutos / 60) + (segundos / 3600);
      
      if (duracionEnHoras > 4) {
        setMostrarConfirmacionDuracion(true);
        return;
      }
    }
    
    generarMensajeInterno();
  };

  const generarMensajeInterno = () => {
    let mensaje = "";
    
    const getTitulo = () => {
      if (!modoBLU) {
        if (tipo.startsWith('evento-')) return 'GESTIÓN EVENTO';
        if (tipo.startsWith('incidente-')) return 'GESTIÓN INCIDENTE';
        if (tipo.startsWith('mantenimiento-')) return tipo.includes('inicio') ? '⚠️ MANTENIMIENTO' : '✅ MANTENIMIENTO';
      }
      if (tipo.startsWith('evento-')) {
        if (tipoBLU === 'bian') return 'GESTIÓN EVENTO BIAN';
        return 'GESTIÓN EVENTO BLU 2.0';
      }
      if (tipo.startsWith('incidente-')) return 'GESTIÓN INCIDENTE';
      if (tipo.startsWith('mantenimiento-')) return tipo.includes('inicio') ? '⚠️ MANTENIMIENTO' : '✅ MANTENIMIENTO';
    };
    
    if (tipo === 'evento-inicio') {
      const descripcionVal = formData.descripcion || (modoBLU ? "Alertamiento [cluster/namespace]" : "DESCRIPCION DEL INCIDENTE");
      const estadoVal = formData.estadoInicio || "En revisión";
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      
      mensaje = `${getTitulo()}\n🟡 ${estadoVal}\n\nDescripción: ${descripcionVal}`;
      
      if (!modoBLU) {
        const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
        mensaje = `${getTitulo()}\n🟡 ${estadoVal}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}`;
      }
      
      mensaje += `\nInicio: ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'evento-seguimiento') {
      const descripcionVal = formData.descripcion || (modoBLU ? "Alertamiento [cluster/namespace]" : "DESCRIPCION DEL INCIDENTE");
      
      mensaje = `${getTitulo()}\n🔁 Seguimiento\n\nDescripción: ${descripcionVal}`;
      
      if (!modoBLU) {
        const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
        mensaje += `\n${impactoFormateado}`;
      }
      
      if (formData.acciones && formData.acciones.trim()) {
        mensaje += "\nAcciones:";
        formData.acciones.split('\n').forEach(linea => {
          const lineaLimpia = linea.trim();
          if (lineaLimpia) {
            if (lineaLimpia.includes('%%')) {
              const [accion, responsable] = lineaLimpia.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) mensaje += `\n          Responsable: ${responsable}`;
            } else {
              mensaje += `\n        • ${lineaLimpia}`;
            }
          }
        });
      }
    }
    else if (tipo === 'evento-fin') {
      const descripcionVal = formData.descripcion || (modoBLU ? "Alertamiento [cluster/namespace]" : "DESCRIPCION DEL INCIDENTE");
      const estadoVal = formData.estadoFin || "Recuperado";
      
      mensaje = `${getTitulo()}\n🟢 ${estadoVal}\n\nDescripción: ${descripcionVal}`;
      
      if (!modoBLU) {
        const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
        mensaje = `${getTitulo()}\n🟢 ${estadoVal}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}`;
      }
      
      mensaje += `\n${formatearPeriodosMultiples()}`;
      
      if (formData.acciones && formData.acciones.trim()) {
        mensaje += "\nAcciones:";
        formData.acciones.split('\n').forEach(linea => {
          const lineaLimpia = linea.trim();
          if (lineaLimpia) {
            if (lineaLimpia.includes('%%')) {
              const [accion, responsable] = lineaLimpia.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) mensaje += `\n          Responsable: ${responsable}`;
            } else {
              mensaje += `\n        • ${lineaLimpia}`;
            }
          }
        });
      }
    }
    else if (tipo === 'mantenimiento-inicio') {
      const motivoVal = formData.motivo || "Descripción del Mantenimiento";
      const ejecutorVal = formData.ejecutor || "Proveedor o área interna";
      const estadoVal = formData.estadoInicio || "En curso";
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      const impactoFormateado = formatearImpacto(formData.impactoMant, "Impacto servicio / usuarios / clientes");
      
      mensaje = `${getTitulo()}\n\nEstado: ${estadoVal}\nMotivo: ${motivoVal}\n${impactoFormateado}\nEjecutor: ${ejecutorVal}\nInicio: ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'mantenimiento-fin') {
      const motivoVal = formData.motivo || "Descripción del Mantenimiento";
      const ejecutorVal = formData.ejecutor || "Proveedor o área interna";
      const estadoVal = formData.estadoFin || "Finalizado";
      const impactoFormateado = formatearImpacto(formData.impactoMant, "Impacto servicio / usuarios / clientes");
      
      mensaje = `${getTitulo()}\n\nEstado: ${estadoVal}\nMotivo: ${motivoVal}\n${impactoFormateado}\nEjecutor: ${ejecutorVal}\n${formatearPeriodosMultiples()}`;
    }
    else if (tipo === 'incidente-inicio') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const estadoVal = formData.estadoInicio || "En revisión";
      const fechaFormateada = formatearFecha(formData.fechaInicio);
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `${getTitulo()}\n🟡 ${estadoVal}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}\nInicio: ${fechaFormateada} - ${formData.horaInicio}`;
    }
    else if (tipo === 'incidente-avance') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `${getTitulo()}\n🔁 Avance\n\nDescripción: ${descripcionVal}\n${impactoFormateado}`;
      
      if (formData.accionesEnCurso && formData.accionesEnCurso.trim()) {
        mensaje += "\nAcciones en curso:";
        formData.accionesEnCurso.split('\n').forEach(linea => {
          const lineaLimpia = linea.trim();
          if (lineaLimpia) {
            if (lineaLimpia.includes('%%')) {
              const [accion, responsable] = lineaLimpia.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) mensaje += `\n          Responsable: ${responsable}`;
            } else {
              mensaje += `\n        • ${lineaLimpia}`;
            }
          }
        });
      }
      
      if (formData.accionesEjecutadas && formData.accionesEjecutadas.trim()) {
        mensaje += "\nAcciones ejecutadas:";
        formData.accionesEjecutadas.split('\n').forEach(linea => {
          const lineaLimpia = linea.trim();
          if (lineaLimpia) {
            if (lineaLimpia.includes('%%')) {
              const [accion, responsable] = lineaLimpia.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) mensaje += `\n          Responsable: ${responsable}`;
            } else {
              mensaje += `\n        • ${lineaLimpia}`;
            }
          }
        });
      }
    }
    else if (tipo === 'incidente-fin') {
      const descripcionVal = formData.descripcion || "DESCRIPCION DEL INCIDENTE";
      const estadoFin = 'Recuperado';
      const impactoFormateado = formatearImpacto(formData.impacto, "Impacto servicio / usuarios");
      
      mensaje = `${getTitulo()}\n🟢 ${estadoFin}\n\nDescripción: ${descripcionVal}\n${impactoFormateado}\n${formatearPeriodosMultiples()}`;
      
      if (formData.accionesEjecutadas && formData.accionesEjecutadas.trim()) {
        mensaje += "\nAcciones ejecutadas:";
        formData.accionesEjecutadas.split('\n').forEach(linea => {
          const lineaLimpia = linea.trim();
          if (lineaLimpia) {
            if (lineaLimpia.includes('%%')) {
              const [accion, responsable] = lineaLimpia.split('%%').map(s => s.trim());
              mensaje += `\n        • ${accion}`;
              if (responsable) mensaje += `\n          Responsable: ${responsable}`;
            } else {
              mensaje += `\n        • ${lineaLimpia}`;
            }
          }
        });
      }
    }
    
    if (formData.nota || (multiplesEncolamientos && tipo.startsWith('evento-'))) {
      if (tipo.startsWith('mantenimiento-')) {
        mensaje += `\n\n📣 NOTA:\n        ${formData.nota || 'Observaciones adicionales'}`;
      } else {
        mensaje += `\n\n📣 NOTA:`;
        if (formData.nota && formData.nota.trim() !== "") {
          mensaje += `\n        ${formData.nota}`;
        }
        if (multiplesEncolamientos && tipo.startsWith('evento-')) {
          const notaEncolamientos = formatearNotaEncolamientos();
          if (notaEncolamientos) {
            if (formData.nota && formData.nota.trim() !== "") {
              mensaje += `\n        \n        ${notaEncolamientos}`;
            } else {
              mensaje += `\n        ${notaEncolamientos}`;
            }
          }
        }
        if (!formData.nota && !multiplesEncolamientos) {
          mensaje = mensaje.replace('\n\n📣 NOTA:', '');
        }
      }
    }
    
    setResultado(mensaje);
    setMostrarAlerta(false);
  };

  const copiar = () => {
    if (!resultado) {
      alert("No hay comunicado generado");
      return;
    }
    navigator.clipboard.writeText(resultado)
      .then(() => {
        setAlertaMensaje('Comunicado copiado');
        setMostrarAlerta(true);
        setTimeout(() => setMostrarAlerta(false), 3000);
      })
      .catch(() => {
        alert("Error al copiar");
      });
  };

  // Estilos
  const btnPrimary = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors";
  const btnSecondary = "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors";
  const input = "w-full p-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none";
  const label = "block mb-2 text-sm font-medium text-gray-300";
  const card = "bg-gray-800 rounded-lg p-6 border border-gray-700";

  // Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="text-center mb-8">
            <MessageSquare className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Generador de Comunicados</h1>
            <p className="text-gray-500 text-sm">v5.0 - Acceso Restringido</p>
            <p className="text-gray-600 text-xs mt-1">Actualizado: 10/08/2025</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className={label}>Usuario</label>
              <input
                type="text"
                name="usuario"
                value={loginForm.usuario}
                onChange={handleLoginInputChange}
                className={input}
                placeholder="Usuario"
              />
            </div>
            <div>
              <label className={label}>Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange}
                  className={input}
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {loginError && (
              <div className="p-3 rounded bg-red-900/30 border border-red-800">
                <p className="text-red-400 text-sm">{loginError}</p>
              </div>
            )}
            <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium transition-colors">
              Acceder
            </button>
          </div>
        </div>
      </div>
    );
  }

  // App principal - Parte 1: Header y Modal
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-800 relative">
          <div className="absolute top-4 left-4 bg-gray-800 rounded p-2 text-xs">
            <span className={getEstadoSemaforo().clase}>{getEstadoSemaforo().color} {calcularTiempoAbierto().horas}h {calcularTiempoAbierto().minutos}m</span>
            <button onClick={actualizarFechasAhora} className="ml-2 text-blue-400 hover:text-blue-300">
              <RefreshCw className="w-3 h-3 inline" />
            </button>
          </div>
          <button onClick={handleLogout} className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm">
            Salir
          </button>
          <div className="text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-blue-500 mb-3" />
            <h1 className="text-3xl font-bold text-white mb-2">Generador de Comunicados</h1>
            <p className="text-gray-400">Sistema de Comunicaciones - Monitoreo</p>
            <button
              onClick={() => setModoBLU(!modoBLU)}
              className={`mt-3 px-4 py-2 rounded text-sm ${modoBLU ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              {modoBLU ? '🔵 BLU 2.0 Activo' : '⚪ Activar Modo BLU 2.0'}
            </button>
            {modoBLU && (
              <>
                <div className="mt-3 inline-flex gap-2">
                  {['aplicacion', 'infraestructura', 'bian'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTipoBLU(t)}
                      className={`px-3 py-1 rounded text-xs ${tipoBLU === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                      {t === 'aplicacion' ? '📱 App' : t === 'infraestructura' ? '🖥️ Infra' : '⚠️ BIAN'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setMostrarPegarAlerta(!mostrarPegarAlerta)}
                  className="ml-3 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs"
                >
                  <FileText className="w-3 h-3 inline mr-1" />
                  Pegar Alerta
                </button>
              </>
            )}
          </div>
        </header>
        
        {/* Modal para pegar alerta BLU */}
        {mostrarPegarAlerta && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 max-w-3xl mx-4 w-full">
              <h3 className="text-lg font-bold text-white mb-3">Pegar Alerta BLU 2.0</h3>
              <p className="text-sm text-gray-400 mb-3">Pega el contenido completo de la alerta y el sistema detectará automáticamente el tipo y extraerá la información</p>
              <textarea
                value={alertaCompleta}
                onChange={(e) => setAlertaCompleta(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 h-64 font-mono text-xs"
                placeholder="Pega aquí el contenido de la alerta..."
              />
              <div className="flex gap-3 mt-4">
                <button onClick={procesarAlertaBLU} className={btnPrimary + " flex-1"}>
                  <AlertOctagon className="w-4 h-4 inline mr-2" />
                  Procesar Alerta
                </button>
                <button onClick={() => {setMostrarPegarAlerta(false); setAlertaCompleta('');}} className={btnSecondary + " flex-1"}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal - Parte 2 */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Panel lateral izquierdo */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className={card}>
                <h2 className="text-lg font-bold text-white mb-4">Tipo de Comunicado</h2>
                <div className="space-y-3">
                  <div className="border border-gray-700 rounded p-3">
                    <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Eventos</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['evento-inicio', 'evento-seguimiento', 'evento-fin'].map((t, i) => (
                        <button
                          key={t}
                          className={`p-2 rounded text-xs ${tipo === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => seleccionarTipo(t)}
                        >
                          {i === 0 ? '🟡' : i === 1 ? '🔁' : '🟢'}<br/>{i === 0 ? 'Inicio' : i === 1 ? 'Seg.' : 'Fin'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-700 rounded p-3">
                    <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Mantenimientos</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['mantenimiento-inicio', 'mantenimiento-fin'].map((t, i) => (
                        <button
                          key={t}
                          className={`p-2 rounded text-xs ${tipo === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => seleccionarTipo(t)}
                        >
                          {i === 0 ? '⚠️' : '✅'}<br/>{i === 0 ? 'Inicio' : 'Fin'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border border-gray-700 rounded p-3">
                    <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Incidentes</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['incidente-inicio', 'incidente-avance', 'incidente-fin'].map((t, i) => (
                        <button
                          key={t}
                          className={`p-2 rounded text-xs ${tipo === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                          onClick={() => seleccionarTipo(t)}
                        >
                          {i === 0 ? '🟡' : i === 1 ? '🔁' : '🟢'}<br/>{i === 0 ? 'Inicio' : i === 1 ? 'Avance' : 'Fin'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={card}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-white">Servicios Transaccionales</h2>
                  <button onClick={() => setMostrarServicios(!mostrarServicios)} className="text-gray-400 hover:text-white">
                    {mostrarServicios ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
                {mostrarServicios && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <button onClick={limpiarImpactos} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded">
                      <Trash2 className="w-3 h-3 inline mr-1" />Limpiar
                    </button>
                    
                    {['datafast', 'banred', 'internacional'].map(categoria => (
                      <div key={categoria} className="border border-gray-700 rounded p-2">
                        <h4 className="text-xs font-semibold text-gray-400 mb-1 uppercase">{categoria}</h4>
                        <div className="space-y-1">
                          {SERVICIOS_TRANSACCIONALES.filter(s => s.categoria === categoria).map(servicio => (
                            <button
                              key={servicio.id}
                              onClick={() => seleccionarServicio(servicio)}
                              className="text-left w-full text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded truncate"
                              title={servicio.descripcion}
                            >
                              {servicio.nombre}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="border border-gray-700 rounded p-2">
                      <h4 className="text-xs font-semibold text-gray-400 mb-1 uppercase">OTROS SERVICIOS</h4>
                      <div className="space-y-1">
                        {SERVICIOS_TRANSACCIONALES.filter(s => !['datafast', 'banred', 'internacional'].includes(s.categoria)).map(servicio => (
                          <button
                            key={servicio.id}
                            onClick={() => seleccionarServicio(servicio)}
                            className="text-left w-full text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded truncate"
                            title={servicio.descripcion}
                          >
                            {servicio.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Panel principal derecho - Parte 3 */}
          <div className="lg:col-span-3 space-y-6">
            <div className={card}>
              <h2 className="text-xl font-bold text-white mb-4">Detalles del Comunicado</h2>

              {/* Panel de escalamiento BLU */}
              {modoBLU && tipo.startsWith('evento-') && (
                <div className={`p-3 rounded mb-4 border ${
                  tipoBLU === 'bian' ? 'bg-orange-900/20 border-orange-800' :
                  tipoBLU === 'infraestructura' ? 'bg-purple-900/20 border-purple-800' :
                  'bg-blue-900/20 border-blue-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Escalamiento BLU 2.0:</p>
                      <p className="text-sm font-medium text-white">
                        {tipoBLU === 'bian' 
                          ? 'Miguel Angel López Garavito'
                          : tipoBLU === 'infraestructura'
                          ? 'Infraestructura Cloud'
                          : 'Paul Chamorro / David Albuja'}
                      </p>
                      {tipoBLU === 'bian' && (
                        <p className="text-xs text-gray-500 mt-1">📧 malopez@dinersclub.com.ec</p>
                      )}
                    </div>
                    <div className={`text-2xl ${
                      tipoBLU === 'bian' ? 'text-orange-400' :
                      tipoBLU === 'infraestructura' ? 'text-purple-400' :
                      'text-blue-400'
                    }`}>
                      {tipoBLU === 'bian' ? '⚠️' : tipoBLU === 'infraestructura' ? '🖥️' : '📱'}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">💡 Recordatorio de escalamiento:</p>
                    <p className="text-xs text-gray-300">
                      {tipoBLU === 'bian' 
                        ? 'Escalar a Miguel Angel López Garavito por Teams o correo'
                        : tipoBLU === 'infraestructura'
                        ? 'Escalar al equipo de Infraestructura Cloud por Teams'
                        : 'Escalar a Paul Chamorro o David Albuja por Teams'}
                    </p>
                  </div>
                </div>
              )}

              {/* Campos para eventos e incidentes */}
              {(tipo.startsWith('evento-') || tipo.startsWith('incidente-')) && (
                <div className="space-y-4">
                  <div>
                    <label className={label}>
                      Descripción:
                      {modoBLU && (
                        <span className="text-xs ml-2 text-blue-400">
                          (Formato: Alertamiento [namespace/cluster])
                        </span>
                      )}
                    </label>
                    <input 
                      className={input}
                      type="text" 
                      name="descripcion"
                      placeholder={modoBLU ? "Alertamiento CLUSTER_EKS_KB" : "Descripción del incidente"}
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  {!modoBLU && (
                    <div>
                      <label className={label}>Impacto:</label>
                      <textarea 
                        className={input + " h-24 resize-y"}
                        name="impacto"
                        placeholder="Impacto servicio / usuarios"
                        value={formData.impacto}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Campos para mantenimientos */}
              {tipo.startsWith('mantenimiento-') && (
                <div className="space-y-4">
                  <div>
                    <label className={label}>Motivo:</label>
                    <input 
                      className={input}
                      type="text" 
                      name="motivo"
                      placeholder="Descripción del Mantenimiento"
                      value={formData.motivo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className={label}>Impacto:</label>
                    <textarea 
                      className={input + " h-24 resize-y"}
                      name="impactoMant"
                      placeholder="Impacto servicio / usuarios / clientes"
                      value={formData.impactoMant}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className={label}>Ejecutor:</label>
                    <input 
                      className={input}
                      type="text" 
                      name="ejecutor"
                      placeholder="Proveedor o área interna"
                      value={formData.ejecutor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              
              {/* Múltiples encolamientos para eventos */}
              {(tipo === 'evento-inicio' || tipo === 'evento-seguimiento') && (
                <div className="mt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={multiplesEncolamientos}
                      onChange={(e) => setMultiplesEncolamientos(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Múltiples encolamientos</span>
                  </label>
                  
                  {multiplesEncolamientos && (
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-semibold text-gray-300">Servicios con Encolamiento</h3>
                        <button onClick={agregarServicioEncolamiento} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                          Agregar
                        </button>
                      </div>
                      {serviciosEncolamiento.map((servicio, index) => (
                        <div key={index} className="bg-gray-900 rounded p-4 border border-gray-700">
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-gray-300">Servicio {index + 1}</span>
                            {serviciosEncolamiento.length > 1 && (
                              <button onClick={() => eliminarServicioEncolamiento(index)} className="text-red-400 hover:text-red-300">
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                              <select
                                value={servicio.tipo}
                                onChange={(e) => actualizarServicioEncolamiento(index, 'tipo', e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                              >
                                {OPCIONES_ENCOLAMIENTO.map(opcion => (
                                  <option key={opcion} value={opcion}>{opcion}</option>
                                ))}
                                <option value="Otro">Otro (especificar)</option>
                              </select>
                              {servicio.tipo === 'Otro' && (
                                <input
                                  type="text"
                                  placeholder="Especifica el tipo de servicio"
                                  value={servicio.tipoCustom}
                                  onChange={(e) => actualizarServicioEncolamiento(index, 'tipoCustom', e.target.value)}
                                  className="w-full mt-2 p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                                />
                              )}
                            </div>
                            <input 
                              type="number"
                              placeholder="Cantidad"
                              value={servicio.encolados}
                              onChange={(e) => actualizarServicioEncolamiento(index, 'encolados', e.target.value)}
                              className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm col-span-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Fechas para inicio */}
              {(tipo.endsWith('-inicio')) && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={label}>Fecha:</label>
                      <input 
                        className={input}
                        type="date" 
                        name="fechaInicio"
                        value={formData.fechaInicio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className={label}>Hora:</label>
                      <input 
                        className={input}
                        type="time" 
                        step="1"
                        name="horaInicio"
                        value={formData.horaInicio}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones para seguimiento */}
              {tipo === 'evento-seguimiento' && (
                <div className="mt-4">
                  <label className={label}>Acciones:</label>
                  <textarea 
                    className={input + " h-32 resize-y"}
                    placeholder="Acción %% Responsable (opcional)"
                    name="acciones"
                    value={formData.acciones}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              {/* Acciones para incidente avance */}
              {tipo === 'incidente-avance' && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className={label}>Acciones en curso:</label>
                    <textarea 
                      className={input + " h-24 resize-y"}
                      placeholder="Acción %% Responsable"
                      name="accionesEnCurso"
                      value={formData.accionesEnCurso}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className={label}>Acciones ejecutadas:</label>
                    <textarea 
                      className={input + " h-24 resize-y"}
                      placeholder="Acción %% Responsable"
                      name="accionesEjecutadas"
                      value={formData.accionesEjecutadas}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              
              {/* Campos para fin */}
              {tipo.endsWith('-fin') && (
                <div className="space-y-4 mt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={multiplesAlertamientos}
                      onChange={(e) => setMultiplesAlertamientos(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Múltiples alertamientos temporales</span>
                  </label>

                  {tipo.startsWith('evento-') && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={multiplesEncolamientos}
                        onChange={(e) => setMultiplesEncolamientos(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Múltiples encolamientos</span>
                    </label>
                  )}

                  {multiplesEncolamientos ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-semibold text-gray-300">Servicios con Encolamiento</h3>
                        <button onClick={agregarServicioEncolamiento} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                          Agregar
                        </button>
                      </div>
                      {serviciosEncolamiento.map((servicio, index) => (
                        <div key={index} className="bg-gray-900 rounded p-4 border border-gray-700">
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-gray-300">Servicio {index + 1}</span>
                            {serviciosEncolamiento.length > 1 && (
                              <button onClick={() => eliminarServicioEncolamiento(index)} className="text-red-400 hover:text-red-300">
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={servicio.tipo}
                              onChange={(e) => actualizarServicioEncolamiento(index, 'tipo', e.target.value)}
                              className="col-span-2 p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                            >
                              {OPCIONES_ENCOLAMIENTO.map(opcion => (
                                <option key={opcion} value={opcion}>{opcion}</option>
                              ))}
                              <option value="Otro">Otro (especificar)</option>
                            </select>
                            {servicio.tipo === 'Otro' && (
                              <input
                                type="text"
                                placeholder="Especifica el tipo de servicio"
                                value={servicio.tipoCustom}
                                onChange={(e) => actualizarServicioEncolamiento(index, 'tipoCustom', e.target.value)}
                                className="col-span-2 p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                              />
                            )}
                            <input type="date" value={servicio.fechaInicio} onChange={(e) => actualizarServicioEncolamiento(index, 'fechaInicio', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="time" step="1" value={servicio.horaInicio} onChange={(e) => actualizarServicioEncolamiento(index, 'horaInicio', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="date" value={servicio.fechaFin} onChange={(e) => actualizarServicioEncolamiento(index, 'fechaFin', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="time" step="1" value={servicio.horaFin} onChange={(e) => actualizarServicioEncolamiento(index, 'horaFin', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="number" placeholder="Cantidad" value={servicio.encolados} onChange={(e) => actualizarServicioEncolamiento(index, 'encolados', e.target.value)} className="col-span-2 p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <div className="col-span-2 text-center text-blue-400 text-sm">Duración: {servicio.duracion}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {(multiplesAlertamientos && !multiplesEncolamientos) ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-semibold text-gray-300">Períodos de Alertamiento</h3>
                        <button onClick={agregarPeriodo} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                          Agregar
                        </button>
                      </div>
                      {periodosAlertamiento.map((periodo, index) => (
                        <div key={index} className="bg-gray-900 rounded p-4 border border-gray-700">
                          <div className="flex justify-between mb-3">
                            <span className="text-sm text-gray-300">Período {index + 1}</span>
                            {periodosAlertamiento.length > 1 && (
                              <button onClick={() => eliminarPeriodo(index)} className="text-red-400 hover:text-red-300">
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="date" value={periodo.fechaInicio} onChange={(e) => actualizarPeriodo(index, 'fechaInicio', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="time" step="1" value={periodo.horaInicio} onChange={(e) => actualizarPeriodo(index, 'horaInicio', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="date" value={periodo.fechaFin} onChange={(e) => actualizarPeriodo(index, 'fechaFin', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <input type="time" step="1" value={periodo.horaFin} onChange={(e) => actualizarPeriodo(index, 'horaFin', e.target.value)} className="p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm" />
                            <div className="col-span-2 text-center text-blue-400 text-sm">Duración: {periodo.duracion}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (!multiplesEncolamientos && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={label}>Fecha inicio:</label>
                          <input className={errorFechaFin ? input + " border-red-500" : input} type="date" name="fechaInicioFin" value={formData.fechaInicioFin} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label className={label}>Hora inicio:</label>
                          <input className={errorFechaFin ? input + " border-red-500" : input} type="time" step="1" name="horaInicioFin" value={formData.horaInicioFin} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label className={label}>Fecha fin:</label>
                          <input className={errorFechaFin ? input + " border-red-500" : input} type="date" name="fechaFin" value={formData.fechaFin} onChange={handleInputChange} />
                          {errorFechaFin && (
                            <div className="mt-2 space-y-2">
                              <p className="text-red-400 text-xs">{errorFechaFin}</p>
                              {sugerenciasFecha.map((sug, i) => (
                                <button key={i} onClick={() => aplicarSugerenciaFecha(sug.fecha, sug.hora)} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                                  {sug.texto}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className={label}>Hora fin:</label>
                          <input className={errorFechaFin ? input + " border-red-500" : input} type="time" step="1" name="horaFin" value={formData.horaFin} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="p-4 bg-gray-900 rounded text-center">
                        <span className="text-2xl font-bold text-blue-400">{formData.duracionCalculada}</span>
                      </div>
                    </div>
                  ))}
                  
                  {(tipo === 'evento-fin' || tipo === 'incidente-fin') && (
                    <div>
                      <label className={label}>Acciones ejecutadas:</label>
                      <textarea 
                        className={input + " h-32 resize-y"}
                        placeholder="Acción %% Responsable"
                        name={tipo === 'evento-fin' ? 'acciones' : 'accionesEjecutadas'}
                        value={tipo === 'evento-fin' ? formData.acciones : formData.accionesEjecutadas}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <label className={label}>Nota adicional (opcional):</label>
                <textarea 
                  className={input + " h-20 resize-y"}
                  placeholder="Observaciones adicionales"
                  name="nota"
                  value={formData.nota}
                  onChange={handleInputChange}
                />
              </div>
              
              <button 
                className={`w-full mt-6 ${errorFechaFin ? 'bg-gray-600 cursor-not-allowed' : btnPrimary}`}
                onClick={generarMensaje}
                disabled={errorFechaFin && errorFechaFin.includes('ERROR')}
              >
                <Zap className="w-5 h-5 inline mr-2" />
                Generar Comunicado
              </button>
            </div>
            
            <div className={card}>
              <h2 className="text-xl font-bold text-white mb-4">Comunicado Generado</h2>
              <div className="bg-gray-900 p-4 rounded font-mono text-sm min-h-[150px] border border-gray-700">
                <pre className="whitespace-pre-wrap text-gray-100">{resultado || 'El comunicado aparecerá aquí...'}</pre>
              </div>
              
              {mostrarAlerta && (
                <div className="mt-4 p-3 rounded bg-blue-900/30 border border-blue-800">
                  <p className="text-blue-300 text-sm">{alertaMensaje}</p>
                </div>
              )}
              
              <div className="flex gap-4 mt-4">
                <button className={btnPrimary + " flex-1"} onClick={copiar}>
                  <Copy className="w-4 h-4 inline mr-2" />
                  Copiar
                </button>
                <button className={btnSecondary + " flex-1"} onClick={limpiarCampos}>
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modales */}
        {mostrarActualizacion && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 max-w-md mx-4">
              <h3 className="text-lg font-bold text-white mb-2">Actualizar Fechas</h3>
              <p className="text-gray-400 text-sm mb-4">
                La página lleva abierta {calcularTiempoAbierto().horas}h {calcularTiempoAbierto().minutos}m
              </p>
              <div className="flex gap-3">
                <button onClick={actualizarFechasAhora} className={btnPrimary + " flex-1"}>Actualizar</button>
                <button onClick={() => setMostrarActualizacion(false)} className={btnSecondary + " flex-1"}>Después</button>
              </div>
              <button onClick={() => {setNoPreguntar(true); setMostrarActualizacion(false);}} className="w-full mt-2 text-xs text-gray-500 hover:text-gray-300">
                No preguntar más
              </button>
            </div>
          </div>
        )}

        {mostrarConfirmacionDuracion && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 border border-yellow-700 max-w-md mx-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Confirmación de Duración</h3>
              <div className="bg-yellow-900/20 border border-yellow-800 rounded p-4 mb-4">
                <p className="text-gray-300 mb-2">
                  Duración calculada: <span className="font-bold text-yellow-400 text-xl">
                    {multiplesAlertamientos && periodosAlertamiento.length > 0 ? calcularDuracionTotal() : formData.duracionCalculada}
                  </span>
                </p>
                <p className="text-gray-400 text-sm">
                  ¿El incidente realmente duró tanto tiempo?
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setMostrarConfirmacionDuracion(false);
                    generarMensajeInterno();
                  }} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  ✓ Sí, correcto
                </button>
                <button 
                  onClick={() => setMostrarConfirmacionDuracion(false)} 
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Revisar fechas
                </button>
              </div>
            </div>
          </div>
        )}

        {mostrarErrorFecha && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 border border-red-800 max-w-lg mx-4">
              <h3 className="text-xl font-bold text-red-400 mb-3">Error en Fechas</h3>
              <div className="bg-red-900/30 border border-red-700 rounded p-3 mb-4">
                <p className="text-red-300 text-sm whitespace-pre-line">{errorFechaFin}</p>
              </div>
              {sugerenciasFecha.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400">Sugerencias:</p>
                  {sugerenciasFecha.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => {aplicarSugerenciaFecha(sug.fecha, sug.hora); setMostrarErrorFecha(false);}}
                      className="w-full text-left bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded text-sm"
                    >
                      {sug.texto}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setMostrarErrorFecha(false)} className={btnPrimary + " w-full"}>
                Entendido
              </button>
            </div>
          </div>
        )}
        
        <footer className="text-center py-6 mt-8 text-gray-500 text-xs border-t border-gray-800">
          <p>Desarrollado por Luis Alberto Herrera Lara</p>
          <p>Generador de Comunicados v5.0 - BLU 2.0 Enhanced</p>
        </footer>
      </div>
    </div>
  );
}
