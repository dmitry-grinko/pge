import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  constructor() {
    axios.defaults.baseURL = environment.apiUrl;
  }

  public async inputEnergyData(data: any): Promise<void> {
    try {
      await axios.post('/energy/input', data);
    } catch (error) {
      throw error;
    }
  }

  public async uploadEnergyFile(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post('/energy/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public async getEnergyHistory(params?: { 
    startDate?: string, 
    endDate?: string 
  }): Promise<any> {
    try {
      const response = await axios.get('/energy/history', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getEnergySummary(): Promise<any> {
    try {
      const response = await axios.get('/energy/summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
} 