package com.mx.departments.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Le decimos que es una entidad

@Entity

// Le damos un nombre a la tabla

@Table(name = "DEPARTAMENTOS")

// Le damos lombok

@Data
@NoArgsConstructor
@AllArgsConstructor

public class DepartamentoEntity {
	
	// Le damos su ID
	
	@Id
	@JsonProperty("departmentId")
	private Integer deparmentId;
	
	// Mapeamos sus campos
	
	@JsonProperty("departmentName")
	private String deparmentName;	
	
	// AQUI NO HAY FK YA QUE SE LLAMA EN OPENFEING O REST TEMPLATE
	
}

