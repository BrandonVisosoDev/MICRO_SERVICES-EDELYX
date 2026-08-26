import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { JobTitle } from '../models/jobTitles.model';
import { JobtitleService } from '../services/jobtitle-service';

@Component({
  selector: 'app-jobtitle-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobtitle-delete.html',
  styleUrl: './jobtitle-delete.css'
})
export class JobtitleDeleteComponent implements OnInit {
  titulo: JobTitle | null = null;
  cargando = false;
  error = '';

  constructor(
    private jobTitleService: JobtitleService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobTitleService.buscarPorId(Number(id)).subscribe({
        next: (data: JobTitle) => {
          this.titulo = data;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al cargar título de trabajo', err);
          this.error = 'No se pudo cargar la información del título.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(): void {
    if (!this.titulo) return;
    this.cargando = true;
    this.jobTitleService.eliminar(this.titulo.jobTitleId).subscribe({
      next: (response: any) => {
        this.cargando = false;
        if (response && response.success === false) {
          toast.error(response.mensaje || 'Error al eliminar el título');
          this.error = response.mensaje || 'Error al eliminar el título';
          this.cdr.detectChanges();
          return;
        }

        toast.success(response?.mensaje ?? 'Título de trabajo eliminado exitosamente');
        this.jobTitleService.setNeedsReload(true);
        this.cdr.detectChanges();
        this.router.navigate(['/jobtitles']);
      },
      error: (err: any) => {
        this.cargando = false;
        console.error('Error al eliminar', err);
        this.error = 'Ocurrió un error al eliminar el título de trabajo.';
        toast.error('Ocurrió un error al comunicarse con el servidor.');
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(['/jobtitles']);
  }
}
