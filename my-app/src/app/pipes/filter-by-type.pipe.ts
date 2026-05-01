import { Pipe, PipeTransform } from '@angular/core';
import { AiAnalysis } from '../models/ai-analysis.model';

@Pipe({
  name: 'filterByType',
  standalone: true
})
export class FilterByTypePipe implements PipeTransform {
  transform(items: AiAnalysis[], type: string): AiAnalysis[] {
    return items.filter(i => i.type === type);
  }
}
