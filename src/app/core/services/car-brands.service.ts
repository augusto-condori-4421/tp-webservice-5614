// llamadas a la api de marcas y modelos de autos, se usa en car-maker.component.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarBrandsService {

  private makesUrl = 'https://car-specs.p.rapidapi.com/v2/cars/makes';

  // caché de marcas para no hacer doble petición
  private cachedMakes: any[] | null = null;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': environment.rapidApiKey,
      'X-RapidAPI-Host': 'car-specs.p.rapidapi.com'
    });
  }

  // trae todas las marcas, con caché para no repetir la petición
  getMakes(): Observable<any[]> {
    if (this.cachedMakes) {
      // si los datos ya están en caché, los devuelvo sin llamar a la api de nuevo
      return of(this.cachedMakes);
    }
    return this.http.get<any[]>(this.makesUrl, { headers: this.getHeaders() }).pipe(
      tap(data => this.cachedMakes = data)
    );
  }

  // trae los modelos de una marca específica — endpoint con path param: /makes/{id}/models
  getModelsByMake(makeId: any): Observable<any[]> {
    const url = `https://car-specs.p.rapidapi.com/v2/cars/makes/${makeId}/models`;
    return this.http.get<any[]>(url, { headers: this.getHeaders() });
  }
}
