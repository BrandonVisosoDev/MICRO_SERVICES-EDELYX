package com.mx.departments.controller;

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

import com.mx.departments.entity.DepartamentoEntity;
import com.mx.departments.service.MetodosDepartments;

@RestController
@RequestMapping("/departments")

public class DepartmentController {
	
	private final MetodosDepartments service;
	
	DepartmentController(MetodosDepartments service){
		
		this.service = service;
		
		
	}
	
	
	// GET -> OBTENER TUDO
	
	@GetMapping("/listar")
	public ResponseEntity<?> listar(){
		
		return service.listarDepartamentos();
		
	}
	
	// GET -> OBTENER POR ID
	
	@GetMapping("/buscar/{Id}")
	public ResponseEntity<?> buscarPorId(@PathVariable Integer Id){
			
		return service.listarDepartamentoPorId(Id);
			
		}
		
	//	POST -> CREAR
	
	@PostMapping("/crear")
	public ResponseEntity<?> crear(@RequestBody DepartamentoEntity departamento){
		
		return ResponseEntity.ok(service.crearDepartamento(departamento));
		
	}
	
	// PUT -> ACTUALIZAR
	
	@PutMapping("/actualizar")
	public ResponseEntity<?> actualizar(@RequestBody DepartamentoEntity departamento){
		
		return ResponseEntity.ok(service.actualizarDepartamento(departamento));
		
		
	}
	
	// DELETE -> ELIMINAR POR ID
	
	@DeleteMapping("/eliminar/{Id}")
	public ResponseEntity<?> eliminar(@PathVariable Integer Id) {
		com.mx.departments.dto.Respuesta respuesta = service.eliminarDepartamento(Id);
		if (!respuesta.isSuccess()) {
			if (respuesta.getMensaje().contains("no existe")) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
			}
			return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
		}
		return ResponseEntity.ok(respuesta);
	}
	
	
 
}
