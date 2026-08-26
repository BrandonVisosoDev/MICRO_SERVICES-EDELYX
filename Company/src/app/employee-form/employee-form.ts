import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../models/employees.model';
import { EmployeeService } from '../services/employee';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeFormComponent implements OnInit {

  modoEdicion = false;
  cargando = false;
  errores: any = {};

  empleadoForm: Employee = this.empleadoVacio();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.employeeService.buscarPorId(Number(id)).subscribe({
        next: (data) => {
          this.empleadoForm = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar empleado', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  empleadoVacio(): Employee {
    return {
      employeeId: 0,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      salary: 0,
      hireDate: new Date().toISOString().split('T')[0],
      departmentId: 0,
      jobTitleId: 0
    };
  }

  validar(): boolean {
    this.errores = {};
    if (!this.empleadoForm.firstName) this.errores['firstName'] = 'El nombre es obligatorio';
    if (!this.empleadoForm.lastName) this.errores['lastName'] = 'El apellido es obligatorio';
    if (!this.empleadoForm.email) this.errores['email'] = 'El email es obligatorio';
    if (!this.empleadoForm.phoneNumber) this.errores['phoneNumber'] = 'El teléfono es obligatorio';
    if (this.empleadoForm.salary == null || this.empleadoForm.salary <= 0) this.errores['salary'] = 'El salario debe ser mayor que 0';
    if (!this.empleadoForm.hireDate) this.errores['hireDate'] = 'La fecha es obligatoria';
    if (this.empleadoForm.departmentId == null || this.empleadoForm.departmentId <= 0) this.errores['departmentId'] = 'El departamento es obligatorio';
    if (this.empleadoForm.jobTitleId == null || this.empleadoForm.jobTitleId <= 0) this.errores['jobTitleId'] = 'El job title es obligatorio';
    return Object.keys(this.errores).length === 0;
  }

  guardar(): void {
    if (!this.validar()) return;
    this.cargando = true;

    const operacion = this.modoEdicion
      ? this.employeeService.actualizar(this.empleadoForm)
      : this.employeeService.crear(this.empleadoForm);

    operacion.subscribe({
      next: (response: any) => {
        this.cargando = false;
        if (response && response.success === false) {
          toast.error(response.mensaje || 'Error en la operación');
          this.cdr.detectChanges();
          return;
        }
        
        toast.success(response && response.mensaje ? response.mensaje : (this.modoEdicion ? 'Empleado actualizado exitosamente' : 'Empleado creado exitosamente'));
        this.employeeService.setNeedsReload(true);
        this.cdr.detectChanges();
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al guardar', err);
        toast.error('Ocurrió un error al guardar el empleado. Verifica los datos.');
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/employees']);
  }
}