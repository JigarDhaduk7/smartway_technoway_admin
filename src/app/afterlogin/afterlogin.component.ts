import { Component, OnInit, Renderer2, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/api';

@Component({
  selector: 'app-afterlogin',
  templateUrl: './afterlogin.component.html',
  styleUrls: ['./afterlogin.component.scss']
})
export class AfterloginComponent implements OnInit {

  submenuActive: boolean = false;
  private backdrop: HTMLElement | null = null;

  origin: string = location.origin

  imageUrl: string = origin + '/assets/images/user-details-profile-image.png';

  userProfile: any = {
    email: '',
    userName: '',
    mobileNumber: ''
  };

  updateForm: any = {
    userName: '',
    mobileNumber: ''
  };

  openMenu() {
    if (document.body.classList.contains('sidebar-open')) {
      this.renderer.removeClass(document.body, 'sidebar-open');
    } else {
      this.renderer.addClass(document.body, 'sidebar-open');
      this.addBackdrop(); // Call a function to add the backdrop
    }
  }

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService
  ) {
  }

  addBackdrop() {
    if (!this.backdrop && window.innerWidth <= 991) {
      this.backdrop = this.renderer.createElement('div');
      this.renderer.addClass(this.backdrop, 'backdrop');
      this.renderer.listen(this.backdrop, 'click', () => this.removeActiveClass());
      this.renderer.appendChild(document.body, this.backdrop);
    }
  }

  removeActiveClass() {
    if (this.backdrop) {
      this.renderer.removeChild(document.body, this.backdrop);
      this.backdrop = null;
    }
    this.renderer.removeClass(document.body, 'sidebar-open');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 991 && this.backdrop) {
      this.removeActiveClass();
    }
  }

  ngOnDestroy() {
    if (this.backdrop) {
      this.renderer.removeChild(document.body, this.backdrop);
    }
  }

  SelectOption1 = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' }, // disabled: true
    { id: 3, name: 'Option 3' },
    { id: 4, name: 'Option 4' },
  ];

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.userProfile = res.user;
          this.updateForm.userName = res.user.userName;
          this.updateForm.mobileNumber = res.user.mobileNumber;
        }
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  updateProfile() {
    this.authService.updateProfile(this.updateForm).subscribe({
      next: (res) => {
        if (res.success) {
          this.userProfile = res.user;
          alert('Profile updated successfully');
          const modal = document.getElementById('UpdateProfilePopup');
          if (modal) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) bootstrapModal.hide();
          }
        }
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile');
      }
    });
  }



}
