import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { AiAnalysis } from '../../models/ai-analysis.model';
import { FilterByTypePipe } from '../../pipes/filter-by-type.pipe';

@Component({
  selector: 'app-history',
  imports: [DatePipe, FilterByTypePipe, FormsModule],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History implements OnInit {
  items = signal<AiAnalysis[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  selectedItem = signal<AiAnalysis | null>(null);

  // Edit modal
  editItem = signal<AiAnalysis | null>(null);
  editForm = signal<Partial<AiAnalysis>>({});
  saving = signal(false);
  saveSuccess = signal(false);

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

  // ── Edit ──────────────────────────────────────────
  openEdit(item: AiAnalysis, event: Event) {
    event.stopPropagation();
    this.editItem.set(item);
    // Copia los campos editables
    this.editForm.set({
      type: item.type,
      url: item.url ?? '',
      webContent: item.webContent ?? '',
      aiResponse: item.aiResponse ?? '',
      imageUrl: item.imageUrl ?? '',
    });
    this.saveSuccess.set(false);
  }

  closeEdit() {
    this.editItem.set(null);
    this.editForm.set({});
    this.saveSuccess.set(false);
  }

  updateField(field: keyof AiAnalysis, value: string) {
    this.editForm.update(f => ({ ...f, [field]: value }));
  }

  saveEdit() {
    const item = this.editItem();
    if (!item?.id) return;

    this.saving.set(true);
    const payload: AiAnalysis = { ...item, ...this.editForm() };

    this.aiService.update(item.id, payload).subscribe({
      next: (updated) => {
        // Actualiza la lista en memoria
        this.items.update(list =>
          list.map(i => i.id === updated.id ? updated : i)
        );
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.closeEdit(), 1200);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
