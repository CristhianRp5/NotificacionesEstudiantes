import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-transparent border-0 pt-4 pb-2 px-4">
        <h5 class="mb-0 fw-normal">Registrar Nuevo Pago</h5>
      </div>
      <div class="card-body p-4">
        <div class="alert alert-info mb-4">
          <div class="d-flex">
            <div class="me-3">
              <i class="bi bi-info-circle-fill fs-4"></i>
            </div>
            <div>
              <h5 class="alert-heading mb-1">Información del Pago</h5>
              <p class="mb-0">Complete todos los datos requeridos para registrar el pago. Asegúrese de verificar la información antes de guardar.</p>
            </div>
          </div>
        </div>

        <form [formGroup]="pagoForm" (ngSubmit)="onSubmit()">
          <div class="row mb-4">
            <div class="col-md-12">
              <h6 class="fw-normal mb-3 text-muted">Información del Estudiante</h6>
            </div>
            <div class="col-md-5">
              <label for="estudiante" class="form-label">Buscar Estudiante</label>
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Nombre o documento" formControlName="estudiante">
                <button class="btn btn-outline-secondary" type="button">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
            <div class="col-md-7">
              <label class="form-label">Estudiante Seleccionado</label>
              <div class="p-3 border rounded bg-light">
                <div class="d-flex align-items-center">
                  <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style="width: 48px; height: 48px;">
                    <i class="bi bi-person text-primary"></i>
                  </div>
                  <div>
                    <h6 class="mb-0">María González</h6>
                    <p class="text-muted mb-0 small">Documento: 12345678 | Curso: Primero</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-12">
              <h6 class="fw-normal mb-3 text-muted">Detalles del Pago</h6>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="concepto" class="form-label">Concepto</label>
                <select class="form-select" formControlName="concepto">
                  <option value="">Seleccione un concepto</option>
                  <option value="matricula">Matrícula</option>
                  <option value="mensualidad">Mensualidad</option>
                  <option value="laboratorio">Laboratorio</option>
                  <option value="materiales">Materiales</option>
                  <option value="transporte">Transporte</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="monto" class="form-label">Monto</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input type="number" class="form-control" formControlName="monto">
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label for="metodo" class="form-label">Método de Pago</label>
                <select class="form-select" formControlName="metodo">
                  <option value="">Seleccione un método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="cheque">Cheque</option>
                  <option value="app">Aplicación Móvil</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="fechaPago" class="form-label">Fecha de Pago</label>
                <input type="date" class="form-control" formControlName="fechaPago">
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="referencia" class="form-label">Referencia o Número de Comprobante</label>
            <input type="text" class="form-control" formControlName="referencia">
          </div>

          <div class="mb-3">
            <label for="observaciones" class="form-label">Observaciones</label>
            <textarea class="form-control" rows="3" formControlName="observaciones"></textarea>
          </div>

          <div class="form-check mb-4">
            <input class="form-check-input" type="checkbox" id="enviarComprobante" formControlName="enviarComprobante">
            <label class="form-check-label" for="enviarComprobante">
              Enviar comprobante por correo electrónico
            </label>
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-secondary me-2">Cancelar</button>
            <button type="submit" class="btn btn-success px-4">
              <i class="bi bi-check-circle me-2"></i>Registrar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class RegistrarPagoComponent {
  pagoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pagoForm = this.fb.group({
      estudiante: ['', Validators.required],
      concepto: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]],
      metodo: ['', Validators.required],
      fechaPago: [new Date().toISOString().split('T')[0], Validators.required],
      referencia: [''],
      observaciones: [''],
      enviarComprobante: [true]
    });
  }

  onSubmit() {
    if (this.pagoForm.valid) {
      console.log('Formulario enviado:', this.pagoForm.value);
      // Aquí iría la lógica para procesar el pago
    } else {
      Object.keys(this.pagoForm.controls).forEach(field => {
        const control = this.pagoForm.get(field);
        control?.markAsTouched();
      });
    }
  }
}
