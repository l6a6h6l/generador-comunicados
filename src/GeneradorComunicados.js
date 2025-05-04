import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, Copy, RefreshCw, Calendar, Clock, AlertTriangle, CheckCircle, MessageSquare, Wrench, Settings, Trash2, Activity } from 'lucide-react';

const GeneradorComunicados = () => {
  // Estados consolidados
  const [formData, setFormData] = useState({
    tipo: 'evento-inicio',
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
    estadoFin: 'Recuperado',
    nota: ''
  });

  const [resultado, setResultado] = useState('');
  const [duracionCalculada, setDuracionCalculada] = useState('00:00:00');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Configuración de tipos
  const TIPOS_CONFIG = useMemo(() => ({
    eventos: [
      { id: 'evento-inicio', icon: '🟡', nombre: 'Inicio', estado: 'En revisión' },
      { id: 'evento-seguimiento', icon: '🔁', nombre: 'Seguimiento', estado: null },
      { id: 'evento-fin', icon: '🟢', nombre: 'Fin', estado: 'Recuperado' }
    ],
    mantenimientos: [
      { id: 'mantenimiento-inicio', icon: '⚠️', nombre: 'Inicio', estado: 'En curso' },
      { id: 'mantenimiento-fin', icon: '✅', nombre: 'Fin', estado: 'Finalizado' }
    ],
    incidentes: [
      { id: 'incidente-inicio', icon: '🟡', nombre: 'Inicio', estado: 'En revisión' },
      { id: 'incidente-avance', icon: '🔁', nombre: 'Avance', estado: null },
      { id: 'incidente-fin', icon: '🟢', nombre: 'Fin', estado: 'Recuperado' }
    ]
  }), []);

  // Funciones auxiliares
  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  }, []);

  const formatearFecha = useCallback((fechaISO) => {
    if (!fechaISO) return "";
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
  }, []);

  const establecerFechaHoraActual = useCallback(() => {
    const now = new Date();
    const fechaActual = now.toISOString().split('T')[0];
    const horaActual = now.toTimeString().split(' ')[0];
    
    setFormData(prev => ({
      ...prev,
      fechaInicio: fechaActual,
      horaInicio: horaActual,
      fechaInicioFin: fechaActual,
      horaInicioFin: horaActual,
      fechaFin: fechaActual,
      horaFin: horaActual
    }));
  }, []);

  // Efectos
  useEffect(() => {
    establecerFechaHoraActual();
  }, [establecerFechaHoraActual]);

  useEffect(() => {
    const { fechaInicioFin, horaInicioFin, fechaFin, horaFin } = formData;
    
    if (fechaInicioFin && horaInicioFin && fechaFin && horaFin) {
      try {
        const inicio = new Date(`${fechaInicioFin}T${horaInicioFin}`);
        const fin = new Date(`${fechaFin}T${horaFin}`);
        const diff = fin - inicio;
        
        const horas = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
        const minutos = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const segundos = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
        
        setDuracionCalculada(`${horas}:${minutos}:${segundos}`);
      } catch (error) {
        console.error('Error calculando duración:', error);
      }
    }
  }, [formData.fechaInicioFin, formData.horaInicioFin, formData.fechaFin, formData.horaFin]);

  // Manejadores
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const seleccionarTipo = useCallback((nuevoTipo) => {
    setFormData(prev => {
      const updated = { ...prev, tipo: nuevoTipo };
      
      // Actualizar estados según el tipo
      if (nuevoTipo.endsWith('-inicio')) {
        if (nuevoTipo.startsWith('evento-') || nuevoTipo.startsWith('incidente-')) {
          updated.estadoInicio = 'En revisión';
        } else if (nuevoTipo.startsWith('mantenimiento-')) {
          updated.estadoInicio = 'En curso';
        }
      } else if (nuevoTipo.endsWith('-fin')) {
        if (nuevoTipo.startsWith('evento-') || nuevoTipo.startsWith('incidente-')) {
          updated.estadoFin = 'Recuperado';
        } else if (nuevoTipo.startsWith('mantenimiento-')) {
          updated.estadoFin = 'Finalizado';
        }
      }
      
      return updated;
    });
  }, []);

  const limpiarCampos = useCallback(() => {
    const camposLimpios = {
      descripcion: '',
      impacto: '',
      motivo: '',
      impactoMant: '',
      ejecutor: '',
      acciones: '',
      accionesEjecutadas: '',
      accionesEnCurso: '',
      nota: ''
    };
    
    setFormData(prev => ({ ...prev, ...camposLimpios }));
    establecerFechaHoraActual();
    showAlert('¡Campos limpiados correctamente!');
  }, [establecerFechaHoraActual, showAlert]);

  const formatearAcciones = useCallback((acciones) => {
    if (!acciones) return "\n        • Sin acciones registradas";
    
    return acciones.split('\n')
      .filter(linea => linea.trim())
      .map(linea => {
        if (linea.includes('%%')) {
          const [accion, responsable] = linea.split('%%').map(s => s.trim());
          return `\n        • ${accion}${responsable ? `\n          Responsable: ${responsable}` : ''}`;
        }
        return `\n        • ${linea.trim()}`;
      })
      .join('');
  }, []);

  const generarMensaje = useCallback(() => {
    const { tipo } = formData;
    let mensaje = "";
    
    const templates = {
      'evento-inicio': () => {
        const { descripcion, impacto, estadoInicio, fechaInicio, horaInicio } = formData;
        return `*GESTIÓN EVENTO*\n🟡 *${estadoInicio}*\n\n*Descripción:* ${descripcion || "DESCRIPCION DEL INCIDENTE"}\n*Impacto:* ${impacto || "Impacto servicio / usuarios"}\n*Inicio:* ${formatearFecha(fechaInicio)} - ${horaInicio}`;
      },
      'evento-seguimiento': () => {
        const { descripcion, impacto, acciones } = formData;
        return `*GESTIÓN EVENTO*\n🔁 *Seguimiento*\n\n*Descripción:* ${descripcion || "DESCRIPCION DEL INCIDENTE"}\n*Impacto:* ${impacto || "Impacto servicio / usuarios"}\n*Acciones:*${formatearAcciones(acciones)}`;
      },
      'evento-fin': () => {
        const { descripcion, impacto, estadoFin, fechaInicioFin, horaInicioFin, fechaFin, horaFin, acciones } = formData;
        return `*GESTIÓN EVENTO*\n🟢 *${estadoFin}*\n\n*Descripción:* ${descripcion || "DESCRIPCION DEL INCIDENTE"}\n*Impacto:* ${impacto || "Impacto servicio / usuarios"}\n*Inicio:* ${formatearFecha(fechaInicioFin)} - ${horaInicioFin}\n*Fin:* ${formatearFecha(fechaFin)} - ${horaFin}\n*Duración:* ${duracionCalculada}\n*Acciones:*${formatearAcciones(acciones)}`;
      },
      'mantenimiento-inicio': () => {
        const { motivo, impactoMant, ejecutor, estadoInicio, fechaInicio, horaInicio } = formData;
        return `⚠️ *MANTENIMIENTO*\n\n*Estado:* ${estadoInicio}\n*Motivo:* ${motivo || "Descripción del Mantenimiento"}\n*Impacto:* ${impactoMant || "Impacto servicio / usuarios / clientes"}\n*Ejecutor:* ${ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento"}\n*Inicio:* ${formatearFecha(fechaInicio)} - ${horaInicio}`;
      },
      'mantenimiento-fin': () => {
        const { motivo, impactoMant, ejecutor, estadoFin, fechaInicioFin, horaInicioFin, fechaFin, horaFin } = formData;
        return `✅ *MANTENIMIENTO*\n\n*Estado:* ${estadoFin}\n*Motivo:* ${motivo || "Descripción del Mantenimiento"}\n*Impacto:* ${impactoMant || "Impacto servicio / usuarios / clientes"}\n*Ejecutor:* ${ejecutor || "Nombre del proveedor o área interna que ejecuta el mantenimiento"}\n*Inicio:* ${formatearFecha(fechaInicioFin)} - ${horaInicioFin}\n*Fin:* ${formatearFecha(fechaFin)} - ${horaFin}\n*Duración:* ${duracionCalculada}`;
      },
      'incidente-inicio': () => {
        const { descripcion, impacto, estadoInicio, fechaInicio, horaInicio } = formData;
        return `*GESTIÓN INCIDENTE*\n🟡 *${estadoInicio}*\n\n*Descripción:* ${descripcion || "DESCRIPCION DEL INCIDENTE"}\n*Impacto:* ${impacto || "Impacto servicio / usuarios"}\n*Inicio:* ${formatearFecha(fechaInicio)} - ${horaInicio}`;
      },
      'incidente-avance': () => {
        const { descripcion, impacto, accionesEnCurso, accionesEjecutadas } = formData;
        let msg = `*GESTIÓN INCIDENTE*\n🔁 *Avance*\n\n*Descripción:* ${descripcion || "DESCRIPCION DEL INCIDENTE"}\n*Impacto:* ${impacto || "Impacto servicio / usuarios"}`;
        
        if (accionesEnCurso) {
          msg += `\n*Acciones en curso:*${formatearAcciones(accionesEnCurso)}`;
        }
        if (accionesEjecutadas) {
          msg += `\n*Acciones ejecutadas:*${formatearAcciones(accionesEjecutadas)}`;
        }
        return msg;
      },
      'incidente-fin': () => {
        const { descripcion, impacto, fechaInicioFin, horaInicioFin, fechaFin, horaFin, accionesEjecutadas } = formData;
        return `*GESTIÓN INCIDENTE*\n🟢 *Recuperado*\n\n*Descripción:* ${descripcion || "DESCRIPCION DEL INCIDENTE"}\n*Impacto:* ${impacto || "Impacto servicio / usuarios"}\n*Inicio:* ${formatearFecha(fechaInicioFin)} - ${horaInicioFin}\n*Fin:* ${formatearFecha(fechaFin)} - ${horaFin}\n*Duración:* ${duracionCalculada}\n*Acciones ejecutadas:*${formatearAcciones(accionesEjecutadas)}`;
      }
    };
    
    mensaje = templates[tipo]?.() || "";
    
    if (formData.nota) {
      mensaje += `\n\n*📣 NOTA:*\n        ${formData.nota}`;
    }
    
    setResultado(mensaje);
    showAlert('¡Comunicado generado exitosamente!');
  }, [formData, duracionCalculada, formatearFecha, formatearAcciones, showAlert]);

  const copiarAlPortapapeles = useCallback(async () => {
    if (!resultado) {
      showAlert('No hay comunicado para copiar', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(resultado);
      showAlert('¡Comunicado copiado al portapapeles!');
    } catch (err) {
      showAlert('Error al copiar. Intenta seleccionar y copiar manualmente.', 'error');
    }
  }, [resultado, showAlert]);

  // Componentes de UI
  const TipoButton = ({ id, icon, nombre, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`
        flex flex-col items-center p-4 rounded-xl transition-all duration-300 transform
        ${isActive 
          ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105' 
          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 hover:scale-102'
        }
      `}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="font-medium">{nombre}</span>
    </button>
  );

  const FormField = ({ label, name, type = "text", placeholder, value, onChange, readOnly = false, rows }) => (
    <div>
      <label className="block mb-2 font-medium text-gray-300">{label}</label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${
            readOnly ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg p-6 md:p-8 text-center rounded-2xl mb-8 border border-blue-500/20 shadow-xl">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
            <MessageSquare size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Generador de Comunicados
          </h1>
          <p className="text-lg text-gray-300">Sistema para el Grupo de Monitoreo</p>
        </header>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 shadow-xl border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Settings className="mr-3 text-blue-400" size={24} />
            Tipo de Comunicado
          </h2>
          
          {/* Selector de Tipos */}
          <div className="space-y-6">
            {Object.entries(TIPOS_CONFIG).map(([categoria, tipos]) => (
              <div key={categoria}>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center capitalize">
                  <Activity className="mr-2 text-blue-400" size={20} />
                  {categoria}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tipos.map((tipo) => (
                    <TipoButton
                      key={tipo.id}
                      {...tipo}
                      isActive={formData.tipo === tipo.id}
                      onClick={seleccionarTipo}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Formulario Dinámico */}
          <div className="mt-8 space-y-6">
            {/* Campos para Eventos e Incidentes */}
            {(formData.tipo.startsWith('evento-') || formData.tipo.startsWith('incidente-')) && (
              <>
                <FormField
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del incidente"
                />
                <FormField
                  label="Impacto"
                  name="impacto"
                  value={formData.impacto}
                  onChange={handleInputChange}
                  placeholder="Impacto en servicio/usuarios"
                />
              </>
            )}

            {/* Campos para Mantenimiento */}
            {formData.tipo.startsWith('mantenimiento-') && (
              <>
                <FormField
                  label="Motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                  placeholder="Descripción del mantenimiento"
                />
                <FormField
                  label="Impacto"
                  name="impactoMant"
                  value={formData.impactoMant}
                  onChange={handleInputChange}
                  placeholder="Impacto en servicio/usuarios/clientes"
                />
                <FormField
                  label="Ejecutor"
                  name="ejecutor"
                  value={formData.ejecutor}
                  onChange={handleInputChange}
                  placeholder="Proveedor o área interna"
                />
              </>
            )}

            {/* Campos de Fecha/Hora para Inicio */}
            {formData.tipo.endsWith('-inicio') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Fecha"
                  name="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Hora"
                  name="horaInicio"
                  type="time"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Campos para Acciones */}
            {formData.tipo === 'evento-seguimiento' && (
              <FormField
                label="Acciones (una por línea)"
                name="acciones"
                type="textarea"
                value={formData.acciones}
                onChange={handleInputChange}
                placeholder="Acción %% Responsable (opcional)"
                rows={5}
              />
            )}

            {formData.tipo === 'incidente-avance' && (
              <>
                <FormField
                  label="Acciones en curso"
                  name="accionesEnCurso"
                  type="textarea"
                  value={formData.accionesEnCurso}
                  onChange={handleInputChange}
                  placeholder="Acción %% Responsable (opcional)"
                  rows={5}
                />
                <FormField
                  label="Acciones ejecutadas"
                  name="accionesEjecutadas"
                  type="textarea"
                  value={formData.accionesEjecutadas}
                  onChange={handleInputChange}
                  placeholder="Acción %% Responsable (opcional)"
                  rows={5}
                />
              </>
            )}

            {/* Campos para Fin */}
            {formData.tipo.endsWith('-fin') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Fecha inicio"
                    name="fechaInicioFin"
                    type="date"
                    value={formData.fechaInicioFin}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Hora inicio"
                    name="horaInicioFin"
                    type="time"
                    value={formData.horaInicioFin}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Fecha fin"
                    name="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label="Hora fin"
                    name="horaFin"
                    type="time"
                    value={formData.horaFin}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Duración calculada</p>
                    <p className="text-2xl font-bold text-blue-400">{duracionCalculada}</p>
                  </div>
                </div>

                {(formData.tipo === 'evento-fin' || formData.tipo === 'incidente-fin') && (
                  <FormField
                    label="Acciones ejecutadas"
                    name={formData.tipo === 'evento-fin' ? 'acciones' : 'accionesEjecutadas'}
                    type="textarea"
                    value={formData.tipo === 'evento-fin' ? formData.acciones : formData.accionesEjecutadas}
                    onChange={handleInputChange}
                    placeholder="Acción %% Responsable (opcional)"
                    rows={5}
                  />
                )}
              </>
            )}

            {/* Nota adicional */}
            <FormField
              label="Nota adicional (opcional)"
              name="nota"
              type="textarea"
              value={formData.nota}
              onChange={handleInputChange}
              placeholder="Observaciones adicionales"
              rows={3}
            />

            {/* Botón Generar */}
            <button
              onClick={generarMensaje}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <RefreshCw className="mr-2" size={20} />
              Generar Comunicado
            </button>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 mb-8 shadow-xl border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <MessageSquare className="mr-3 text-blue-400" size={24} />
            Comunicado Generado
          </h2>
          
          <div className="bg-gray-900 p-4 rounded-lg font-mono border-l-4 border-blue-500 min-h-[150px] overflow-x-auto">
            <pre className="whitespace-pre-wrap text-gray-100">{resultado || 'El comunicado aparecerá aquí...'}</pre>
          </div>

          {/* Alert */}
          {alert.show && (
            <div className={`mt-4 p-4 rounded-lg flex items-center ${
              alert.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {alert.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertCircle size={20} className="mr-2" />}
              {alert.message}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={copiarAlPortapapeles}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Copy className="mr-2" size={20} />
              Copiar al Portapapeles
            </button>
            <button
              onClick={limpiarCampos}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
            >
              <Trash2 className="mr-2" size={20} />
              Limpiar Campos
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-gray-400 text-sm border-t border-gray-700/50">
          <p className="mb-1">Desarrollado por Luis Alberto Herrera Lara</p>
          <p>Generador de Comunicados - Versión 2.0 Optimizada</p>
          <p className="text-xs">Actualizado el {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
