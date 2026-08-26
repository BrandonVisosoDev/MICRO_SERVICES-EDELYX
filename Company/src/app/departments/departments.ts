import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../services/department-service';
import { Department } from '../models/departments.model';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css'
})
export class DepartmentsComponent implements OnInit {

  departamentos: Department[] = [];
  cargando = false;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.departmentService.hasData()) {
      if (this.departmentService.getNeedsReload()) {
        this.listar();
        this.departmentService.setNeedsReload(false);
      } else {
        this.departamentos = this.departmentService.getDepartments();
      }
    }
  }

  listar(): void {
    this.cargando = true;
    this.departmentService.listar().subscribe({
      next: (data: Department[]) => {
        this.departamentos = data;
        this.departmentService.setDepartments(data);
        this.cargando = false;
        if (data.length > 0) {
          toast.success('Registros cargados exitosamente');
        } else {
          toast.info('No hay registros en la base de datos');
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al listar departamentos', err);
        toast.error('Error al obtener los registros');
        this.cdr.detectChanges();
      }
    });
  }

  ocultar(): void {
    this.departamentos = [];
    this.departmentService.clearData();
  }

  abrirCrear(): void {
    this.router.navigate(['/departments/crear']);
  }

  abrirEditar(department: Department): void {
    this.router.navigate(['/departments/editar', department.departmentId]);
  }

  eliminar(id: number): void {
    this.router.navigate(['/departments/eliminar', id]);
  }
}