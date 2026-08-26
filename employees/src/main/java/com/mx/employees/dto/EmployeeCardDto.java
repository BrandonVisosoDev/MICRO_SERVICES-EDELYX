package com.mx.employees.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeCardDto {
    private Integer employeeId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Double salary;
    private LocalDate hireDate;
    private Integer departmentId;
    private String departmentName;
    private Integer jobTitleId;
    private String jobTitle;
}
