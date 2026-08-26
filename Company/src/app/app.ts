import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { EmployeesComponent } from "./employees/employees";
import { DepartmentsComponent } from "./departments/departments";
import { JobtitlesComponent } from "./jobtitles/jobtitles";
import { MembersComponent } from "./members/members";
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxSonnerToaster,
    NavbarComponent,
    EmployeesComponent,
    DepartmentsComponent,
    JobtitlesComponent,
    MembersComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent { }