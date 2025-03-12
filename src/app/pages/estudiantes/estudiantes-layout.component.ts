import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-estudiantes-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-12">
          <h1 class="fw-light mb-4">Gestión de Estudiantes</h1>
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EstudiantesLayoutComponent {
}
