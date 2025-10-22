import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationProvider } from '@elevanaltd/shared-lib';
import { HierarchicalNavigationSidebar } from './HierarchicalNavigationSidebar';

describe('HierarchicalNavigationSidebar', () => {
  const mockProjects = [
    { id: '1', title: 'Project Alpha', eav_code: 'PA001' },
    { id: '2', title: 'Project Beta', eav_code: 'PB001' },
  ];

  const mockVideos = {
    PA001: [
      { id: 'v1', eav_code: 'PA001', title: 'Video 1', main_stream_status: 'ready' },
      { id: 'v2', eav_code: 'PA001', title: 'Video 2', main_stream_status: 'processing' },
    ],
  };

  it('should render project list', () => {
    render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={mockProjects}
          videos={mockVideos}
          loading={false}
          onProjectExpand={vi.fn()}
        />
      </NavigationProvider>
    );

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
  });

  it('should toggle project expansion on click', () => {
    const onProjectExpand = vi.fn();

    render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={mockProjects}
          videos={mockVideos}
          loading={false}
          onProjectExpand={onProjectExpand}
        />
      </NavigationProvider>
    );

    const projectItem = screen.getByText('Project Alpha');
    fireEvent.click(projectItem);

    expect(onProjectExpand).toHaveBeenCalledWith('1');
  });

  it('should render videos when project expanded', () => {
    render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={mockProjects}
          videos={mockVideos}
          loading={false}
          expandedProjects={new Set(['1'])}
          onProjectExpand={vi.fn()}
        />
      </NavigationProvider>
    );

    expect(screen.getByText('Video 1')).toBeInTheDocument();
    expect(screen.getByText('Video 2')).toBeInTheDocument();
  });

  it('should call onProjectExpand when project clicked', () => {
    const onProjectExpand = vi.fn();

    render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={mockProjects}
          videos={mockVideos}
          loading={false}
          onProjectExpand={onProjectExpand}
        />
      </NavigationProvider>
    );

    const projectAlpha = screen.getByText('Project Alpha');
    fireEvent.click(projectAlpha);

    expect(onProjectExpand).toHaveBeenCalledWith('1');
  });

  it('should display loading state', () => {
    render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={[]}
          videos={{}}
          loading={true}
          onProjectExpand={vi.fn()}
        />
      </NavigationProvider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display error state', () => {
    render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={[]}
          videos={{}}
          loading={false}
          error="Failed to load projects"
          onProjectExpand={vi.fn()}
        />
      </NavigationProvider>
    );

    expect(screen.getByText('Failed to load projects')).toBeInTheDocument();
  });

  it('should collapse sidebar when toggle clicked', () => {
    const { container } = render(
      <NavigationProvider>
        <HierarchicalNavigationSidebar
          projects={mockProjects}
          videos={mockVideos}
          loading={false}
          onProjectExpand={vi.fn()}
        />
      </NavigationProvider>
    );

    const sidebar = container.querySelector('.nav-sidebar');
    const toggleButton = container.querySelector('.nav-toggle');

    fireEvent.click(toggleButton!);

    expect(sidebar).toHaveClass('nav-sidebar--collapsed');
  });
});
