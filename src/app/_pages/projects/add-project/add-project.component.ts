import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProjectService, Project } from '../../../services/api';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  projectForm: Partial<Project> = {
    title: '',
    content: '',
    isPublished: true
  };
  selectedFile: File | null = null;
  isEditMode: boolean = false;
  projectId: string | null = null;
  actualProjectId: string | null = null;
  toastMessage: string = '';
  toastType: 'success' | 'error' | '' = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '200px',
    minHeight: '0',
    placeholder: 'Enter text here...',
    translate: 'no',
    toolbarHiddenButtons: [['insertImage', 'insertVideo']]
  };

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = params['id'];
        this.loadProject(params['id']);
      }
    });
  }

  loadProject(id: string): void {
    this.projectService.getProjectBySlug(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectForm = response.data;
          this.actualProjectId = response.data._id;
          this.projectForm.isPublished = response.data.isPublished === true;
          console.log('Loaded project status:', this.projectForm.isPublished);
          this.displayExistingImage();
        }
      },
      error: (error) => {
        this.showToast('Error loading project', 'error');
      }
    });
  }

  displayExistingImage(): void {
    if (this.projectForm.image) {
      setTimeout(() => {
        const preview = document.getElementById('file-image') as HTMLImageElement;
        if (preview && this.projectForm.image) {
          preview.src = this.projectForm.image;
          preview.classList.remove('hidden');
          const startDiv = document.getElementById('start');
          if (startDiv) startDiv.style.display = 'none';
        }
      }, 100);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension || '')) {
        this.showToast('Only image files (JPG, PNG, GIF, WebP) are allowed', 'error');
        event.target.value = '';
        return;
      }
      
      console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const preview = document.getElementById('file-image') as HTMLImageElement;
        if (preview) {
          preview.src = e.target.result;
          preview.classList.remove('hidden');
          const startDiv = document.getElementById('start');
          if (startDiv) startDiv.style.display = 'none';
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveProject(): void {
    if (!this.projectForm.title || !this.projectForm.content) {
      this.showToast('Please fill all required fields', 'error');
      return;
    }

    if (!this.selectedFile && !this.isEditMode) {
      this.showToast('Please select an image', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.projectForm.title);
    formData.append('content', this.projectForm.content);
    formData.append('slug', this.projectService.generateSlug(this.projectForm.title));
    formData.append('isPublished', this.projectForm.isPublished?.toString() || 'true');
    
    if (this.selectedFile) {
      console.log('Appending file:', this.selectedFile.name, 'Type:', this.selectedFile.type);
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    if (this.isEditMode && this.actualProjectId) {
      this.projectService.updateProject(this.actualProjectId, formData).subscribe({
        next: () => {
          this.showToast('Project updated successfully', 'success');
          setTimeout(() => this.router.navigate(['/projects/project-list']), 1500);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.showToast('Error updating project', 'error');
        }
      });
    } else {
      this.projectService.createProject(formData).subscribe({
        next: () => {
          this.showToast('Project created successfully', 'success');
          setTimeout(() => this.router.navigate(['/projects/project-list']), 1500);
        },
        error: (error) => {
          console.error('Create error:', error);
          this.showToast('Error creating project', 'error');
        }
      });
    }
  }

  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = '';
      this.toastType = '';
    }, 3000);
  }

  goBack(): void {
    this.router.navigate(['/projects/project-list']);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Chart.js code if needed
    });
  }
}