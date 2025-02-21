import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManualDataInputComponent } from './components/manual-data-input/manual-data-input.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManualDataInputComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    NgbNavModule
  ]
})
export class DashboardModule { }
