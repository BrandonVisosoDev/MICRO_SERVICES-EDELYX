package com.mx.employees.service;



import org.springframework.http.ResponseEntity;

import com.mx.employees.dto.Respuesta;
import com.mx.employees.entity.EmpleadoEntity;

public interface MetodosEmployees {
	
	// Regresan datos 
	
	ResponseEntity<?> listarEmpleados();
    ResponseEntity<?> listarEmpleadoPorId(Integer id);

    
    // Operaciones → regresan el DTO con mensaje
    
    Respuesta crearEmpleado(EmpleadoEntity empleado);
    Respuesta actualizarEmpleado(EmpleadoEntity empleado);
    Respuesta eliminarEmpleado(Integer id);

    boolean existsByDepartmentId(Integer departmentId);
    boolean existsByJobTitleId(Integer jobTitleId);

    ResponseEntity<?> listarEmpleadosConDetalles();
}

