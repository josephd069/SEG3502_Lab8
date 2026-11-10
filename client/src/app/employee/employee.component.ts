
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { Employee } from '../model/employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class EmployeeComponent {
  envoiEnCours = false;
  messageErreur = '';

  employeeForm = this.builder.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    city: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(0)]],
    gender: ['', Validators.pattern('^[MFX]$')],
    email: ['', Validators.email]
  });

  get name(): AbstractControl<string> {
    return this.employeeForm.get('name') as AbstractControl<string>;
  }

  get dateOfBirth(): AbstractControl<string> {
    return this.employeeForm.get('dateOfBirth') as AbstractControl<string>;
  }

  get city(): AbstractControl<string> {
    return this.employeeForm.get('city') as AbstractControl<string>;
  }

  get salary(): AbstractControl<number> {
    return this.employeeForm.get('salary') as AbstractControl<number>;
  }

  get gender(): AbstractControl<string> {
    return this.employeeForm.get('gender') as AbstractControl<string>;
  }

  get email(): AbstractControl<string> {
    return this.employeeForm.get('email') as AbstractControl<string>;
  }

  constructor(
    private builder: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.employeeForm.invalid || this.envoiEnCours) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.envoiEnCours = true;
    this.messageErreur = '';

    const employee = new Employee(
      '',
      this.name.value,
      this.dateOfBirth.value,
      this.city.value,
      this.salary.value,
      this.gender.value || undefined,
      this.email.value || undefined
    );

    this.employeeService.addEmployee(employee).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.employeeForm.reset();
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.envoiEnCours = false;
        this.messageErreur =
          "Impossible d'enregistrer l'employé. Vérifiez que le serveur est démarré.";
      }
    });
  }
}
