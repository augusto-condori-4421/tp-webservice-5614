// usa weather.service.ts para buscar el clima por ciudad
// la lógica de llamadas http está en src/app/core/services/weather.service.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherResult } from '../../core/services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './weather.component.html'
})
export class WeatherComponent {

  cityInput: string = '';
  weatherResult: WeatherResult | null = null;
  loading: boolean = false;
  errorMsg: string = '';
  notFound: boolean = false;

  constructor(private weatherService: WeatherService) {}

  // busco el clima de la ciudad ingresada
  onSearch(): void {
    if (!this.cityInput.trim()) return;

    this.loading = true;
    this.weatherResult = null;
    this.errorMsg = '';
    this.notFound = false;

    this.weatherService.getWeatherByCity(this.cityInput).subscribe({
      next: (data) => {
        this.weatherResult = data;
        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 404) {
          this.notFound = true;
        } else {
          this.errorMsg = 'Error al consultar el clima. Intentá de nuevo.';
        }
        this.loading = false;
      }
    });
  }

  // delego la descripción e ícono al servicio
  getDescription(code: number): string {
    return this.weatherService.getWeatherDescription(code);
  }

  getIcon(code: number): string {
    return this.weatherService.getWeatherIcon(code);
  }
}
