import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string;
  curso: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo' | 'Moroso';
}

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-0 pt-4 pb-2 px-4">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-normal">Lista de Estudiantes</h5>
          <div class="d-flex">
            <div class="input-group me-2" style="width: 250px;">
              <input
                type="text"
                class="form-control form-control-sm border-end-0"
                placeholder="Buscar estudiante..."
                [(ngModel)]="searchTerm"
              >
              <span class="input-group-text bg-white border-start-0">
                <i class="bi bi-search text-muted" style="font-size: 0.8rem;"></i>
              </span>
            </div>
            <button class="btn btn-sm btn-primary rounded-pill px-3">
              <i class="bi bi-person-plus-fill me-1"></i> Nuevo Estudiante
            </button>
          </div>
        </div>
      </div>
      <div class="card-body p-4">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th class="fw-medium" style="font-size: 0.85rem;">ID</th>
                <th class="fw-medium" style="font-size: 0.85rem;">NOMBRE COMPLETO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">DOCUMENTO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">CURSO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">EMAIL</th>
                <th class="fw-medium" style="font-size: 0.85rem;">TELÉFONO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">ESTADO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let estudiante of filteredEstudiantes">
                <td>{{ estudiante.id }}</td>
                <td>{{ estudiante.nombres }} {{ estudiante.apellidos }}</td>
                <td>{{ estudiante.documento }}</td>
                <td>{{ estudiante.curso }}</td>
                <td>{{ estudiante.email }}</td>
                <td>{{ estudiante.telefono }}</td>
                <td>
                  <span
                    class="badge rounded-pill px-3"
                    [ngClass]="{
                      'text-bg-success bg-opacity-10 text-success': estudiante.estado === 'Activo',
                      'text-bg-warning bg-opacity-10 text-warning': estudiante.estado === 'Moroso',
                      'text-bg-secondary bg-opacity-10 text-secondary': estudiante.estado === 'Inactivo'
                    }"
                  >
                    {{ estudiante.estado }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-link text-primary"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-link text-danger"><i class="bi bi-trash"></i></button>
                  <div class="dropdown d-inline">
                    <button class="btn btn-sm btn-link text-muted dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                      <li><a class="dropdown-item py-2" href="#"><i class="bi bi-cash-coin me-2 text-success"></i>Registrar pago</a></li>
                      <li><a class="dropdown-item py-2" href="#"><i class="bi bi-printer me-2 text-primary"></i>Imprimir ficha</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item py-2 text-danger" href="#"><i class="bi bi-exclamation-triangle me-2"></i>Marcar como moroso</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4">
          <div class="text-muted small">Mostrando {{ filteredEstudiantes.length }} de {{ estudiantes.length }} estudiantes</div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">Siguiente</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ListaEstudiantesComponent {
  searchTerm: string = '';

  estudiantes: Estudiante[] = [
    { id: 1, nombres: 'María', apellidos: 'González', documento: '12345678', curso: 'Primero', email: 'maria@example.com', telefono: '123-456-7890', estado: 'Activo' },
    { id: 2, nombres: 'Juan', apellidos: 'Pérez', documento: '23456789', curso: 'Segundo', email: 'juan@example.com', telefono: '234-567-8901', estado: 'Activo' },
    { id: 3, nombres: 'Carlos', apellidos: 'Rodríguez', documento: '34567890', curso: 'Tercero', email: 'carlos@example.com', telefono: '345-678-9012', estado: 'Moroso' },
    { id: 4, nombres: 'Laura', apellidos: 'Martínez', documento: '45678901', curso: 'Primero', email: 'laura@example.com', telefono: '456-789-0123', estado: 'Activo' },
    { id: 5, nombres: 'Pedro', apellidos: 'Sánchez', documento: '56789012', curso: 'Segundo', email: 'pedro@example.com', telefono: '567-890-1234', estado: 'Inactivo' }
  ];

  get filteredEstudiantes(): Estudiante[] {
    return this.estudiantes.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.documento.includes(this.searchTerm)
    );
  }
}
