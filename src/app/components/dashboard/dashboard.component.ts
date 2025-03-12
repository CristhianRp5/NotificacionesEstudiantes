import { Component } from '@angular/core';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { PaymentsTableComponent } from '../payments-table/payments-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatsCardsComponent, PaymentsTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
