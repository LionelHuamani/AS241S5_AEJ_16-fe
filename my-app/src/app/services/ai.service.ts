import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiAnalysis } from '../models/ai-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly baseUrl = 'http://localhost:8081/v1/api/ai';

  constructor(private http: HttpClient) {}

  findAll(): Observable<AiAnalysis[]> {
    return this.http.get<AiAnalysis[]>(this.baseUrl);
  }

  findInactive(): Observable<AiAnalysis[]> {
    return this.http.get<AiAnalysis[]>(`${this.baseUrl}/inactive`);
  }

  findById(id: string): Observable<AiAnalysis> {
    return this.http.get<AiAnalysis>(`${this.baseUrl}/${id}`);
  }

  analyzeUrl(url: string): Observable<AiAnalysis> {
    const params = new HttpParams().set('url', url);
    return this.http.post<AiAnalysis>(`${this.baseUrl}/analyze`, null, { params });
  }

  generateImage(prompt: string): Observable<AiAnalysis> {
    const params = new HttpParams().set('prompt', prompt);
    return this.http.post<AiAnalysis>(`${this.baseUrl}/image`, null, { params });
  }

  update(id: string, data: AiAnalysis): Observable<AiAnalysis> {
    return this.http.put<AiAnalysis>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<AiAnalysis> {
    return this.http.patch<AiAnalysis>(`${this.baseUrl}/delete/${id}`, null);
  }

  restore(id: string): Observable<AiAnalysis> {
    return this.http.patch<AiAnalysis>(`${this.baseUrl}/restore/${id}`, null);
  }
}
