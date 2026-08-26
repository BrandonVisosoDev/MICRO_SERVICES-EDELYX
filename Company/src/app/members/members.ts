import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { toast } from 'ngx-sonner';
import { Employee } from '../models/employees.model';
import { Department } from '../models/departments.model';
import { JobTitle } from '../models/jobTitles.model';
import { EmployeeService } from '../services/employee';
import { DepartmentService } from '../services/department-service';
import { JobtitleService } from '../services/jobtitle-service';

export interface MemberView {
  employeeId: number;
  fullName: string;
  initials: string;
  departmentName: string;
  jobTitleName: string;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class MembersComponent implements OnInit {
  miembros: MemberView[] = [];
  cargando = false;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private jobTitleService: JobtitleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMiembros();
  }

  cargarMiembros(): void {
    this.cargando = true;

    forkJoin({
      employees: this.employeeService.listar(),
      departments: this.departmentService.listar(),
      jobTitles: this.jobTitleService.listar()
    }).subscribe({
      next: ({ employees, departments, jobTitles }) => {
        this.miembros = employees.map((employee: Employee) => {
          const department = departments.find((item: Department) => item.departmentId === employee.departmentId) ?? {
            departmentId: employee.departmentId,
            departmentName: 'Departamento no disponible'
          };

          const jobTitle = jobTitles.find((item: JobTitle) => item.jobTitleId === employee.jobTitleId) ?? {
            jobTitleId: employee.jobTitleId,
            jobTitle: 'Job title no disponible'
          };

          const firstName = employee.firstName?.trim() ?? '';
          const lastName = employee.lastName?.trim() ?? '';

          return {
            employeeId: employee.employeeId,
            fullName: `${firstName} ${lastName}`.trim() || 'Empleado sin nombre',
            initials: `${firstName.charAt(0) ?? ''}${lastName.charAt(0) ?? ''}`.toUpperCase() || 'N/A',
            departmentName: department.departmentName || 'Departamento no disponible',
            jobTitleName: jobTitle.jobTitle || 'Job title no disponible'
          };
        });

        this.cargando = false;
        if (this.miembros.length === 0) {
          toast.info('No hay miembros para mostrar');
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al cargar miembros', err);
        toast.error('No se pudieron cargar los miembros.');
        this.cdr.detectChanges();
      }
    });
  }

}