import { Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees';
import { EmployeeFormComponent } from './employee-form/employee-form';
import { EmployeeDeleteComponent } from './employee-delete/employee-delete';
import { DepartmentsComponent } from './departments/departments';
import { DepartmentFormComponent } from './department-form/department-form';
import { DepartmentDeleteComponent } from './department-delete/department-delete';
import { JobtitlesComponent } from './jobtitles/jobtitles';
import { JobtitleFormComponent } from './jobtitle-form/jobtitle-form';
import { JobtitleDeleteComponent } from './jobtitle-delete/jobtitle-delete';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/crear', component: EmployeeFormComponent },
  { path: 'employees/editar/:id', component: EmployeeFormComponent },
  { path: 'employees/eliminar/:id', component: EmployeeDeleteComponent },
  { path: 'departments', component: DepartmentsComponent },
  { path: 'departments/crear', component: DepartmentFormComponent },
  { path: 'departments/editar/:id', component: DepartmentFormComponent },
  { path: 'departments/eliminar/:id', component: DepartmentDeleteComponent },
  { path: 'jobtitles', component: JobtitlesComponent },
  { path: 'jobtitles/crear', component: JobtitleFormComponent },
  { path: 'jobtitles/editar/:id', component: JobtitleFormComponent },
  { path: 'jobtitles/eliminar/:id', component: JobtitleDeleteComponent }
];