
package seg3x02.employeeGql.resolvers

import org.springframework.graphql.data.method.annotation.Argument
import org.springframework.graphql.data.method.annotation.MutationMapping
import org.springframework.graphql.data.method.annotation.QueryMapping
import org.springframework.stereotype.Controller
import seg3x02.employeeGql.entity.Employee
import seg3x02.employeeGql.repository.EmployeesRepository
import seg3x02.employeeGql.resolvers.types.CreateEmployeeInput
import java.util.UUID

@Controller
class EmployeesResolver(
    private val employeesRepository: EmployeesRepository
) {

    @QueryMapping
    fun employees(): List<Employee> {
        return employeesRepository.findAll()
    }

    @MutationMapping
    fun newEmployee(
        @Argument("createEmployeeInput") input: CreateEmployeeInput
    ): Employee {

        val employee = Employee(
            name = requireNotNull(input.name) {
                "Name is required"
            },
            dateOfBirth = requireNotNull(input.dateOfBirth) {
                "Date of birth is required"
            },
            city = requireNotNull(input.city) {
                "City is required"
            },
            salary = requireNotNull(input.salary) {
                "Salary is required"
            },
            gender = input.gender,
            email = input.email
        )

        employee.id = UUID.randomUUID().toString()

        return employeesRepository.save(employee)
    }
}
