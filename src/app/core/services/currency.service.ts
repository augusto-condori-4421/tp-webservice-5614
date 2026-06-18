// llamadas a la api de divisas de APILayer, se usa en currency-converter.component.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CurrencyService {

  private baseUrl = 'https://api.apilayer.com/currency_data';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'apikey': environment.apiLayerKey
    });
  }

  // trae la lista de monedas disponibles
  getCurrencies(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/list`, { headers: this.getHeaders() });
  }

  // convierte un monto de una moneda a otra
  convertCurrency(from: string, to: string, amount: number): Observable<any> {
    const url = `${this.baseUrl}/convert?to=${to}&from=${from}&amount=${amount}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
}
