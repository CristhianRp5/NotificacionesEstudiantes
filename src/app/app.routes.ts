import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

// Pagos
import { PagosLayoutComponent } from './pages/pagos/pagos-layout/pagos-layout.component';
import { RegistrarPagoComponent } from './pages/pagos/registrar-pago/registrar-pago.component';

// Estudiantes
import { EstudiantesLayoutComponent } from './pages/estudiantes/estudiantes-layout.component';
import { NuevoEstudianteComponent } from './pages/estudiantes/nuevo-estudiante.component';
import { ListaEstudiantesComponent } from './pages/estudiantes/lista-estudiantes.component';
import { EstudiantesMorososComponent } from './pages/estudiantes/estudiantes-morosos.component';

// Reportes
import { ReportesComponent } from './pages/reportes/reportes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Rutas de Pagos
  {
    path: 'pagos',
    component: PagosLayoutComponent,
    children: [
      { path: '', redirectTo: 'registrar', pathMatch: 'full' },
      { path: 'registrar', component: RegistrarPagoComponent },
      // Aquí puedes añadir las demás páginas de pagos cuando las tengas
    ]
  },

  // Rutas de Estudiantes
  {
    path: 'estudiantes',
    component: EstudiantesLayoutComponent,
    children: [
      { path: '', redirectTo: 'lista', pathMatch: 'full' },
      { path: 'nuevo', component: NuevoEstudianteComponent },
      { path: 'lista', component: ListaEstudiantesComponent },
      { path: 'morosos', component: EstudiantesMorososComponent },
    ]
  },

  // Ruta de Reportes
  { path: 'reportes', component: ReportesComponent },

  // Ruta para manejar rutas no encontradas
  { path: '**', redirectTo: 'dashboard' }
];
