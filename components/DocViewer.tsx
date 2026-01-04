import React from 'react';
import { DocVersion } from '../types';
import { ArrowLeft, Download, FileText, Printer } from 'lucide-react';

interface DocViewerProps {
  doc: DocVersion;
  projectName: string;
  onBack: () => void;
}

export const DocViewer: React.FC<DocViewerProps> = ({ doc, projectName, onBack }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>${projectName} - ${doc.type}</title>
                    <style>
                        body { font-family: sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        h2 { font-size: 20px; color: #444; margin-top: 30px; }
                        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
                        code { font-family: monospace; }
                    </style>
                </head>
                <body>
                    ${doc.content.replace(/\n/g, '<br/>')} 
                    <!-- Note: A real implementation would use a proper markdown-to-html parser -->
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
  };

  const handleDownload = () => {
      const element = document.createElement("a");
      const file = new Blob([doc.content], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = `${projectName.toLowerCase().replace(/\s/g, '-')}-${doc.type.toLowerCase().replace(/\s/g, '-')}.md`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      document.body.removeChild(element);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
         <div className="flex items-center">
            <button 
                onClick={onBack}
                className="mr-4 text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h2 className="text-lg font-bold text-slate-800">{doc.type}</h2>
                <p className="text-xs text-slate-500">{projectName} • Version {doc.version}</p>
            </div>
         </div>
         <div className="flex space-x-3">
             <button 
                onClick={handlePrint}
                className="flex items-center text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
             >
                 <Printer size={16} className="mr-2" />
                 PDF / Print
             </button>
             <button 
                onClick={handleDownload}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
             >
                 <Download size={16} className="mr-2" />
                 Download Markdown
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-auto p-8 doc-scroll">
          <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-xl p-10 min-h-[800px]">
              {/* Simulation of a Markdown renderer using whitespace-pre-wrap for MVP */}
              <div className="prose prose-slate max-w-none font-sans whitespace-pre-wrap leading-relaxed text-slate-800">
                {doc.content}
              </div>
          </div>
      </div>
    </div>
  );
};