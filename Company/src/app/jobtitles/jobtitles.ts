import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { JobTitle } from '../models/jobTitles.model';
import { JobtitleService } from '../services/jobtitle-service';

@Component({
  selector: 'app-jobtitles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobtitles.html',
  styleUrl: './jobtitles.css'
})
export class JobtitlesComponent implements OnInit {
  titulos: JobTitle[] = [];
  cargando = false;

  constructor(
    private jobTitleService: JobtitleService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.jobTitleService.hasData()) {
      if (this.jobTitleService.getNeedsReload()) {
        this.listar();
        this.jobTitleService.setNeedsReload(false);
      } else {
        this.titulos = this.jobTitleService.getJobTitles();
      }
    }
  }

  listar(): void {
    this.cargando = true;
    this.jobTitleService.listar().subscribe({
      next: (data: JobTitle[]) => {
        this.titulos = data;
        this.jobTitleService.setJobTitles(data);
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
        console.error('Error al listar títulos de trabajo', err);
        toast.error('Error al obtener los registros');
        this.cdr.detectChanges();
      }
    });
  }

  ocultar(): void {
    this.titulos = [];
    this.jobTitleService.clearData();
  }

  abrirCrear(): void {
    this.router.navigate(['/jobtitles/crear']);
  }

  abrirEditar(titulo: JobTitle): void {
    this.router.navigate(['/jobtitles/editar', titulo.jobTitleId]);
  }

  eliminar(id: number): void {
    this.router.navigate(['/jobtitles/eliminar', id]);
  }
}