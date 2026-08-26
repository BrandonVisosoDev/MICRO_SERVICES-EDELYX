package com.mx.jobTitles.service;



import org.springframework.http.ResponseEntity;

import com.mx.jobTitles.dto.Respuesta;
import com.mx.jobTitles.entity.JobTitleEntity;

public interface MetodosJobTitles {
	
	// Regresan datos → el Controller decide el código HTTP
		
	    ResponseEntity<?> listarTitulos();
	    ResponseEntity<?> listarTitulosPorId(Integer id);

	    Respuesta crearTitulo(JobTitleEntity jobTitle);
	    Respuesta actualizarTitulo(JobTitleEntity jobTitle);
	    Respuesta eliminarTitulo(Integer id);
	

}
