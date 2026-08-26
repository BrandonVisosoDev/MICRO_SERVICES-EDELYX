package com.mx.employees.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mx.employees.entity.EmpleadoEntity;
import com.mx.employees.service.MetodosEmployees;

@RestController
@RequestMapping("/employees")

public class EmployeeController {

	private final MetodosEmployees service;

	EmployeeController(MetodosEmployees service) {
		this.service = service;
	}
	
	  // GET → obtener todos
    @GetMapping("/listar")
    public ResponseEntity<?> listar() {
        return service.listarEmpleados();
    }

    // GET → obtener por ID
    @GetMapping("/buscar/{Id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer Id) {
        return service.listarEmpleadoPorId(Id);
    }

    // POST → crear
    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody EmpleadoEntity empleado) {
        return ResponseEntity.ok(service.crearEmpleado(empleado));
    }

    // PUT → actualizar
    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizar(@RequestBody EmpleadoEntity empleado) {
        return ResponseEntity.ok(service.actualizarEmpleado(empleado));
    }

    // DELETE → eliminar
    @DeleteMapping("/eliminar/{Id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer Id) {
        com.mx.employees.dto.Respuesta respuesta = service.eliminarEmpleado(Id);

        if (!respuesta.isSuccess()) {
            if (respuesta.getMensaje().contains("no existe")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
        }

        return ResponseEntity.ok(respuesta);
    }

    @GetMapping("/exists-by-department/{departmentId}")
    public ResponseEntity<Boolean> existsByDepartmentId(@PathVariable Integer departmentId) {
        return ResponseEntity.ok(service.existsByDepartmentId(departmentId));
    }

    @GetMapping("/exists-by-jobtitle/{jobTitleId}")
    public ResponseEntity<Boolean> existsByJobTitleId(@PathVariable Integer jobTitleId) {
        return ResponseEntity.ok(service.existsByJobTitleId(jobTitleId));
    }
    
    // GET -> listar empleados con detalles (DTO para tarjetas)
    @GetMapping("/cards")
    public ResponseEntity<?> listarConDetalles() {
        return service.listarEmpleadosConDetalles();
    }

}

