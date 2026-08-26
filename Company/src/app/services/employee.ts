import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employees.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:8080/employees';

  private empleadosCache: Employee[] = [];
  private dataLoaded = false;
  private needsReload = false;

  constructor(private http: HttpClient) {}

  setEmpleados(data: Employee[]): void {
    this.empleadosCache = data;
    this.dataLoaded = true;
  }

  getEmpleados(): Employee[] {
    return this.empleadosCache;
  }

  hasData(): boolean {
    return this.dataLoaded;
  }

  clearData(): void {
    this.empleadosCache = [];
    this.dataLoaded = false;
    this.needsReload = false;
  }

  setNeedsReload(val: boolean): void {
    this.needsReload = val;
  }

  getNeedsReload(): boolean {
    return this.needsReload;
  }

  listar(): Observable<Employee[]> {
  return this.http.get<Employee[]>(`${this.apiUrl}/listar`).pipe(
    map(data => data ?? [])
  );
}

  buscarPorId(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/buscar/${id}`);
  }

  crear(empleado: Employee): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear`, empleado);
  }

  actualizar(empleado: Employee): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar`, empleado);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}