import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService, Student, StudentResponse } from '../../services/student.service';

interface Pago {
  id: string;
  estudiante: string;
  concepto: string;
  fecha: string;
  monto: number;
  estado: 'Completado' | 'Pendiente';
}

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payments-table.component.html',
  styleUrl: './payments-table.component.css'
})
export class PaymentsTableComponent implements OnInit {
  pagos: Pago[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading = true;

    // Obtener estudiantes y generar pagos basados en los datos reales
    this.studentService.getStudents().subscribe({
      next: (response: StudentResponse) => {
        console.log('Respuesta del servicio (pagos):', response);
        if (response && response.ok && response.students) {
          const estudiantes: Student[] = response.students;

          // Generar pagos basados en estudiantes reales
          // Usamos una combinación de datos reales y algunos valores generados
          // porque no tenemos un endpoint específico para pagos
          this.pagos = this.generarPagosDesdeEstudiantes(estudiantes);

          console.log('Pagos cargados:', this.pagos);
        } else {
          this.error = 'No se pudieron cargar los pagos';
          console.error('Error al cargar pagos:', response);
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error cargando pagos:', err);
        this.error = 'Error al cargar pagos';
        this.loading = false;
      }
    });
  }

  generarPagosDesdeEstudiantes(estudiantes: Student[]): Pago[] {
    // Tomar solo los primeros 5 estudiantes para la tabla de pagos recientes
    const estudiantesMuestra = estudiantes.slice(0, 5);

    // Conceptos posibles para pagos
    const conceptos = ['Matrícula', 'Mensualidad', 'Laboratorio', 'Material Didáctico'];

    // Fechas recientes (últimos 14 días)
    const fechasRecientes = this.obtenerFechasRecientes(14);

    return estudiantesMuestra.map((estudiante, index) => {
      // Determinar si el pago está pendiente basado en el estado del estudiante
      const estadoPago: 'Completado' | 'Pendiente' =
        estudiante.status === 'active' ? 'Completado' : 'Pendiente';

      // Asignar un concepto aleatorio
      const concepto = conceptos[Math.floor(Math.random() * conceptos.length)];

      // Asignar una fecha reciente aleatoria
      const fecha = fechasRecientes[Math.floor(Math.random() * fechasRecientes.length)];

      // Determinar monto según el concepto
      let monto = 0;
      switch (concepto) {
        case 'Matrícula':
          monto = 350;
          break;
        case 'Mensualidad':
          monto = 150;
          break;
        case 'Laboratorio':
          monto = 75;
          break;
        case 'Material Didáctico':
          monto = 50;
          break;
        default:
          monto = 100;
      }

      return {
        id: `#${1000 + index}`,
        estudiante: estudiante.name,
        concepto,
        fecha,
        monto,
        estado: estadoPago
      };
    });
  }

  obtenerFechasRecientes(dias: number): string[] {
    const fechas: string[] = [];
    const hoy = new Date();

    for (let i = 0; i < dias; i++) {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      fechas.push(fecha.toLocaleDateString('es-ES'));
    }

    return fechas;
  }
}
