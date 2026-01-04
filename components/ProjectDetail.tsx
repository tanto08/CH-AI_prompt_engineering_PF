import React, { useState } from 'react';
import { Project, DocType, DocVersion, ProjectStatus } from '../types';
import { ArrowLeft, BookOpen, Cpu, Download, RefreshCw, FileText, Loader2, Sparkles, Code, Layout } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onGenerate: (type: DocType) => void;
  onViewDoc: (doc: DocVersion) => void;
  analysisSummary?: string;
  techStack?: string[];
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  onBack, 
  onGenerate, 
  onViewDoc,
  analysisSummary = "Analysis pending...",
  techStack = []
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'docs'>('overview');

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
             <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                {project.repoConfig.branch}
             </span>
          </div>
          <p className="text-slate-500">{project.repoConfig.url}</p>
        </div>
        <div className="flex gap-3">
            <button 
               onClick={() => onGenerate(DocType.USER_GUIDE)}
               disabled={project.status !== ProjectStatus.IDLE && project.status !== ProjectStatus.UP_TO_DATE}
               className="flex items-center bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            >
               {project.status === ProjectStatus.GENERATING ? <Loader2 className="animate-spin mr-2" size={16}/> : <BookOpen size={16} className="mr-2 text-green-600" />}
               Generate User Guide
            </button>
            <button 
               onClick={() => onGenerate(DocType.TECHNICAL)}
               disabled={project.status !== ProjectStatus.IDLE && project.status !== ProjectStatus.UP_TO_DATE}
               className="flex items-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 shadow-sm"
            >
               {project.status === ProjectStatus.GENERATING ? <Loader2 className="animate-spin mr-2" size={16}/> : <Code size={16} className="mr-2 text-blue-400" />}
               Generate Tech Docs
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview & Analysis
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'docs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('docs')}
        >
          Documentation History ({project.docVersions.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Sparkles size={18} className="mr-2 text-purple-500" /> AI Analysis Summary
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{analysisSummary}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Layout size={18} className="mr-2 text-indigo-500" /> Structure Detected
                    </h3>
                    <div className="text-sm text-slate-500 mb-2">Simulated file tree analysis:</div>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm text-slate-700 border border-slate-200">
                        {project.language === 'python' ? (
                            <>
                            /src<br/>
                            &nbsp;&nbsp;├── models.py<br/>
                            &nbsp;&nbsp;├── views.py<br/>
                            &nbsp;&nbsp;└── utils.py<br/>
                            /tests<br/>
                            requirements.txt
                            </>
                        ) : (
                             <>
                            /src<br/>
                            &nbsp;&nbsp;├── components/<br/>
                            &nbsp;&nbsp;├── hooks/<br/>
                            &nbsp;&nbsp;└── App.tsx<br/>
                            package.json<br/>
                            tsconfig.json
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Cpu size={18} className="mr-2 text-blue-500" /> Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {techStack.length > 0 ? techStack.map((tech, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                {tech}
                            </span>
                        )) : (
                            <span className="text-slate-500 text-sm">No stack detected</span>
                        )}
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-md">
                     <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                     <p className="text-indigo-100 text-sm mb-4">
                         DocuFlow AI can detect changes in your commits. Connect a webhook to automate updates.
                     </p>
                     <button className="bg-white/20 hover:bg-white/30 text-white text-xs py-1.5 px-3 rounded transition-colors">
                         Configure Webhooks
                     </button>
                 </div>
            </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Version</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Created</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {project.docVersions.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                No documentation generated yet.
                            </td>
                        </tr>
                    ) : (
                        project.docVersions.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{doc.version}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        doc.type === DocType.USER_GUIDE ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                                    }`}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {doc.createdAt.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onClick={() => onViewDoc(doc)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};