
import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../service/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, DecimalPipe]
})
export class EmployeesComponent {
  constructor(protected employees: EmployeeService) {}
}
