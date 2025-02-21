import { Component } from '@angular/core';
import { ManualDataInputComponent } from './components/manual-data-input/manual-data-input.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [ManualDataInputComponent, NgbNavModule, FileUploadComponent]
})
export class DashboardComponent {}
