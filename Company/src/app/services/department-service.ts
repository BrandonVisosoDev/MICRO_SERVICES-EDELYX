import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Department } from '../models/departments.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = 'http://localhost:8080/departments';

  private departmentsCache: Department[] = [];
  private dataLoaded = false;
  private needsReload = false;

  constructor(private http: HttpClient) {}

  setDepartments(data: Department[]): void {
    this.departmentsCache = data;
    this.dataLoaded = true;
  }

  getDepartments(): Department[] {
    return this.departmentsCache;
  }

  hasData(): boolean {
    return this.dataLoaded;
  }

  clearData(): void {
    this.departmentsCache = [];
    this.dataLoaded = false;
    this.needsReload = false;
  }

  setNeedsReload(val: boolean): void {
    this.needsReload = val;
  }

  getNeedsReload(): boolean {
    return this.needsReload;
  }

  listar(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/listar`).pipe(
      map(data => data ?? [])
    );
  }

  buscarPorId(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/buscar/${id}`);
  }

  crear(department: Department): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, department);
  }

  actualizar(department: Department): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar`, department);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
