package com.mx.employees.service;



import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.mx.employees.dao.EmployeeDao;
import com.mx.employees.dto.Respuesta;
import com.mx.employees.entity.EmpleadoEntity;

// Le ponemos que es un servicio

@Service 


public class EmployeesImpl implements MetodosEmployees {
	
	final EmployeeDao employeeDao;
	final RestTemplate restTemplate;

	EmployeesImpl(EmployeeDao employeeDao, RestTemplate restTemplate) {
		this.employeeDao = employeeDao;
		this.restTemplate = restTemplate;
	}
	
	// Metodo Listar (Mostrar los empleados)
	
	public ResponseEntity<?> listarEmpleados() {
	    List<EmpleadoEntity> empleados = employeeDao.findAll();

	    if(empleados.isEmpty()) {
	        return ResponseEntity.noContent().build();
	    }

	    return ResponseEntity.ok(empleados);
	}
		
	
	
	// Metodo Listar por Id
	
	public ResponseEntity<?> listarEmpleadoPorId(Integer Id) {
	    Optional<EmpleadoEntity> empleado = employeeDao.findById(Id);

	    if(empleado.isEmpty()) {
	        return ResponseEntity.noContent().build();
	    }

	    return ResponseEntity.ok(empleado.get());
	}
	
	// Metodo Crear
	
	public Respuesta crearEmpleado(EmpleadoEntity empleado) {
	    // Si el ID viene en 0 desde el frontend, le asignamos manualmente el siguiente ID disponible
	    if (empleado.getEmployeeId() != null && empleado.getEmployeeId() == 0) {
	        Integer maxId = employeeDao.findAll().stream()
	            .map(EmpleadoEntity::getEmployeeId)
	            .max(Integer::compareTo)
	            .orElse(0);
	        empleado.setEmployeeId(maxId + 1);
	    }
	    
	    if(empleado.getEmployeeId() != null && employeeDao.existsById(empleado.getEmployeeId())) {
	        return new Respuesta("El empleado ya existe", false, null);
	    }
	    
	 // Checa si nombre y apellido ya existen
	    if(employeeDao.existsByFirstNameAndLastName(
	            empleado.getFirstName(), 
	            empleado.getLastName())) {
	        return new Respuesta("Ya existe un empleado con ese nombre y apellido", false, null);
	    }
	    
	    
	    EmpleadoEntity guardado = employeeDao.save(empleado);
	    return new Respuesta("Empleado creado correctamente", true, guardado);
	}
	
	// Metodo Actualizar
	
	public Respuesta actualizarEmpleado(EmpleadoEntity empleado) {
	    if(!employeeDao.existsById(empleado.getEmployeeId())) {
	        return new Respuesta("El empleado no existe", false, null);
	    }
	    EmpleadoEntity guardado = employeeDao.save(empleado);
	    return new Respuesta("Empleado actualizado correctamente", true, guardado);
	}
	
	// Metodo Eliminar
	
	@Transactional
	public Respuesta eliminarEmpleado(Integer Id) {
	    Optional<EmpleadoEntity> empleadoOpt = employeeDao.findById(Id);
	    if(empleadoOpt.isEmpty()) {
	        return new Respuesta("El empleado no existe", false, null);
	    }

	    EmpleadoEntity empleado = empleadoOpt.get();
	    List<String> bloqueos = new ArrayList<>();

	    if (empleado.getDepartmentId() != null && empleado.getDepartmentId() > 0) {
	        try {
	            Map<?, ?> departamento = restTemplate.getForObject(
	                "http://localhost:8082/departments/buscar/{id}",
	                Map.class,
	                empleado.getDepartmentId()
	            );
	            if (departamento != null) {
	                bloqueos.add("departamento");
	            }
	        } catch (Exception ignored) {
	            // Si el microservicio no responde, no eliminamos por seguridad.
            bloqueos.add("departamento");
        }
    }

	    if (empleado.getJobTitleId() != null && empleado.getJobTitleId() > 0) {
	        try {
	            Map<?, ?> titulo = restTemplate.getForObject(
                "http://localhost:8083/jobtitles/buscar/{id}",
                Map.class,
                empleado.getJobTitleId()
            );
	        if (titulo != null) {
            bloqueos.add("título");
        }
        } catch (Exception ignored) {
            bloqueos.add("título");
        }
    }

	    if (!bloqueos.isEmpty()) {
	        String detalle = bloqueos.stream().distinct().collect(Collectors.joining(" y "));
	        return new Respuesta(
	            "No se puede eliminar el empleado porque tiene relaciones activas con el " + detalle + ".",
	            false,
	            null
        );
    }

	    employeeDao.deleteById(Id);
	    return new Respuesta("Empleado eliminado correctamente", true, null);
	}

	public boolean existsByDepartmentId(Integer departmentId) {
	    return employeeDao.existsByDepartmentId(departmentId);
	}

	public boolean existsByJobTitleId(Integer jobTitleId) {
	    return employeeDao.existsByJobTitleId(jobTitleId);
	}
    
	// Metodo Lista Empleados con Detalles en foma de tarjeta front
    
	public ResponseEntity<?> listarEmpleadosConDetalles() {
	    List<EmpleadoEntity> empleados = employeeDao.findAll();

	    if(empleados.isEmpty()) {
	        return ResponseEntity.noContent().build();
	    }

	    List<com.mx.employees.dto.EmployeeCardDto> cards = new ArrayList<>();
	    org.springframework.web.client.RestTemplate rest = new org.springframework.web.client.RestTemplate();

	    for (EmpleadoEntity e : empleados) {
	        String deptName = "";
	        String jobName = "";

	        try {
	            java.util.Map dept = rest.getForObject("http://localhost:8082/departments/buscar/{id}", java.util.Map.class, e.getDepartmentId());
	            if (dept != null) {
	                Object dn = dept.get("deparmentName");
	                if (dn == null) dn = dept.get("departmentName");
	                deptName = dn != null ? dn.toString() : "";
	            }
	        } catch (Exception ex) {
	            
	        }

	        try {
	            java.util.Map job = rest.getForObject("http://localhost:8083/jobtitles/buscar/{id}", java.util.Map.class, e.getJobTitleId());
	            if (job != null) {
	                Object jn = job.get("jobTitle");
	                jobName = jn != null ? jn.toString() : "";
	            }
	        } catch (Exception ex) {
	            
	        }

	        com.mx.employees.dto.EmployeeCardDto dto = new com.mx.employees.dto.EmployeeCardDto(
	            e.getEmployeeId(),
	            e.getFirstName(),
	            e.getLastName(),
	            e.getPhoneNumber(),
	            e.getEmail(),
	            e.getSalary(),
	            e.getHireDate(),
	            e.getDepartmentId(),
	            deptName,
	            e.getJobTitleId(),
	            jobName
	        );

	        cards.add(dto);
	    }

	    return ResponseEntity.ok(cards);
	}


}
