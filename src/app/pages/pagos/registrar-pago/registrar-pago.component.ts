import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService, Student, StudentResponse } from '../../../services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './registrar-pago.component.html',
  styles: []
})
export class RegistrarPagoComponent {
  searchForm: FormGroup;
  pagoForm: FormGroup;
  selectedStudent: Student | null = null;
  selectedPayments: any[] = [];
  allPaymentsSelected: boolean = false;
  isLoading: boolean = false;
  isProcessing: boolean = false;
  searchError: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      documento: ['', Validators.required]
    });

    this.pagoForm = this.fb.group({
      concepto: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]],
      metodo: ['', Validators.required],
      fechaPago: [new Date().toISOString().split('T')[0], Validators.required],
      referencia: [''],
      observaciones: [''],
      enviarComprobante: [true]
    });
  }

  searchStudent() {
    if (this.searchForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.searchError = '';
    const documento = this.searchForm.get('documento')?.value;

    console.log('Buscando estudiante con documento:', documento);

    this.studentService.getStudentByDocument(documento).subscribe({
      next: (response: StudentResponse) => {
        this.isLoading = false;
        console.log('Respuesta de búsqueda:', response);

        if (response.ok && response.student) {
          this.selectedStudent = response.student;

          // Asegurarnos de que el estudiante tenga paymentsPending
          if (!this.selectedStudent.paymentsPending) {
            this.selectedStudent.paymentsPending = [];
          }

          // Asegurarnos de que cada pago tenga los campos necesarios
          this.selectedStudent.paymentsPending = this.selectedStudent.paymentsPending.map(payment => {
            return {
              ...payment,
              _id: payment._id || `temp_${Math.random().toString(36).substring(2, 9)}`,
              description: payment.description || 'Pago pendiente',
              amount: payment.amount || 0,
              dueDate: payment.dueDate ? new Date(payment.dueDate) : new Date()
            };
          });

          console.log('Estudiante seleccionado con pagos procesados:', this.selectedStudent);
        } else {
          this.searchError = response.message || 'No se encontró ningún estudiante con ese documento';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.searchError = `Error al buscar estudiante: ${err.message}`;
        console.error('Error al buscar estudiante:', err);
      }
    });
  }

  clearSelectedStudent() {
    this.selectedStudent = null;
    this.selectedPayments = [];
    this.allPaymentsSelected = false;
    this.searchForm.reset();
    this.pagoForm.reset({
      fechaPago: new Date().toISOString().split('T')[0],
      enviarComprobante: true
    });
    this.searchError = '';
  }

  toggleAllPayments() {
    this.allPaymentsSelected = !this.allPaymentsSelected;

    if (this.allPaymentsSelected && this.selectedStudent?.paymentsPending) {
      this.selectedPayments = [...this.selectedStudent.paymentsPending];
      // Actualizar monto total
      const total = this.calculateTotal();
      this.pagoForm.patchValue({ monto: total });
    } else {
      this.selectedPayments = [];
      this.pagoForm.patchValue({ monto: '' });
    }
  }

  togglePayment(payment: any) {
    const index = this.selectedPayments.findIndex(p => p._id === payment._id);

    if (index === -1) {
      this.selectedPayments.push(payment);
    } else {
      this.selectedPayments.splice(index, 1);
    }

    this.allPaymentsSelected = !!this.selectedStudent?.paymentsPending &&
                              this.selectedPayments.length === this.selectedStudent.paymentsPending.length;

    // Actualizar monto total
    const total = this.calculateTotal();
    this.pagoForm.patchValue({ monto: total });
  }

  isPaymentSelected(payment: any): boolean {
    return this.selectedPayments.some(p => p._id === payment._id);
  }

  calculateTotal(): number {
    return this.selectedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Activo',
      'pending': 'Pendiente',
      'suspended': 'Suspendido'
    };
    return statusMap[status] || 'Desconocido';
  }

  isFieldInvalid(field: string): boolean {
    const control = field === 'documento'
      ? this.searchForm.get(field)
      : this.pagoForm.get(field);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.pagoForm.invalid || !this.selectedStudent) {
      this.markFormGroupTouched(this.pagoForm);
      return;
    }

    this.isProcessing = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formValues = this.pagoForm.value;

    // Crear objeto de pago para el backend
    const payment = {
      concept: formValues.concepto,
      amount: parseFloat(formValues.monto),
      method: formValues.metodo,
      paymentDate: formValues.fechaPago,
      reference: formValues.referencia,
      observations: formValues.observaciones,
      sendEmail: formValues.enviarComprobante,
      paymentsProcessed: this.selectedPayments.map(p => p._id) // IDs de los pagos seleccionados
    };

    if (!this.selectedStudent._id) {
      this.errorMessage = 'ID de estudiante no disponible. No se puede registrar el pago.';
      this.isProcessing = false;
      return;
    }

    this.studentService.registerPayment(this.selectedStudent._id, payment).subscribe({
      next: (response: StudentResponse) => {
        this.isProcessing = false;

        if (response.ok) {
          this.successMessage = 'Pago registrado exitosamente';

          // Si se envió correo, mostrar mensaje adicional
          if (formValues.enviarComprobante) {
            this.successMessage += ' y se ha enviado un comprobante por correo electrónico';
          }

          // Limpiar formulario y selecciones
          setTimeout(() => {
            this.clearSelectedStudent();
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Error al registrar el pago';
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = `Error al registrar el pago: ${err.message}`;
        console.error('Error al registrar pago:', err);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched();
    });
  }
}
