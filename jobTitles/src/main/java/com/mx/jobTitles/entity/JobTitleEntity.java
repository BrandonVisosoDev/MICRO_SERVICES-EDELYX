package com.mx.jobTitles.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Le decimos que es una entidad

@Entity

// Le damos un nombre a la tabla

@Table(name = "TITULOSTRABAJO")

// Le damos lombok

@Data
@NoArgsConstructor
@AllArgsConstructor

public class JobTitleEntity {
	
	// Le damos un Id
	
	@Id
	private Integer jobTitleId;
	
	// Mapeamos su campo
	
	private String jobTitle;
	
	// AQUI NO HAY FK YA QUE SE LLAMA EN OPENFEING
	
}
