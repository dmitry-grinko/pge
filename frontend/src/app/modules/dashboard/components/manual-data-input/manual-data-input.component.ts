import { Component } from '@angular/core';
import { EnergyService } from '../../../core/services/energy.service';

@Component({
  selector: 'app-manual-data-input',
  templateUrl: './manual-data-input.component.html',
  styleUrls: ['./manual-data-input.component.scss'],
  standalone: true
})
export class ManualDataInputComponent {
  constructor(private energyService: EnergyService) {}

  async submitEnergyData(event: Event) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const value = formData.get('value');
    const date = formData.get('date');

    console.log('value', value);
    console.log('date', date);

    if (!value || !date) {
      console.error('Value and date are required');
      return;
    }

    try {
      await this.energyService.inputEnergyData({
        value: value,
        date: date,
        type: 'electricity'
      });
    } catch (error) {
      console.error('Failed to submit energy data:', error);
    }
  }
} 