import React from 'react';

const GeneradorComunicados = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Prueba de Tailwind CSS</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500 text-white p-4 rounded">Cuadro Azul</div>
          <div className="bg-green-500 text-white p-4 rounded">Cuadro Verde</div>
        </div>
        
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Botón de Prueba
        </button>
        
        <p className="mt-4 text-gray-600">
          Si puedes ver este texto con estilos y los elementos coloreados arriba, 
          Tailwind CSS está funcionando correctamente.
        </p>
      </div>
    </div>
  );
};

export default GeneradorComunicados;
