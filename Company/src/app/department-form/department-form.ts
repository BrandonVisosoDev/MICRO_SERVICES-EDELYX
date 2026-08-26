import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '../models/departments.model';
import { DepartmentService } from '../services/department-service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css'
})
export class DepartmentFormComponent implements OnInit {

  modoEdicion = false;
  cargando = false;
  errores: any = {};

  departmentForm: Department = this.departmentVacio();

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.departmentService.buscarPorId(Number(id)).subscribe({
        next: (data: Department) => {
          this.departmentForm = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar departamento', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  departmentVacio(): Department {
    return {
      departmentId: 0,
      departmentName: ''
    };
  }

  validar(): boolean {
    this.errores = {};
    if (this.departmentForm.departmentId == null || this.departmentForm.departmentId <= 0)
      this.errores['departmentId'] = 'El ID del departamento es obligatorio y debe ser mayor que 0';
    if (!this.departmentForm.departmentName)
      this.errores['departmentName'] = 'El nombre del departamento es obligatorio';
    return Object.keys(this.errores).length === 0;
  }

  guardar(): void {
    if (!this.validar()) return;
    this.cargando = true;

    const operacion = this.modoEdicion
      ? this.departmentService.actualizar(this.departmentForm)
      : this.departmentService.crear(this.departmentForm);

    operacion.subscribe({
      next: (response: any) => {
        this.cargando = false;
        if (response && response.success === false) {
          toast.error(response.mensaje || 'Error en la operación');
          this.cdr.detectChanges();
          return;
        }
        toast.success(response?.mensaje ?? (this.modoEdicion
          ? 'Departamento actualizado exitosamente'
          : 'Departamento creado exitosamente'));
        this.departmentService.setNeedsReload(true);
        this.cdr.detectChanges();
        this.router.navigate(['/departments']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al guardar', err);
        toast.error('Ocurrió un error al guardar el departamento.');
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/departments']);
  }
}