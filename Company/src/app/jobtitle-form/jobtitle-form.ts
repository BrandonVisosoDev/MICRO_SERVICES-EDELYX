import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { JobTitle } from '../models/jobTitles.model';
import { JobtitleService } from '../services/jobtitle-service';

@Component({
  selector: 'app-jobtitle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jobtitle-form.html',
  styleUrl: './jobtitle-form.css'
})
export class JobtitleFormComponent implements OnInit {
  modoEdicion = false;
  cargando = false;
  errores: any = {};

  jobTitleForm: JobTitle = this.jobTitleVacio();

  constructor(
    private jobTitleService: JobtitleService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.jobTitleService.buscarPorId(Number(id)).subscribe({
        next: (data: JobTitle) => {
          this.jobTitleForm = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar título de trabajo', err);
          this.cdr.detectChanges();
        }
      });
    }
  }

  jobTitleVacio(): JobTitle {
    return {
      jobTitleId: 0,
      jobTitle: ''
    };
  }

  validar(): boolean {
    this.errores = {};
    if (this.jobTitleForm.jobTitleId == null || this.jobTitleForm.jobTitleId <= 0) {
      this.errores['jobTitleId'] = 'El ID del título es obligatorio y debe ser mayor que 0';
    }
    if (!this.jobTitleForm.jobTitle || !this.jobTitleForm.jobTitle.trim()) {
      this.errores['jobTitle'] = 'El título del trabajo es obligatorio';
    }
    return Object.keys(this.errores).length === 0;
  }

  guardar(): void {
    if (!this.validar()) return;
    this.cargando = true;

    const operacion = this.modoEdicion
      ? this.jobTitleService.actualizar(this.jobTitleForm)
      : this.jobTitleService.crear(this.jobTitleForm);

    operacion.subscribe({
      next: (response: any) => {
        this.cargando = false;
        if (response && response.success === false) {
          toast.error(response.mensaje || 'Error en la operación');
          this.cdr.detectChanges();
          return;
        }

        toast.success(response?.mensaje ?? (this.modoEdicion
          ? 'Título de trabajo actualizado exitosamente'
          : 'Título de trabajo creado exitosamente'));
        this.jobTitleService.setNeedsReload(true);
        this.cdr.detectChanges();
        this.router.navigate(['/jobtitles']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al guardar', err);
        toast.error('Ocurrió un error al guardar el título de trabajo.');
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/jobtitles']);
  }
}
