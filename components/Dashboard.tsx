import React from 'react';
import { Project, ProjectStatus } from '../types';
import { GitBranch, FileText, Clock, ChevronRight, Activity } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ projects, onSelectProject, onNewProject }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage documentation for your repositories.</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          + Connect Repository
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4 text-blue-500">
            <GitBranch size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Connect a Git repository to start generating automated documentation.</p>
          <button 
            onClick={onNewProject}
            className="mt-6 text-blue-600 font-medium hover:text-blue-800"
          >
            Connect your first repo →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <GitBranch size={20} />
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  project.status === ProjectStatus.UP_TO_DATE ? 'bg-green-100 text-green-700' :
                  project.status === ProjectStatus.GENERATING ? 'bg-yellow-100 text-yellow-700' :
                  project.status === ProjectStatus.ANALYZING ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{project.name}</h3>
              <p className="text-sm text-slate-500 mb-4 truncate">{project.repoConfig.url}</p>
              
              <div className="flex items-center text-xs text-slate-400 mb-4 space-x-4">
                <span className="flex items-center">
                   <Clock size={12} className="mr-1" />
                   {project.lastAnalysis ? new Date(project.lastAnalysis).toLocaleDateString() : 'Never'}
                </span>
                <span className="flex items-center">
                   <FileText size={12} className="mr-1" />
                   {project.docVersions.length} Versions
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-medium text-blue-600">
                View Details
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};