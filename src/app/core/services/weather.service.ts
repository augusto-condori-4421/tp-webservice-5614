// llamadas a la api de clima Open-Meteo (gratuita, sin key)
// se usa en weather.component.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

// interfaz con los datos del clima que mostramos
export interface WeatherResult {
  ciudad: string;
  pais: string;
  temperatura: number;
  viento: number;
  weathercode: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {

  private geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  // busca las coordenadas de una ciudad
  private searchCity(name: string): Observable<any> {
    const url = `${this.geocodingUrl}?name=${encodeURIComponent(name)}&count=1&language=es`;
    return this.http.get<any>(url);
  }

  // trae el clima actual para unas coordenadas dadas
  private getWeather(lat: number, lon: number): Observable<any> {
    const url = `${this.forecastUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    return this.http.get<any>(url);
  }

  // encadena la búsqueda de ciudad con la consulta del clima
  getWeatherByCity(cityName: string): Observable<WeatherResult> {
    return this.searchCity(cityName).pipe(
      switchMap(geoData => {
        const city = geoData.results?.[0];
        if (!city) {
          throw { status: 404 };
        }
        return this.getWeather(city.latitude, city.longitude).pipe(
          map(weatherData => ({
            ciudad: city.name,
            pais: city.country,
            temperatura: weatherData.current_weather.temperature,
            viento: weatherData.current_weather.windspeed,
            weathercode: weatherData.current_weather.weathercode
          } as WeatherResult))
        );
      })
    );
  }

  // convierte el código WMO de Open-Meteo en texto legible
  getWeatherDescription(code: number): string {
    if (code === 0) return 'Cielo despejado';
    if ([1, 2, 3].includes(code)) return 'Parcialmente nublado';
    if ([45, 48].includes(code)) return 'Neblina';
    if ([51, 53, 55].includes(code)) return 'Llovizna';
    if ([61, 63, 65].includes(code)) return 'Lluvia';
    if ([71, 73, 75].includes(code)) return 'Nevada';
    if ([80, 81, 82].includes(code)) return 'Chubascos';
    if (code === 95) return 'Tormenta';
    return 'Condición desconocida';
  }

  // devuelve la clase de Bootstrap Icons según el código WMO
  getWeatherIcon(code: number): string {
    if (code === 0) return 'bi-sun-fill';
    if ([1, 2, 3].includes(code)) return 'bi-cloud-sun-fill';
    if ([45, 48].includes(code)) return 'bi-cloud-fog2-fill';
    if (code >= 51 && code <= 55) return 'bi-cloud-drizzle-fill';
    if (code >= 61 && code <= 65) return 'bi-cloud-rain-fill';
    if (code >= 71 && code <= 75) return 'bi-cloud-snow-fill';
    if (code >= 80 && code <= 82) return 'bi-cloud-rain-heavy-fill';
    if (code === 95) return 'bi-cloud-lightning-rain-fill';
    return 'bi-cloud-fill';
  }
}
