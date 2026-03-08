import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { JobApplicationService } from '../../../services/api';

@Component({
  selector: 'app-career-enquiry-list',
  templateUrl: './career-enquiry-list.component.html',
  styleUrls: ['./career-enquiry-list.component.scss']
})
export class CareerEnquiryListComponent implements OnInit {

  origin: string = location.origin
  applications: any[] = [];

  SelectOption: any = []
  SelectOption1 = [
    {
      value: 1,
      label: 'Option 1'
    },
    {
      value: 2,
      label: 'Option 2'
    }
  ];

  SelectOption_2: any = []
  SelectOption2 = [
    {
      value: 1,
      label: 'Option 1'
    },
    {
      value: 2,
      label: 'Option 2'
    }
  ];

  datepickerConfig1: any = <BsDatepickerConfig>{ containerClass: '', dateInputFormat: 'DD/MM/ YYYY', adaptivePosition: true, showWeekNumbers: false };

  dateRange1: any = Date

  onOpenCalendar(container: any) {
    console.log(container);
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    }
    container.setViewMode('month');
  }

  onDateChange(event: any): void {
    // console.log('Start Date changed:', event);
  }

  //For datepicker Code End

  constructor(
    private dtpicker: BsDatepickerConfig,
    private jobApplicationService: JobApplicationService
  ) { }


  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.jobApplicationService.getApplications().subscribe({
      next: (response) => {
        this.applications = response.data || [];
      },
      error: (error) => {
        console.error('Error loading applications:', error);
      }
    });
  }

  deleteApplication(id: string): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.jobApplicationService.deleteApplication(id).subscribe({
        next: () => {
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error deleting application:', error);
        }
      });
    }
  }

}
