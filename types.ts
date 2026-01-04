export enum DocType {
  USER_GUIDE = 'User Guide',
  TECHNICAL = 'Technical Reference',
  ARCHITECTURE = 'Architecture Overview'
}

export enum ProjectStatus {
  IDLE = 'Idle',
  ANALYZING = 'Analyzing',
  GENERATING = 'Generating Docs',
  UP_TO_DATE = 'Up to Date',
  ERROR = 'Error'
}

export interface RepositoryConfig {
  url: string;
  branch: string;
  type: 'github' | 'gitlab' | 'bitbucket' | 'other';
  isPrivate: boolean;
}

export interface Project {
  id: string;
  name: string;
  repoConfig: RepositoryConfig;
  status: ProjectStatus;
  lastAnalysis: Date | null;
  language: string;
  docVersions: DocVersion[];
}

export interface DocVersion {
  id: string;
  version: string;
  createdAt: Date;
  content: string; // Markdown content
  type: DocType;
}

export interface AnalysisResult {
  fileTree: string[];
  modules: string[];
  complexity: string;
  summary: string;
}