package com.mx.jobTitles.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Respuesta {
	
	private String mensaje;
	private boolean success;
	private Object obj;

}

