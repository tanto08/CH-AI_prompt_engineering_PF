import React from 'react';
import { ArrowLeft, Zap, GitBranch, Sparkles, FileText, CheckCircle2, Terminal, Info } from 'lucide-react';

interface HowItWorksProps {
  onBack: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Volver al Panel
      </button>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">¿Cómo funciona DocuFlow AI?</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Simplificamos la documentación técnica y de usuario utilizando el poder de la IA de Google Gemini para analizar tu código.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <GitBranch size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">1. Conecta tu Repo</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Pega la URL de tu repositorio Git (GitHub, GitLab, etc.). DocuFlow detectará automáticamente la estructura de archivos y el stack tecnológico.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Sparkles size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">2. Análisis de IA</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Gemini analiza los componentes clave del código, patrones de arquitectura y dependencias para entender la lógica del negocio.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">3. Generación</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Elige el tipo de documento: Guía de Usuario para clientes o Referencia Técnica para desarrolladores.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Zap size={24} className="mr-3 text-yellow-500" /> Características Clave
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Detección automática de Tech Stack (React, Python, Node, etc.).",
              "Historial de versiones para cada documento generado.",
              "Exportación directa a Markdown (.md) y vista previa de impresión.",
              "Generación de diagramas de arquitectura sugeridos.",
              "Análisis de legibilidad y complejidad de código.",
              "Actualizaciones basadas en commits (próximamente)."
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start bg-slate-50 p-4 rounded-lg">
                <CheckCircle2 size={18} className="mr-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Terminal size={24} className="mr-3 text-blue-400" /> ¿Qué esperar como resultado?
          </h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-blue-300">Documentación de Usuario</h4>
              <p className="text-slate-300 text-sm">
                Un lenguaje sencillo, enfocado en flujos de trabajo, pantallas de interfaz y guías paso a paso. Ideal para personal no técnico o soporte.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-purple-300">Documentación Técnica</h4>
              <p className="text-slate-300 text-sm">
                Detalles de arquitectura, endpoints de API, modelos de datos y guía de instalación. Pensado para el mantenimiento de largo plazo por ingenieros.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center bg-blue-50 p-8 rounded-3xl border border-blue-100">
          <Info size={32} className="mx-auto text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-blue-900 mb-2">¿Listo para empezar?</h3>
          <p className="text-blue-700 mb-6 max-w-lg mx-auto">
            DocuFlow AI utiliza modelos generativos de última generación. Para mejores resultados, asegúrate de que tu repositorio tenga un archivo README básico o nombres de archivos descriptivos.
          </p>
          <button 
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
          >
            Conectar mi primer repositorio
          </button>
        </section>
      </div>
    </div>
  );
};