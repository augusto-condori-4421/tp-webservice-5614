// usa text-to-speech.service.ts para generar audio a partir de texto
// la lógica de llamadas http está en src/app/core/services/text-to-speech.service.ts
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextToSpeechService } from '../../core/services/text-to-speech.service';

// voces disponibles en EidosSpeech con su nombre para mostrar
interface Voice {
  id: string;
  label: string;
}

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './text-to-speech.component.html'
})
export class TextToSpeechComponent implements OnDestroy {

  inputText: string = '';
  selectedVoice: string = 'es-AR-TomasNeural';
  audioUrl: string | null = null;   // URL temporal del blob de audio
  loading: boolean = false;
  errorMsg: string = '';
  charCount: number = 0;

  // voces disponibles en EidosSpeech (formato Microsoft Neural)
  voices: Voice[] = [
    { id: 'es-AR-TomasNeural',    label: 'Tomás — Español (Argentina)' },
    { id: 'es-AR-ElenaNeural',    label: 'Elena — Español (Argentina)' },
    { id: 'es-ES-AlvaroNeural',   label: 'Álvaro — Español (España)' },
    { id: 'es-ES-ElviraNeural',   label: 'Elvira — Español (España)' },
    { id: 'en-US-GuyNeural',      label: 'Guy — English (US)' },
    { id: 'en-US-JennyNeural',    label: 'Jenny — English (US)' },
    { id: 'pt-BR-FranciscaNeural',label: 'Francisca — Português (Brasil)' }
  ];

  constructor(private ttsService: TextToSpeechService) {}

  // actualizo el contador de caracteres al escribir
  onTextChange(): void {
    this.charCount = this.inputText.length;
  }

  // devuelve el label legible de la voz actualmente seleccionada
  get selectedVoiceLabel(): string {
    return this.voices.find(v => v.id === this.selectedVoice)?.label ?? this.selectedVoice;
  }

  // llamo a la api y genero la url del audio
  onGenerate(): void {
    if (!this.inputText.trim()) return;

    this.loading = true;
    this.errorMsg = '';

    // libero la url anterior si existe para no desperdiciar memoria
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }

    this.ttsService.synthesizeSpeech(this.inputText, this.selectedVoice).subscribe({
      next: (blob) => {
        this.audioUrl = URL.createObjectURL(blob);
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.errorMsg = 'API key inválida. Verificá la clave de EidosSpeech.';
        } else {
          this.errorMsg = 'Error al generar el audio. Intentá de nuevo.';
        }
        this.loading = false;
      }
    });
  }

  // limpio la url del blob al destruir el componente
  ngOnDestroy(): void {
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
}
