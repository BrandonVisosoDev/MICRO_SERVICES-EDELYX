import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee';
import { Employee } from '../models/employees.model';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

import { DepartmentsComponent } from '../departments/departments';
import { JobtitlesComponent } from '../jobtitles/jobtitles';
import { MembersComponent } from '../members/members';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, DepartmentsComponent, JobtitlesComponent, MembersComponent],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class EmployeesComponent implements OnInit {

  empleados: Employee[] = [];
  cargando = false;


  constructor(private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.employeeService.hasData()) {
      if (this.employeeService.getNeedsReload()) {
        this.listar();
        this.employeeService.setNeedsReload(false);
      } else {
        this.empleados = this.employeeService.getEmpleados();
      }
    }
  }

  listar(): void {
    this.cargando = true;
    this.employeeService.listar().subscribe({
      next: (data) => {
        this.empleados = data;
        this.employeeService.setEmpleados(data);
        this.cargando = false;
        if (data.length > 0) {
          toast.success('Registros cargados exitosamente');
        } else {
          toast.info('No hay registros en la base de datos');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al listar empleados', err);
        toast.error('Error al obtener los registros de la base de datos');
        this.cdr.detectChanges();
      }
    });
  }


  ocultar(): void {
    this.empleados = [];
    this.employeeService.clearData();
  }

abrirCrear(): void {
  this.router.navigate(['/employees/crear']);
}

abrirEditar(empleado: Employee): void {
  this.router.navigate(['/employees/editar', empleado.employeeId]);
}

eliminar(id: number): void {
  this.router.navigate(['/employees/eliminar', id]);
}
}