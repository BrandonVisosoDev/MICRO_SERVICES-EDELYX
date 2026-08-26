package com.mx.employees.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Respuesta {
	
	private String mensaje;
	private boolean success;
	private Object obj;

}
