import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { AiAnalysis } from '../../models/ai-analysis.model';

@Component({
  selector: 'app-generate',
  imports: [FormsModule, DatePipe],
  templateUrl: './generate.html',
  styleUrl: './generate.css'
})
export class Generate {
  prompt = signal('');
  loading = signal(false);
  result = signal<AiAnalysis | null>(null);
  error = signal<string | null>(null);
  imageLoaded = signal(false);

  readonly suggestions = [
    'A futuristic city at night with neon lights',
    'A cute anime girl with blue hair in space',
    'A dragon flying over mountains at sunset',
    'Abstract digital art with vibrant colors',
    'A cyberpunk street market in the rain'
  ];

  constructor(private aiService: AiService) {}

  onSubmit() {
    if (!this.prompt().trim()) return;

    this.loading.set(true);
    this.result.set(null);
    this.error.set(null);
    this.imageLoaded.set(false);

    this.aiService.generateImage(this.prompt()).subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al generar la imagen. Verifica que el backend esté corriendo.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  useSuggestion(suggestion: string) {
    this.prompt.set(suggestion);
  }

  clearResult() {
    this.result.set(null);
    this.prompt.set('');
    this.error.set(null);
    this.imageLoaded.set(false);
  }

  onImageLoad() {
    this.imageLoaded.set(true);
  }
}
