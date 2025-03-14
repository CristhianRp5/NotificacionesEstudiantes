import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService, Student, StudentResponse } from '../../services/student.service';

interface EstudianteMoroso {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string;
  curso: string;
  email: string;
  telefono: string;
  deudaTotal: number;
  diasAtraso: number;
  ultimoPago: string;
  conceptos: string[];
}

@Component({
  selector: 'app-estudiantes-morosos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-morosos.component.html',
  styles: []
})
export class EstudiantesMorososComponent implements OnInit {
  searchTerm: string = '';
  estudiantesMorosos: EstudianteMoroso[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = null;

    this.studentService.getStudents().subscribe({
      next: (response: StudentResponse) => {
        console.log('Respuesta de getStudents en estudiantes-morosos:', response);

        if (response && response.ok && response.students) {
          // Filtrar y mapear estudiantes con pagos pendientes
          const estudiantesConPagos = response.students.filter(student =>
            student.paymentsPending && student.paymentsPending.length > 0
          );

          if (estudiantesConPagos.length > 0) {
            this.estudiantesMorosos = this.mapMorososFromBackend(estudiantesConPagos);
            console.log('Estudiantes morosos mapeados:', this.estudiantesMorosos);
          } else {
            console.warn('No se encontraron estudiantes con pagos pendientes');
            this.estudiantesMorosos = [];
          }
        } else {
          console.warn('No se encontraron estudiantes o la respuesta no es válida');
          this.estudiantesMorosos = [];

          if (!response.ok) {
            this.error = response.message || 'Error al cargar los estudiantes';
          }
        }

        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error cargando estudiantes morosos:', err);
        this.error = 'Error al cargar los estudiantes: ' + err.message;
        this.loading = false;
      }
    });
  }

  mapMorososFromBackend(backendStudents: Student[]): EstudianteMoroso[] {
    console.log('Mapeando estudiantes morosos del backend:', backendStudents);

    return backendStudents.map(student => {
      // Dividir el nombre en nombre y apellido (asumiendo formato "Nombre Apellido")
      const fullNameParts = student.name.split(' ');
      const firstName = fullNameParts[0] || '';
      const lastName = fullNameParts.slice(1).join(' ') || '';

      // Calcular deuda total sumando los montos de pagos pendientes
      let deudaTotal = 0;
      const conceptos: string[] = [];

      student.paymentsPending.forEach(pago => {
        if (pago.amount) {
          deudaTotal += pago.amount;
        }
        if (pago.description) {
          conceptos.push(pago.description);
        } else if (pago.type) {
          conceptos.push(pago.type === 'payment' ? 'Pago Pendiente' : 'Documento Pendiente');
        }
      });

      // Generar fecha de último pago (dato simulado)
      const hoy = new Date();
      const diasAtraso = Math.floor(Math.random() * 60) + 5; // Entre 5 y 65 días
      const fechaUltimoPago = new Date(hoy);
      fechaUltimoPago.setDate(hoy.getDate() - diasAtraso);

      // Crear objeto estudiante moroso
      return {
        id: student._id || '0',
        nombres: firstName,
        apellidos: lastName,
        documento: student._id?.substring(0, 8) || '00000000', // Usamos parte del ID como documento
        curso: 'No especificado',
        email: student.email,
        telefono: student.phone || 'No disponible',
        deudaTotal: deudaTotal || 150, // Si no hay monto, asignar un valor por defecto
        diasAtraso: diasAtraso,
        ultimoPago: fechaUltimoPago.toLocaleDateString('es-ES'),
        conceptos: conceptos.length > 0 ? conceptos : ['Pendiente de pago']
      };
    });
  }

  get deudaTotal(): number {
    return this.estudiantesMorosos.reduce((total, est) => total + est.deudaTotal, 0);
  }

  get filteredEstudiantes(): EstudianteMoroso[] {
    return this.estudiantesMorosos.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (estudiante.documento && estudiante.documento.includes(this.searchTerm))
    );
  }
}
