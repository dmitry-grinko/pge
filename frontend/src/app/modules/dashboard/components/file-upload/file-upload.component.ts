import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { EnergyService } from '../../../core/services/energy.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: true,
  imports: [NgIf]
})
export class FileUploadComponent {
  selectedFile: File | null = null;

  constructor(private energyService: EnergyService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  onUpload(): void {
    if (this.selectedFile) {
      // TODO: Implement file upload logic here
      console.log('Uploading file:', this.selectedFile.name);
      this.energyService.uploadEnergyData(this.selectedFile);
    }
  }
} 