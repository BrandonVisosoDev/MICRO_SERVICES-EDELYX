import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../services/department-service';
import { Department } from '../models/departments.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-department-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-delete.html',
  styleUrl: './department-delete.css'
})
export class DepartmentDeleteComponent implements OnInit {

  departamento: Department | null = null;
  cargando = false;
  error = '';

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.departmentService.buscarPorId(Number(id)).subscribe({
        next: (data: Department) => {
          this.departamento = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar departamento', err);
          this.error = 'No se pudo cargar la información del departamento.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(): void {
    if (!this.departamento) return;
    this.cargando = true;
    this.departmentService.eliminar(this.departamento.departmentId).subscribe({
      next: (response: any) => {
        this.cargando = false;
        if (response && response.success === false) {
          toast.error(response.mensaje || 'Error al eliminar el departamento');
          this.error = response.mensaje || 'Error al eliminar el departamento';
          this.cdr.detectChanges();
          return;
        }
        toast.success(response?.mensaje ?? 'Departamento eliminado exitosamente');
        this.departmentService.setNeedsReload(true);
        this.cdr.detectChanges();
        this.router.navigate(['/departments']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al eliminar', err);
        this.error = 'Ocurrió un error al eliminar el departamento.';
        toast.error('Ocurrió un error al comunicarse con el servidor.');
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/departments']);
  }
}