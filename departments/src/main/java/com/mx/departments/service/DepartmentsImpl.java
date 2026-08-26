package com.mx.departments.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.mx.departments.dao.DepartmentsDao;
import com.mx.departments.dto.Respuesta;
import com.mx.departments.entity.DepartamentoEntity;

// Le indicamos que es un servicio

@Service

public class DepartmentsImpl implements MetodosDepartments {
	
	final DepartmentsDao departmentsDao;
	final RestTemplate restTemplate;
	
	DepartmentsImpl(DepartmentsDao departmentsDao, RestTemplate restTemplate){
		this.departmentsDao = departmentsDao;
		this.restTemplate = restTemplate;
	}

	// Metodo Listar (Mostrar los departamentos)
	
	
	public ResponseEntity<?> listarDepartamentos(){
		
		List<DepartamentoEntity> departamentos = departmentsDao.findAll();
		
		if(departamentos.isEmpty()) {
			
			return ResponseEntity.noContent().build();
			
		}
		
		return ResponseEntity.ok(departamentos);
		
		
	}
	
	
	// Metodo listar por ID
	
	public ResponseEntity<?> listarDepartamentoPorId(Integer Id){
		
		Optional<DepartamentoEntity> departamento = departmentsDao.findById(Id);
		
		if(departamento.isEmpty()) {
			
			return ResponseEntity.noContent().build();
			
		}
		
		return ResponseEntity.ok(departamento.get());
		
				
	}
	
	// Metodo Crear
	
	public Respuesta crearDepartamento(DepartamentoEntity departamento) {
		
		if(departmentsDao.existsById(departamento.getDeparmentId())) {
								
			return new Respuesta ("El departamento ya existe", false, null);
			
		}
		
		
		DepartamentoEntity guardado = departmentsDao.save(departamento);
		
		return new Respuesta ("Departamento creado correctamente", true, guardado);
	}
	
	// Metodo Actualizar
	
	public Respuesta actualizarDepartamento(DepartamentoEntity departamento) {
		
		if(!departmentsDao.existsById(departamento.getDeparmentId())) {
			
			
			return new Respuesta("El Departamento no existe", false, null);
			
		}
		
		DepartamentoEntity guardado = departmentsDao.save(departamento);
		
		return new Respuesta("Departamento actualizado correctamente", true, guardado);
		
		
	}
	
	// Metodo Eliminar
	
	@Transactional
	public Respuesta eliminarDepartamento(Integer Id) {
		if(!departmentsDao.existsById(Id)) {
			return new Respuesta("El Departamento no existe", false, null);
		}

		Boolean inUse;
		try {
			inUse = restTemplate.getForObject(
					"http://localhost:8081/employees/exists-by-department/{id}",
					Boolean.class,
					Id
			);
		} catch (Exception ex) {
			return new Respuesta("No se pudo verificar dependencias del departamento con empleados.", false, null);
		}

		if(Boolean.TRUE.equals(inUse)) {
			return new Respuesta("No se puede eliminar el departamento porque tiene empleados relacionados.", false, null);
		}
		
		departmentsDao.deleteById(Id);
		return new Respuesta("El departamento se ha eliminado", true , null);
	}
	
	

}
