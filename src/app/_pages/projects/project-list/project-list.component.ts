import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService, Project, ProjectFilter } from '../../../services/api';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading: boolean = false;
  filter: ProjectFilter = {};
  projectToDelete: Project | null = null;
  toastMessage: string = '';
  toastType: 'success' | 'error' | '' = '';

  get isFilterApplied(): boolean {
    return !!(this.filter.title || this.filter.isPublished !== undefined);
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filter.title) count++;
    if (this.filter.isPublished !== undefined) count++;
    return count;
  }

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjects(this.filter).subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.showToast('Error loading projects', 'error');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.loadProjects();
  }

  resetFilter(): void {
    this.filter = {};
    this.loadProjects();
  }

  addNewProject(): void {
    this.router.navigate(['/projects/add-project']);
  }

  editProject(project: Project): void {
    console.log('Edit project clicked:', project);
    console.log('Project ID:', project._id, 'Slug:', project.slug);
    this.router.navigate(['/projects/add-project', project.slug]);
  }

  deleteProject(project: Project): void {
    this.projectToDelete = project;
  }

  confirmDelete(): void {
    if (this.projectToDelete) {
      this.projectService.deleteProject(this.projectToDelete._id).subscribe({
        next: () => {
          this.showToast('Project deleted successfully', 'success');
          this.loadProjects();
          this.projectToDelete = null;
        },
        error: () => {
          this.showToast('Error deleting project', 'error');
        }
      });
    }
  }

  cancelDelete(): void {
    this.projectToDelete = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  truncateText(text: string, limit: number = 100): string {
    const strippedText = text.replace(/<[^>]*>/g, '');
    return strippedText.length > limit ? strippedText.substring(0, limit) + '...' : strippedText;
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }
}