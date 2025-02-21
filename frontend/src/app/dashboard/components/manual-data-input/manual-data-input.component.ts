import { Component, ViewChild } from '@angular/core';
import { EnergyService } from '../../../core/services/energy.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manual-data-input',
  templateUrl: './manual-data-input.component.html',
  styleUrls: ['./manual-data-input.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class ManualDataInputComponent {
  @ViewChild('myForm') myForm!: NgForm;
  
  formData = {
    usage: null,
    date: null
  };

  constructor(private energyService: EnergyService) {}
  
  async submitEnergyData(event: Event) {
    event.preventDefault();
    const date = this.myForm.value.date;
    const usage = this.myForm.value.usage;
    const source = 'manual';
    
    if (this.myForm.valid) {
      try {
        await this.energyService.inputEnergyData({ usage, date, source });
      } catch (error) {
        console.error('Failed to submit energy data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }
} 