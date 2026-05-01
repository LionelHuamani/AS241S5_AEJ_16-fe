import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { AiAnalysis } from '../../models/ai-analysis.model';
import { FilterByTypePipe } from '../../pipes/filter-by-type.pipe';

@Component({
  selector: 'app-history',
  imports: [DatePipe, FilterByTypePipe],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {
  items = signal<AiAnalysis[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  selectedItem = signal<AiAnalysis | null>(null);

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set(null);
    this.aiService.findAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el historial. Verifica que el backend esté corriendo.');
        this.loading.set(false);
      }
    });
  }

  deleteItem(id: string) {
    this.deletingId.set(id);
    this.aiService.delete(id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.id !== id));
        this.deletingId.set(null);
        if (this.selectedItem()?.id === id) this.selectedItem.set(null);
      },
      error: () => {
        this.deletingId.set(null);
      }
    });
  }

  openDetail(item: AiAnalysis) {
    this.selectedItem.set(item);
  }

  closeDetail() {
    this.selectedItem.set(null);
  }
}
