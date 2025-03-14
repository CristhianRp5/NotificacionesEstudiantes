import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService, Student, StudentResponse } from '../../services/student.service';

@Component({
  selector: 'app-nuevo-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-0 pt-4 pb-2 px-4">
        <h5 class="mb-0 fw-normal">Registrar Nuevo Estudiante</h5>
      </div>
      <div class="card-body p-4">
        <!-- Alerta de éxito -->
        <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show mb-4" role="alert">
          {{ successMessage }}
          <button type="button" class="btn-close" (click)="successMessage = ''" aria-label="Close"></button>
        </div>

        <!-- Alerta de error -->
        <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          {{ errorMessage }}
          <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Close"></button>
        </div>

        <form [formGroup]="estudianteForm" (ngSubmit)="onSubmit()">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="nombres" class="form-label">Nombres</label>
              <input
                type="text"
                class="form-control"
                id="nombres"
                formControlName="nombres"
                [class.is-invalid]="formSubmitted && f['nombres'].errors"
              >
              <div class="invalid-feedback" *ngIf="f['nombres'].errors?.['required']">
                Este campo es obligatorio
              </div>
            </div>
            <div class="col-md-6">
              <label for="apellidos" class="form-label">Apellidos</label>
              <input
                type="text"
                class="form-control"
                id="apellidos"
                formControlName="apellidos"
                [class.is-invalid]="formSubmitted && f['apellidos'].errors"
              >
              <div class="invalid-feedback" *ngIf="f['apellidos'].errors?.['required']">
                Este campo es obligatorio
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="documento" class="form-label">Documento de Identidad</label>
              <input
                type="text"
                class="form-control"
                id="documento"
                formControlName="documento"
                [class.is-invalid]="formSubmitted && f['documento'].errors"
              >
              <div class="invalid-feedback" *ngIf="f['documento'].errors?.['required']">
                Este campo es obligatorio
              </div>
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input
                type="email"
                class="form-control"
                id="email"
                formControlName="email"
                [class.is-invalid]="formSubmitted && f['email'].errors"
              >
              <div class="invalid-feedback" *ngIf="f['email'].errors?.['required']">
                Este campo es obligatorio
              </div>
              <div class="invalid-feedback" *ngIf="f['email'].errors?.['email']">
                Ingrese un correo electrónico válido
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="telefono" class="form-label">Teléfono</label>
              <input
                type="tel"
                class="form-control"
                id="telefono"
                formControlName="telefono"
                [class.is-invalid]="formSubmitted && f['telefono'].errors"
              >
              <div class="invalid-feedback" *ngIf="f['telefono'].errors?.['required']">
                Este campo es obligatorio
              </div>
            </div>
            <div class="col-md-6">
              <label for="estado" class="form-label">Estado</label>
              <select
                class="form-select"
                id="estado"
                formControlName="estado"
                [class.is-invalid]="formSubmitted && f['estado'].errors"
              >
                <option value="">Seleccione un estado</option>
                <option value="active">Activo</option>
                <option value="pending">Pendiente</option>
                <option value="suspended">Suspendido</option>
              </select>
              <div class="invalid-feedback" *ngIf="f['estado'].errors?.['required']">
                Este campo es obligatorio
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button
              type="button"
              class="btn btn-outline-secondary me-2"
              [routerLink]="['/estudiantes/lista']"
              [disabled]="loading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="loading"
            >
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ loading ? 'Guardando...' : 'Guardar Estudiante' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class NuevoEstudianteComponent {
  estudianteForm: FormGroup;
  loading: boolean = false;
  formSubmitted: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.estudianteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      documento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      estado: ['active', Validators.required]
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.estudianteForm.controls;
  }

  onSubmit() {
    this.formSubmitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.estudianteForm.invalid) {
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.estudianteForm.controls).forEach(field => {
        const control = this.estudianteForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    // Preparar el estudiante para enviar al backend
    const formValues = this.estudianteForm.value;
    const student: Student = {
      name: `${formValues.nombres} ${formValues.apellidos}`,
      email: formValues.email,
      phone: formValues.telefono,
      status: formValues.estado,
      paymentsPending: [] // Inicialmente sin pagos pendientes
    };

    console.log('Enviando estudiante al backend:', student);

    this.studentService.createStudent(student).subscribe({
      next: (response: StudentResponse) => {
        this.loading = false;

        if (response && response.ok) {
          console.log('Estudiante creado exitosamente:', response);
          this.successMessage = '¡Estudiante creado exitosamente!';

          // Resetear el formulario
          this.estudianteForm.reset({
            estado: 'active' // Establecer el valor por defecto
          });
          this.formSubmitted = false;

          // Opcionalmente, redirigir a la lista de estudiantes después de un tiempo
          setTimeout(() => {
            this.router.navigate(['/estudiantes/lista']);
          }, 2000);
        } else {
          console.error('Error al crear estudiante:', response);
          this.errorMessage = response.message || 'No se pudo completar el registro. Por favor, intente nuevamente.';
        }
      },
      error: (err: any) => {
        console.error('Error en la petición:', err);
        this.loading = false;
        this.errorMessage = err.message || 'Error de conexión. Por favor, verifique su conexión e intente nuevamente.';
      }
    });
  }
}
