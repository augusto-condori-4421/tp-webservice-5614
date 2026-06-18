// llamadas a la api de text-to-speech de EidosSpeech, se usa en text-to-speech.component.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TextToSpeechService {

  private apiUrl = 'https://eidosspeech.xyz/api/v1/tts';

  constructor(private http: HttpClient) {}

  // manda el texto y la voz, recibe el audio como blob
  synthesizeSpeech(text: string, voice: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'X-API-Key': environment.eidosspeach,
      'Content-Type': 'application/json'
    });
    const body = { text, voice };
    // responseType blob para recibir el audio directamente
    return this.http.post(this.apiUrl, body, { headers, responseType: 'blob' });
  }
}
