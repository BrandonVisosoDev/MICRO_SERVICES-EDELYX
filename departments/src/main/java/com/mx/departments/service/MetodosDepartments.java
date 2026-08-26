package com.mx.departments.service;



import org.springframework.http.ResponseEntity;

import com.mx.departments.dto.Respuesta;
import com.mx.departments.entity.DepartamentoEntity;

public interface MetodosDepartments {
	
	// Regresan datos → el Controller decide el código HTTP
	
    ResponseEntity<?> listarDepartamentos();
    ResponseEntity<?> listarDepartamentoPorId(Integer id);
    
    // Operaciones → regresan tu DTO con mensaje
    
    Respuesta crearDepartamento(DepartamentoEntity departamento);
    Respuesta actualizarDepartamento(DepartamentoEntity departamento);
    Respuesta eliminarDepartamento(Integer id);

}
