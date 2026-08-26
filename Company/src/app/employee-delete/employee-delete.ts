import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee';
import { Employee } from '../models/employees.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-employee-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-delete.html',
  styleUrl: './employee-delete.css'
})
export class EmployeeDeleteComponent implements OnInit {

  empleado: Employee | null = null;
  cargando = false;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.buscarPorId(Number(id)).subscribe({
        next: (data) => {
          this.empleado = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar empleado', err);
          this.error = 'No se pudo cargar la información del empleado.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(): void {
    if (!this.empleado) return;
    this.cargando = true;
    this.employeeService.eliminar(this.empleado.employeeId).subscribe({
      next: (response: any) => {
        this.cargando = false;
        if (response && response.success === false) {
          toast.error(response.mensaje || 'Error al eliminar el empleado');
          this.error = response.mensaje || 'Error al eliminar el empleado';
          this.cdr.detectChanges();
          return;
        }
        
        toast.success(response && response.mensaje ? response.mensaje : 'Empleado eliminado exitosamente');
        this.employeeService.setNeedsReload(true);
        this.cdr.detectChanges();
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al eliminar', err);
        const serverMessage = err?.error?.mensaje || err?.error?.message || 'Ocurrió un error al eliminar el empleado.';
        this.error = serverMessage;
        toast.error(serverMessage);
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/employees']);
  }
}
