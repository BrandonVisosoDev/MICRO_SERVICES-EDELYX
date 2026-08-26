package com.mx.employees.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Le decimos que es una Entidad

@Entity

// Importamos Lombok

@Data
@AllArgsConstructor
@NoArgsConstructor

// Le damos nombre a la tabla

@Table(name = "EMPLEADOS")

public class EmpleadoEntity {
	
	// Ponemos su ID
	
	@Id
	private Integer employeeId;
	
	// Ponemos sus campos
	
	private String firstName;
	private String lastName;
	private String phoneNumber;
	private String email;
	private Double salary;
	private LocalDate hireDate;
		
	// FK sin relaciones
	
	private Integer departmentId;  
	private Integer jobTitleId;    
		
}
