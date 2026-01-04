import React, { useState } from 'react';
import { RepoConnect } from './components/RepoConnect';
import { Dashboard } from './components/Dashboard';
import { ProjectDetail } from './components/ProjectDetail';
import { DocViewer } from './components/DocViewer';
import { HowItWorks } from './components/HowItWorks';
import { Project, RepositoryConfig, ProjectStatus, DocType, DocVersion } from './types';
import { analyzeRepository, generateDocumentation } from './services/geminiService';
import { Layout, HelpCircle } from 'lucide-react';

type ViewState = 'dashboard' | 'connect' | 'project' | 'doc' | 'how-it-works';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocVersion | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Cache for analysis results to pass to Detail view
  const [analysisCache, setAnalysisCache] = useState<Record<string, { summary: string, techStack: string[] }>>({});

  const handleConnect = async (config: RepositoryConfig, name: string) => {
    setLoading(true);
    try {
      // 1. Analyze
      const analysis = await analyzeRepository(config.url, config.branch);
      
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        repoConfig: config,
        status: ProjectStatus.IDLE,
        lastAnalysis: new Date(),
        language: analysis.techStack[0] || 'Unknown',
        docVersions: []
      };

      setProjects(prev => [...prev, newProject]);
      setAnalysisCache(prev => ({...prev, [newProject.id]: analysis}));
      
      setLoading(false);
      setView('dashboard');
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to analyze repository.");
    }
  };

  const handleGenerate = async (type: DocType) => {
    if (!selectedProject) return;

    // Update status to generating
    const updatedProject = { ...selectedProject, status: ProjectStatus.GENERATING };
    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);

    try {
      const analysis = analysisCache[selectedProject.id] || { summary: "No summary", techStack: [] };
      const content = await generateDocumentation(
          selectedProject.name, 
          type, 
          analysis.techStack,
          analysis.summary
      );

      const newDoc: DocVersion = {
        id: Math.random().toString(36).substr(2, 9),
        version: `v${(selectedProject.docVersions.length * 0.1 + 1.0).toFixed(1)}`,
        createdAt: new Date(),
        content,
        type
      };

      const completedProject = {
        ...selectedProject,
        status: ProjectStatus.UP_TO_DATE,
        docVersions: [newDoc, ...selectedProject.docVersions]
      };

      setProjects(projects.map(p => p.id === selectedProject.id ? completedProject : p));
      setSelectedProject(completedProject);
      
    } catch (e) {
      console.error(e);
      const errorProject = { ...selectedProject, status: ProjectStatus.ERROR };
      setProjects(projects.map(p => p.id === selectedProject.id ? errorProject : p));
      setSelectedProject(errorProject);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            projects={projects} 
            onSelectProject={(p) => { setSelectedProject(p); setView('project'); }}
            onNewProject={() => setView('connect')}
          />
        );
      case 'connect':
        return (
          <>
            <div className="max-w-6xl mx-auto px-6 pt-8">
               <button onClick={() => setView('dashboard')} className="text-slate-500 hover:text-slate-700">← Back to Dashboard</button>
            </div>
            <RepoConnect onConnect={handleConnect} isLoading={loading} />
          </>
        );
      case 'project':
        if (!selectedProject) return null;
        return (
          <ProjectDetail 
            project={selectedProject} 
            onBack={() => setView('dashboard')}
            onGenerate={handleGenerate}
            onViewDoc={(doc) => { setSelectedDoc(doc); setView('doc'); }}
            analysisSummary={analysisCache[selectedProject.id]?.summary}
            techStack={analysisCache[selectedProject.id]?.techStack}
          />
        );
      case 'doc':
        if (!selectedDoc || !selectedProject) return null;
        return (
            <DocViewer 
                doc={selectedDoc} 
                projectName={selectedProject.name}
                onBack={() => setView('project')}
            />
        );
      case 'how-it-works':
        return <HowItWorks onBack={() => setView('dashboard')} />;
      default:
        return <div>Unknown view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header (only show if not in doc viewer mode for immersive reading) */}
      {view !== 'doc' && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                    <Layout size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">DocuFlow AI</span>
            </div>
            <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setView('how-it-works')}
                  className={`flex items-center text-sm font-medium transition-colors ${view === 'how-it-works' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  <HelpCircle size={18} className="mr-1.5" />
                  ¿Cómo funciona?
                </button>
                <div className="flex items-center space-x-2">
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Beta v1.0</div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-sm"></div>
                </div>
            </div>
            </div>
        </header>
      )}
      
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;