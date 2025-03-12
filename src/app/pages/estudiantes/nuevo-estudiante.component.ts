import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nuevo-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-0 pt-4 pb-2 px-4">
        <h5 class="mb-0 fw-normal">Registrar Nuevo Estudiante</h5>
      </div>
      <div class="card-body p-4">
        <form [formGroup]="estudianteForm" (ngSubmit)="onSubmit()">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="nombres" class="form-label">Nombres</label>
              <input type="text" class="form-control" id="nombres" formControlName="nombres">
            </div>
            <div class="col-md-6">
              <label for="apellidos" class="form-label">Apellidos</label>
              <input type="text" class="form-control" id="apellidos" formControlName="apellidos">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="documento" class="form-label">Documento de Identidad</label>
              <input type="text" class="form-control" id="documento" formControlName="documento">
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input type="email" class="form-control" id="email" formControlName="email">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="telefono" class="form-label">Teléfono</label>
              <input type="tel" class="form-control" id="telefono" formControlName="telefono">
            </div>
            <div class="col-md-6">
              <label for="direccion" class="form-label">Dirección</label>
              <input type="text" class="form-control" id="direccion" formControlName="direccion">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
              <input type="date" class="form-control" id="fechaNacimiento" formControlName="fechaNacimiento">
            </div>
            <div class="col-md-6">
              <label for="curso" class="form-label">Curso</label>
              <select class="form-select" id="curso" formControlName="curso">
                <option value="">Seleccione un curso</option>
                <option value="1">Primero</option>
                <option value="2">Segundo</option>
                <option value="3">Tercero</option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button type="button" class="btn btn-outline-secondary me-2">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Estudiante</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class NuevoEstudianteComponent {
  estudianteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.estudianteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      documento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      curso: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.estudianteForm.valid) {
      console.log('Formulario enviado:', this.estudianteForm.value);
      // Aquí iría la lógica para guardar el estudiante
    } else {
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.estudianteForm.controls).forEach(field => {
        const control = this.estudianteForm.get(field);
        control?.markAsTouched();
      });
    }
  }
}
