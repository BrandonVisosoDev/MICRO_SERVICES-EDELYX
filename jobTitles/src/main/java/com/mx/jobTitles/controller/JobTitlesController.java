package com.mx.jobTitles.controller;

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

import com.mx.jobTitles.entity.JobTitleEntity;
import com.mx.jobTitles.service.MetodosJobTitles;

@RestController
@RequestMapping("/jobtitles")

public class JobTitlesController {
	
	private final MetodosJobTitles service;
	
	JobTitlesController(MetodosJobTitles service){
		
		this.service = service;
		
		
	}
	
	// GET → obtener todos
    @GetMapping("/listar")
    public ResponseEntity<?> listar() {
        return service.listarTitulos();
    }

    // GET → obtener por ID
    @GetMapping("/buscar/{Id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer Id) {
        return service.listarTitulosPorId(Id);
    }

    // POST → crear
    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody JobTitleEntity titulo) {
        return ResponseEntity.ok(service.crearTitulo(titulo));
    }

    // PUT → actualizar
    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizar(@RequestBody JobTitleEntity titulo) {
        return ResponseEntity.ok(service.actualizarTitulo(titulo));
    }

    // DELETE → eliminar
    @DeleteMapping("/eliminar/{Id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer Id) {
        com.mx.jobTitles.dto.Respuesta respuesta = service.eliminarTitulo(Id);
        if (!respuesta.isSuccess()) {
            if (respuesta.getMensaje().contains("no existe")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
        }
        return ResponseEntity.ok(respuesta);
    }
 

}
