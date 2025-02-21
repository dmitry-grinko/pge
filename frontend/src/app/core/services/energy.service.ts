import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnergyService {
  constructor(private http: HttpClient) {}

  public async inputEnergyData(data: any): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/energy/input`, data));
    } catch (error) {
      throw error;
    }
  }

  public async uploadEnergyFile(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await firstValueFrom(this.http.post(`${environment.apiUrl}/energy/upload`, formData));
    } catch (error) {
      throw error;
    }
  }

  public async getEnergyHistory(params?: { 
    startDate?: string, 
    endDate?: string 
  }): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/energy/history`, { params })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getEnergySummary(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/energy/summary`)
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async uploadEnergyData(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await firstValueFrom(this.http.post(`${environment.apiUrl}/energy/upload`, formData));
    } catch (error) {
      throw error;
    }
  }
} 