import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { AiAnalysis } from '../../models/ai-analysis.model';

@Component({
  selector: 'app-analyze',
  imports: [FormsModule, DatePipe],
  templateUrl: './analyze.html',
  styleUrl: './analyze.css'
})
export class Analyze {
  url = signal('');
  loading = signal(false);
  result = signal<AiAnalysis | null>(null);
  error = signal<string | null>(null);

  constructor(private aiService: AiService) {}

  onSubmit() {
    if (!this.url().trim()) return;

    this.loading.set(true);
    this.result.set(null);
    this.error.set(null);

    this.aiService.analyzeUrl(this.url()).subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al analizar la URL. Verifica que el backend esté corriendo.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  clearResult() {
    this.result.set(null);
    this.url.set('');
    this.error.set(null);
  }
}
