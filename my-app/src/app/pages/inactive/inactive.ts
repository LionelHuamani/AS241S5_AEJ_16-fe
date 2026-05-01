import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { AiAnalysis } from '../../models/ai-analysis.model';

@Component({
  selector: 'app-inactive',
  imports: [DatePipe],
  templateUrl: './inactive.html',
  styleUrl: './inactive.css'
})
export class Inactive implements OnInit {
  items = signal<AiAnalysis[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  restoringId = signal<string | null>(null);

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    this.aiService.findInactive().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar los registros inactivos.');
        this.loading.set(false);
      }
    });
  }

  restoreItem(id: string) {
    this.restoringId.set(id);
    this.aiService.restore(id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.id !== id));
        this.restoringId.set(null);
      },
      error: () => {
        this.restoringId.set(null);
      }
    });
  }
}
