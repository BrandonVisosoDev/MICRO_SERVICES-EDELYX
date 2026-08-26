package com.mx.employees.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mx.employees.entity.EmpleadoEntity;

public interface EmployeeDao extends JpaRepository<EmpleadoEntity, Integer> {
	
	// Spring genera el SQL automáticamente por el nombre del método
    boolean existsByFirstNameAndLastName(String firstName, String lastName);
    boolean existsByDepartmentId(Integer departmentId);
    boolean existsByJobTitleId(Integer jobTitleId);

}
