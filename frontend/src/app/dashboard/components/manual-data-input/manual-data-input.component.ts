import { Component, ViewChild } from '@angular/core';
import { EnergyService } from '../../../core/services/energy.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(private energyService: EnergyService, private authService: AuthService) {}
  
  async submitEnergyData(event: Event) {
    event.preventDefault();
    const date = this.myForm.value.date;
    const usage = this.myForm.value.usage;
    const source = 'manual';
    const userId = this.authService.getUserId();
    
    if (this.myForm.valid && userId) {
      try {
        await this.energyService.inputEnergyData({ usage, date, source, userId });
      } catch (error) {
        console.error('Failed to submit energy data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }
} 