import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SkillService, Skill, SkillFilter } from '../../../services/api';

declare var bootstrap: any;

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {
  skills: Skill[] = [];
  loading: boolean = false;
  filter: SkillFilter = {};
  skillToDelete: Skill | null = null;
  toastMessage: string = '';
  toastType: 'success' | 'error' | '' = '';
  skill: Partial<Skill> = { title: '', status: true };
  isEditMode = false;
  selectedFile: File | null = null;

  get isFilterApplied(): boolean {
    return !!(this.filter.title || this.filter.status !== undefined);
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filter.title) count++;
    if (this.filter.status !== undefined) count++;
    return count;
  }

  constructor(
    private skillService: SkillService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.skillService.getSkills(this.filter).subscribe({
      next: (response) => {
        if (response.success) {
          this.skills = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        this.showToast('Error loading skills', 'error');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.loadSkills();
  }

  resetFilter(): void {
    this.filter = {};
    this.loadSkills();
  }

  addNewSkill(): void {
    this.isEditMode = false;
    this.skill = { title: '', status: true };
    this.selectedFile = null;
  }

  editSkill(skill: Skill): void {
    this.isEditMode = true;
    this.skill = { ...skill };
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveSkill(): void {
    this.loading = true;
    const formData = new FormData();
    formData.append('title', this.skill.title || '');
    formData.append('status', this.skill.status?.toString() || 'true');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode) {
      this.skillService.updateSkill(this.skill._id!, formData).subscribe({
        next: () => {
          this.showToast('Skill updated successfully', 'success');
          this.closeModal();
          this.loadSkills();
          this.loading = false;
        },
        error: () => {
          this.showToast('Error updating skill', 'error');
          this.loading = false;
        }
      });
    } else {
      this.skillService.createSkill(formData).subscribe({
        next: () => {
          this.showToast('Skill created successfully', 'success');
          this.closeModal();
          this.loadSkills();
          this.loading = false;
        },
        error: () => {
          this.showToast('Error creating skill', 'error');
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.skill = { title: '', status: true };
    this.selectedFile = null;
    this.isEditMode = false;
  }

  closeModal(): void {
    const modalElement = document.getElementById('AddSkillModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
    this.resetForm();
  }

  deleteSkill(skill: Skill): void {
    this.skillToDelete = skill;
  }

  confirmDelete(): void {
    if (this.skillToDelete) {
      this.skillService.deleteSkill(this.skillToDelete._id).subscribe({
        next: () => {
          this.showToast('Skill deleted successfully', 'success');
          this.loadSkills();
          this.skillToDelete = null;
        },
        error: () => {
          this.showToast('Error deleting skill', 'error');
        }
      });
    }
  }

  cancelDelete(): void {
    this.skillToDelete = null;
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

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }
}