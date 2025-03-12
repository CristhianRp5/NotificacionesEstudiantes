import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12 mb-4">
          <h1 class="fw-light">Reportes y Estadísticas</h1>
          <p class="lead text-muted" style="font-size: 1rem;">Genera informes detallados sobre pagos y estudiantes</p>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0 pt-4 pb-2 px-4">
              <h5 class="mb-0 fw-normal">Generar Reporte</h5>
            </div>
            <div class="card-body p-4">
              <div class="row">
                <div class="col-md-4 mb-3">
                  <label for="tipoReporte" class="form-label">Tipo de Reporte</label>
                  <select class="form-select" id="tipoReporte" [(ngModel)]="tipoReporte">
                    <option value="pagos">Pagos</option>
                    <option value="estudiantes">Estudiantes</option>
                    <option value="morosos">Estudiantes Morosos</option>
                    <option value="financiero">Reporte Financiero</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="fechaInicio" class="form-label">Fecha Inicio</label>
                  <input type="date" class="form-control" id="fechaInicio" [(ngModel)]="fechaInicio">
                </div>
                <div class="col-md-4 mb-3">
                  <label for="fechaFin" class="form-label">Fecha Fin</label>
                  <input type="date" class="form-control" id="fechaFin" [(ngModel)]="fechaFin">
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-4 mb-3">
                  <label for="curso" class="form-label">Curso (Opcional)</label>
                  <select class="form-select" id="curso" [(ngModel)]="curso">
                    <option value="">Todos</option>
                    <option value="1">Primero</option>
                    <option value="2">Segundo</option>
                    <option value="3">Tercero</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="formato" class="form-label">Formato</label>
                  <select class="form-select" id="formato" [(ngModel)]="formato">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="detallado" class="form-label">Nivel de Detalle</label>
                  <select class="form-select" id="detallado" [(ngModel)]="detallado">
                    <option value="resumen">Resumen</option>
                    <option value="detallado">Detallado</option>
                  </select>
                </div>
              </div>

              <div class="mt-4 d-flex justify-content-end">
                <button type="button" class="btn btn-outline-secondary me-2">Cancelar</button>
                <button type="button" class="btn btn-primary" (click)="generarReporte()">
                  <i class="bi bi-file-earmark-text me-2"></i>Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0 pt-4 pb-2 px-4">
              <h5 class="mb-0 fw-normal">Reportes Guardados</h5>
            </div>
            <div class="card-body p-4">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th class="fw-medium" style="font-size: 0.85rem;">NOMBRE</th>
                      <th class="fw-medium" style="font-size: 0.85rem;">TIPO</th>
                      <th class="fw-medium" style="font-size: 0.85rem;">FECHA CREACIÓN</th>
                      <th class="fw-medium" style="font-size: 0.85rem;">FORMATO</th>
                      <th class="fw-medium" style="font-size: 0.85rem;">USUARIO</th>
                      <th class="fw-medium" style="font-size: 0.85rem;">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let reporte of reportesRecientes">
                      <td>{{ reporte.nombre }}</td>
                      <td>{{ reporte.tipo }}</td>
                      <td>{{ reporte.fechaCreacion }}</td>
                      <td>
                        <span class="badge rounded-pill px-3"
                          [ngClass]="{
                            'text-bg-danger bg-opacity-10 text-danger': reporte.formato === 'PDF',
                            'text-bg-success bg-opacity-10 text-success': reporte.formato === 'Excel',
                            'text-bg-primary bg-opacity-10 text-primary': reporte.formato === 'CSV'
                          }">
                          {{ reporte.formato }}
                        </span>
                      </td>
                      <td>{{ reporte.usuario }}</td>
                      <td>
                        <button class="btn btn-sm btn-link text-primary"><i class="bi bi-download"></i></button>
                        <button class="btn btn-sm btn-link text-primary"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-link text-danger"><i class="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ReportesComponent {
  tipoReporte: string = 'pagos';
  fechaInicio: string = '';
  fechaFin: string = '';
  curso: string = '';
  formato: string = 'pdf';
  detallado: string = 'resumen';

  reportesRecientes = [
    { nombre: 'Pagos Marzo 2024', tipo: 'Pagos', fechaCreacion: '01/04/2024', formato: 'PDF', usuario: 'Admin' },
    { nombre: 'Estudiantes Activos', tipo: 'Estudiantes', fechaCreacion: '30/03/2024', formato: 'Excel', usuario: 'Admin' },
    { nombre: 'Morosos Trimestre 1', tipo: 'Morosos', fechaCreacion: '25/03/2024', formato: 'PDF', usuario: 'Admin' },
    { nombre: 'Balance Financiero Q1', tipo: 'Financiero', fechaCreacion: '20/03/2024', formato: 'Excel', usuario: 'Admin' },
    { nombre: 'Pagos Febrero 2024', tipo: 'Pagos', fechaCreacion: '01/03/2024', formato: 'CSV', usuario: 'Admin' }
  ];

  generarReporte() {
    // Lógica para generar el reporte
    console.log('Generando reporte con los siguientes parámetros:');
    console.log({
      tipoReporte: this.tipoReporte,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      curso: this.curso,
      formato: this.formato,
      detallado: this.detallado
    });
  }
}
