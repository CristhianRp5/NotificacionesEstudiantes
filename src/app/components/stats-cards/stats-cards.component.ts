import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService, Student, StudentResponse } from '../../services/student.service';

interface EstadisticasResumen {
  totalEstudiantes: number;
  pagosMes: number;
  pendientes: number;
  morosos: number;
}

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css'
})
export class StatsCardsComponent implements OnInit {
  estadisticas: EstadisticasResumen = {
    totalEstudiantes: 0,
    pagosMes: 0,
    pendientes: 0,
    morosos: 0
  };

  loading: boolean = true;
  error: string | null = null;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;

    // Obtener todos los estudiantes para calcular las estadísticas
    this.studentService.getStudents().subscribe({
      next: (response: StudentResponse) => {
        console.log('Respuesta del servicio:', response);
        if (response && response.ok && response.students) {
          const estudiantes: Student[] = response.students;

          // Total de estudiantes
          this.estadisticas.totalEstudiantes = estudiantes.length;

          // Estudiantes con pagos pendientes
          const estudiantesConPendientes = estudiantes.filter(
            (student: Student) => student.paymentsPending && student.paymentsPending.length > 0
          );
          this.estadisticas.pendientes = estudiantesConPendientes.length;

          // Estudiantes morosos (con estado pending)
          this.estadisticas.morosos = estudiantes.filter(
            (student: Student) => student.status === 'pending'
          ).length;

          // Pagos del mes (valor aproximado basado en $150 por estudiante activo)
          const estudiantesActivos = estudiantes.filter(
            (student: Student) => student.status === 'active'
          ).length;
          this.estadisticas.pagosMes = estudiantesActivos * 150;

          console.log('Estadísticas cargadas:', this.estadisticas);
        } else {
          this.error = 'No se pudieron cargar las estadísticas';
          console.error('Error al cargar estadísticas:', response);
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error cargando estadísticas:', err);
        this.error = 'Error al cargar estadísticas';
        this.loading = false;
      }
    });
  }
}
