
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Employee } from '../model/employee';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';

const GET_EMPLOYEES = gql`
  query {
    employees {
      id
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation addEmployee(
    $name: String!,
    $dateOfBirth: String!,
    $city: String!,
    $salary: Float!,
    $gender: String,
    $email: String
  ) {
    newEmployee(createEmployeeInput: {
      name: $name,
      dateOfBirth: $dateOfBirth,
      city: $city,
      salary: $salary,
      gender: $gender,
      email: $email
    }) {
      id
      name
      dateOfBirth
      city
      salary
      gender
      email
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employees$ = new BehaviorSubject<readonly Employee[]>([]);

  constructor(private apollo: Apollo) {

    this.apollo
      .watchQuery<{ employees: Employee[] }>({
        query: GET_EMPLOYEES
      })
      .valueChanges
      .subscribe({
        next: ({ data }) => {
          this.employees$.next(data.employees);
        },
        error: (erreur) => {
          console.error(
            'Impossible de charger les employés :',
            erreur
          );
        }
      });
  }

  get $(): Observable<readonly Employee[]> {
    return this.employees$.asObservable();
  }

  addEmployee(employee: Employee) {

    return this.apollo.mutate<{ newEmployee: Employee }>({
      mutation: ADD_EMPLOYEE,
      variables: {
        name: employee.name,
        dateOfBirth: employee.dateOfBirth,
        city: employee.city,
        salary: employee.salary,
        gender: employee.gender ?? null,
        email: employee.email ?? null
      }
    }).pipe(
      tap(({ data }) => {
        if (data?.newEmployee) {
          this.employees$.next([
            ...this.employees$.getValue(),
            data.newEmployee
          ]);
        }
      })
    );
  }
}
