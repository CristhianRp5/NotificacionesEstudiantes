import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService, Student, StudentResponse } from '../../services/student.service';

interface Estudiante {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  curso: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo' | 'Moroso';
  pagosPendientes: number;
}

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
            <button class="btn btn-sm btn-primary rounded-pill px-3" [routerLink]="['/estudiantes/nuevo']">
              <i class="bi bi-person-plus-fill me-1"></i> Nuevo Estudiante
            </button>
          </div>
        </div>
      </div>
      <div class="card-body p-4">
        <!-- Mostrar spinner mientras carga -->
        <div *ngIf="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando estudiantes...</p>
        </div>

        <!-- Mostrar mensaje si hay error -->
        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Mostrar tabla si hay datos -->
        <div *ngIf="!loading && !error" class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th class="fw-medium" style="font-size: 0.85rem;">ID</th>
                <th class="fw-medium" style="font-size: 0.85rem;">NOMBRE COMPLETO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">EMAIL</th>
                <th class="fw-medium" style="font-size: 0.85rem;">TELÉFONO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">PAGOS PENDIENTES</th>
                <th class="fw-medium" style="font-size: 0.85rem;">ESTADO</th>
                <th class="fw-medium" style="font-size: 0.85rem;">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let estudiante of filteredEstudiantes">
                <td>{{ estudiante.id }}</td>
                <td>{{ estudiante.nombres }} {{ estudiante.apellidos }}</td>
                <td>{{ estudiante.email }}</td>
                <td>{{ estudiante.telefono || 'No disponible' }}</td>
                <td>
                  <span class="badge rounded-pill px-3 text-bg-danger bg-opacity-10 text-danger" *ngIf="estudiante.pagosPendientes > 0">
                    {{ estudiante.pagosPendientes }} pendiente(s)
                  </span>
                  <span class="badge rounded-pill px-3 text-bg-success bg-opacity-10 text-success" *ngIf="estudiante.pagosPendientes === 0">
                    Al día
                  </span>
                </td>
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

              <!-- Mostrar mensaje si no hay estudiantes -->
              <tr *ngIf="estudiantes.length === 0">
                <td colspan="7" class="text-center py-4">
                  <p class="text-muted mb-0">No se encontraron estudiantes registrados</p>
                  <button class="btn btn-sm btn-primary mt-2" [routerLink]="['/estudiantes/nuevo']">
                    <i class="bi bi-person-plus-fill me-1"></i> Registrar nuevo estudiante
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!loading && !error && estudiantes.length > 0" class="d-flex justify-content-between align-items-center mt-4">
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
export class ListaEstudiantesComponent implements OnInit {
  searchTerm: string = '';
  estudiantes: Estudiante[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;

    this.studentService.getStudents().subscribe({
      next: (response: StudentResponse) => {
        console.log('Respuesta de getStudents en lista-estudiantes:', response);

        if (response && response.ok && response.students && response.students.length > 0) {
          // Transformar los estudiantes del backend al formato del componente
          this.estudiantes = this.mapStudentsFromBackend(response.students);
          console.log('Estudiantes mapeados:', this.estudiantes);
        } else {
          console.warn('No se encontraron estudiantes o la respuesta no es válida');
          this.estudiantes = [];

          if (!response.ok) {
            this.error = response.message || 'Error al cargar los estudiantes';
          }
        }

        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error cargando estudiantes:', err);
        this.error = 'Error al cargar los estudiantes: ' + err.message;
        this.loading = false;
      }
    });
  }

  mapStudentsFromBackend(backendStudents: Student[]): Estudiante[] {
    console.log('Mapeando estudiantes del backend:', backendStudents);

    return backendStudents.map(student => {
      // Dividir el nombre en nombre y apellido (asumiendo formato "Nombre Apellido")
      const fullNameParts = student.name.split(' ');
      const firstName = fullNameParts[0] || '';
      const lastName = fullNameParts.slice(1).join(' ') || '';

      // Determinar el estado del estudiante
      let estado: 'Activo' | 'Inactivo' | 'Moroso';
      switch (student.status) {
        case 'active':
          estado = 'Activo';
          break;
        case 'pending':
          estado = 'Moroso';
          break;
        case 'suspended':
          estado = 'Inactivo';
          break;
        default:
          estado = 'Activo';
      }

      // Crear objeto estudiante
      return {
        id: student._id || '0',
        nombres: firstName,
        apellidos: lastName,
        documento: student._id?.substring(0, 8) || '00000000', // Usamos parte del ID como documento
        curso: 'No especificado',
        email: student.email,
        telefono: student.phone || 'No disponible',
        estado: estado,
        pagosPendientes: student.paymentsPending?.length || 0
      };
    });
  }

  get filteredEstudiantes(): Estudiante[] {
    return this.estudiantes.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (estudiante.documento && estudiante.documento.includes(this.searchTerm))
    );
  }
}
