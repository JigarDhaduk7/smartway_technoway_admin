import { Component, OnInit } from '@angular/core';
import { LeaderService, Leader, LeaderFilter } from '../../services/api';

@Component({
  selector: 'app-visionary-leadership',
  templateUrl: './visionary-leadership.component.html',
  styleUrls: ['./visionary-leadership.component.scss']
})
export class VisionaryLeadershipComponent implements OnInit {
  leaders: Leader[] = [];
  loading: boolean = false;
  filter: LeaderFilter = {};
  leaderToDelete: Leader | null = null;
  isEditMode: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | '' = '';

  newLeader: Partial<Leader> = {
    name: '',
    position: ''
  };
  selectedFile: File | null = null;

  get isFilterApplied(): boolean {
    return !!(this.filter.name || this.filter.position);
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filter.name) count++;
    if (this.filter.position) count++;
    return count;
  }

  constructor(private leaderService: LeaderService) { }

  ngOnInit(): void {
    this.loadLeaders();
  }

  loadLeaders(): void {
    this.loading = true;
    this.leaderService.getLeaders(this.filter).subscribe({
      next: (response) => {
        if (response.success) {
          this.leaders = response.data;
        }
        this.loading = false;
      },
      error: () => {
        this.showToast('Error loading leaders', 'error');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.loadLeaders();
  }

  resetFilter(): void {
    this.filter = {};
    this.loadLeaders();
  }

  addNewLeader(): void {
    this.isEditMode = false;
    this.newLeader = { name: '', position: '' };
    this.selectedFile = null;
  }

  editLeader(leader: Leader): void {
    this.isEditMode = true;
    this.newLeader = { ...leader };
    this.selectedFile = null;
  }

  resetForm(): void {
    this.newLeader = { name: '', position: '' };
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveLeader(): void {
    if (!this.newLeader.name || !this.newLeader.position) {
      this.showToast('Please fill all required fields', 'error');
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      this.showToast('Please select a profile image', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newLeader.name || '');
    formData.append('position', this.newLeader.position || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode) {
      this.leaderService.updateLeader(this.newLeader._id!, formData).subscribe({
        next: () => {
          this.showToast('Leader updated successfully', 'success');
          this.resetForm();
          this.loadLeaders();
          this.closeModalProgrammatically();
        },
        error: () => {
          this.showToast('Error updating leader', 'error');
        }
      });
    } else {
      this.leaderService.createLeader(formData).subscribe({
        next: () => {
          this.showToast('Leader added successfully', 'success');
          this.resetForm();
          this.loadLeaders();
          this.closeModalProgrammatically();
        },
        error: () => {
          this.showToast('Error adding leader', 'error');
        }
      });
    }
  }

  closeModalProgrammatically(): void {
    const modalElement = document.getElementById('AddLeaderModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  deleteLeader(leader: Leader): void {
    this.leaderToDelete = leader;
  }

  confirmDelete(): void {
    if (this.leaderToDelete) {
      this.leaderService.deleteLeader(this.leaderToDelete._id).subscribe({
        next: () => {
          this.showToast('Leader deleted successfully', 'success');
          this.loadLeaders();
          this.leaderToDelete = null;
        },
        error: () => {
          this.showToast('Error deleting leader', 'error');
        }
      });
    }
  }

  cancelDelete(): void {
    this.leaderToDelete = null;
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
