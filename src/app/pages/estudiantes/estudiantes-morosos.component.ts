import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EstudianteMoroso {
  id: number;
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
export class EstudiantesMorososComponent {
  searchTerm: string = '';

  estudiantesMorosos: EstudianteMoroso[] = [
    {
      id: 1,
      nombres: 'Carlos',
      apellidos: 'Rodríguez',
      documento: '34567890',
      curso: 'Tercero',
      email: 'carlos@example.com',
      telefono: '345-678-9012',
      deudaTotal: 450.00,
      diasAtraso: 45,
      ultimoPago: '15/01/2024',
      conceptos: ['Mensualidad', 'Laboratorio']
    },
    {
      id: 2,
      nombres: 'Ana',
      apellidos: 'Gómez',
      documento: '45678901',
      curso: 'Primero',
      email: 'ana@example.com',
      telefono: '456-789-0123',
      deudaTotal: 250.00,
      diasAtraso: 20,
      ultimoPago: '05/02/2024',
      conceptos: ['Mensualidad']
    },
    {
      id: 3,
      nombres: 'Miguel',
      apellidos: 'López',
      documento: '56789012',
      curso: 'Segundo',
      email: 'miguel@example.com',
      telefono: '567-890-1234',
      deudaTotal: 600.00,
      diasAtraso: 60,
      ultimoPago: '10/01/2024',
      conceptos: ['Mensualidad', 'Material Didáctico', 'Actividades Extracurriculares']
    },
    {
      id: 4,
      nombres: 'Elena',
      apellidos: 'Díaz',
      documento: '67890123',
      curso: 'Tercero',
      email: 'elena@example.com',
      telefono: '678-901-2345',
      deudaTotal: 300.00,
      diasAtraso: 25,
      ultimoPago: '28/01/2024',
      conceptos: ['Mensualidad', 'Uniformes']
    }
  ];

  get deudaTotal(): number {
    return this.estudiantesMorosos.reduce((total, est) => total + est.deudaTotal, 0);
  }

  get filteredEstudiantes(): EstudianteMoroso[] {
    return this.estudiantesMorosos.filter(estudiante =>
      estudiante.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.documento.includes(this.searchTerm)
    );
  }
}
