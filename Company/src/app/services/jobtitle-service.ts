import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobTitle } from '../models/jobTitles.model';

@Injectable({
  providedIn: 'root'
})
export class JobtitleService {

  private apiUrl = 'http://localhost:8080/jobtitles';

  private jobTitlesCache: JobTitle[] = [];
  private dataLoaded = false;
  private needsReload = false;

  constructor(private http: HttpClient) {}

  setJobTitles(data: JobTitle[]): void {
    this.jobTitlesCache = data;
    this.dataLoaded = true;
  }

  getJobTitles(): JobTitle[] {
    return this.jobTitlesCache;
  }

  hasData(): boolean {
    return this.dataLoaded;
  }

  clearData(): void {
    this.jobTitlesCache = [];
    this.dataLoaded = false;
    this.needsReload = false;
  }

  setNeedsReload(val: boolean): void {
    this.needsReload = val;
  }

  getNeedsReload(): boolean {
    return this.needsReload;
  }

  listar(): Observable<JobTitle[]> {
    return this.http.get<JobTitle[]>(`${this.apiUrl}/listar`).pipe(
      map(data => data ?? [])
    );
  }

  buscarPorId(id: number): Observable<JobTitle> {
    return this.http.get<JobTitle>(`${this.apiUrl}/buscar/${id}`);
  }

  crear(jobTitle: JobTitle): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, jobTitle);
  }

  actualizar(jobTitle: JobTitle): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar`, jobTitle);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
