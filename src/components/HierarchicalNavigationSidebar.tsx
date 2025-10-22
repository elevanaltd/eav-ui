import { useState } from 'react';
import { useNavigation, type Project, type Video } from '@elevanaltd/shared-lib';
import './HierarchicalNavigationSidebar.css';

export interface HierarchicalNavigationSidebarProps {
  projects: Project[];
  videos: Record<string, Video[]>;
  loading: boolean;
  error?: string;
  expandedProjects?: Set<string>;
  // eslint-disable-next-line no-unused-vars
  onProjectExpand: (projectId: string) => void;
}

export function HierarchicalNavigationSidebar({
  projects,
  videos,
  loading,
  error,
  expandedProjects: externalExpandedProjects,
  onProjectExpand,
}: HierarchicalNavigationSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [internalExpandedProjects, setInternalExpandedProjects] = useState<Set<string>>(new Set());

  const expandedProjects = externalExpandedProjects ?? internalExpandedProjects;

  const {
    setSelectedProject,
    setSelectedVideo,
    isProjectSelected,
    isVideoSelected: checkVideoSelected,
  } = useNavigation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleProject = (projectId: string) => {
    if (externalExpandedProjects === undefined) {
      const newExpanded = new Set(internalExpandedProjects);
      if (newExpanded.has(projectId)) {
        newExpanded.delete(projectId);
      } else {
        newExpanded.add(projectId);
      }
      setInternalExpandedProjects(newExpanded);
    }

    onProjectExpand(projectId);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    toggleProject(project.id);
  };

  const handleVideoClick = (video: Video, project: Project) => {
    setSelectedVideo(video, project);
  };

  if (loading && projects.length === 0) {
    return (
      <aside className={`nav-sidebar ${isCollapsed ? 'nav-sidebar--collapsed' : ''}`}>
        <div className="nav-header">
          <button className="nav-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="nav-loading">Loading projects...</div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`nav-sidebar ${isCollapsed ? 'nav-sidebar--collapsed' : ''}`}>
        <div className="nav-header">
          <button className="nav-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="nav-error">{error}</div>
      </aside>
    );
  }

  if (projects.length === 0) {
    return (
      <aside className={`nav-sidebar ${isCollapsed ? 'nav-sidebar--collapsed' : ''}`}>
        <div className="nav-header">
          <button className="nav-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <div className="nav-empty">No projects found</div>
      </aside>
    );
  }

  // Status calculation helper (from scripts-web)
  const getStatusDot = (mainStatus?: string, voStatus?: string) => {
    if (mainStatus === 'ready' && voStatus === 'ready') return 'status-ready';
    if (mainStatus === 'processing' || voStatus === 'processing') return 'status-processing';
    return 'status-pending';
  };

  return (
    <aside className={`nav-sidebar ${isCollapsed ? 'nav-sidebar--collapsed' : ''}`}>
      <div className="nav-header">
        <button className="nav-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="nav-content">
        <div className="nav-section">
          <div className="nav-list">
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const isSelected = isProjectSelected(project.id);
              const projectVideos = videos[project.eav_code] || [];

              return (
                <div key={project.id} className="nav-project">
                  <div
                    className={`nav-project-item ${isSelected ? 'nav-project-item--selected' : ''}`}
                    onClick={() => handleProjectClick(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleProjectClick(project);
                      }
                    }}
                  >
                    <div className="nav-project-icon">
                      {isExpanded ? '📂' : '📁'}
                    </div>
                    <div className="nav-project-info">
                      <div className="nav-project-title">{project.title}</div>
                      <div className="nav-project-meta">
                        {isExpanded ? `${projectVideos.length} videos` : 'Click to expand'}
                        {project.due_date && ` • Due ${project.due_date}`}
                      </div>
                    </div>
                    <div className="nav-project-expand">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {isExpanded && projectVideos.length > 0 && (
                    <div className="nav-video-list">
                      {projectVideos.map((video) => {
                        const isVideoSelected = checkVideoSelected(video.id);
                        return (
                          <div
                            key={video.id}
                            className={`nav-video-item ${isVideoSelected ? 'nav-video-item--selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoClick(video, project);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVideoClick(video, project);
                              }
                            }}
                          >
                            <div
                              className={`nav-video-status ${getStatusDot(video.main_stream_status, video.vo_stream_status)}`}
                            ></div>
                            <div className="nav-video-info">
                              <div className="nav-video-title">{video.title}</div>
                              <div className="nav-video-meta">
                                Main: {video.main_stream_status || 'N/A'} | VO: {video.vo_stream_status || 'N/A'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
