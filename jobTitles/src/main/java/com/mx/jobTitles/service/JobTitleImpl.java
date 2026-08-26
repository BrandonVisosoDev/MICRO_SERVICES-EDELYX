package com.mx.jobTitles.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.mx.jobTitles.dao.JobTitlesDao;
import com.mx.jobTitles.dto.Respuesta;
import com.mx.jobTitles.entity.JobTitleEntity;



@Service
public class JobTitleImpl implements MetodosJobTitles {

    final JobTitlesDao jobTitleDao;
    final RestTemplate restTemplate;

    JobTitleImpl(JobTitlesDao jobTitleDao, RestTemplate restTemplate) {
        this.jobTitleDao = jobTitleDao;
        this.restTemplate = restTemplate;
    }

    // Metodo Listar
    public ResponseEntity<?> listarTitulos() {
        List<JobTitleEntity> jobTitles = jobTitleDao.findAll();

        if(jobTitles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(jobTitles);
    }

    // Metodo Listar por Id
    public ResponseEntity<?> listarTitulosPorId(Integer Id) {
        Optional<JobTitleEntity> jobTitle = jobTitleDao.findById(Id);

        if(jobTitle.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(jobTitle.get());
    }

    // Metodo Crear
    public Respuesta crearTitulo(JobTitleEntity jobTitle) {
        if(jobTitleDao.existsById(jobTitle.getJobTitleId())) {
            return new Respuesta("El titulo trabajo ya existe", false, null);
        }

        JobTitleEntity guardado = jobTitleDao.save(jobTitle);
        return new Respuesta("titulo trabajo creado correctamente", true, guardado);
    }

    // Metodo Actualizar
    public Respuesta actualizarTitulo(JobTitleEntity jobTitle) {
        if(!jobTitleDao.existsById(jobTitle.getJobTitleId())) {
            return new Respuesta("El titulo trabajo no existe", false, null);
        }

        JobTitleEntity guardado = jobTitleDao.save(jobTitle);
        return new Respuesta("Titulo trabajo actualizado correctamente", true, guardado);
    }

    // Metodo Eliminar
    @Transactional
    public Respuesta eliminarTitulo(Integer Id) {
        if(!jobTitleDao.existsById(Id)) {
            return new Respuesta("El job title no existe", false, null);
        }

        Boolean inUse;
        try {
            inUse = restTemplate.getForObject(
                "http://localhost:8081/employees/exists-by-jobtitle/{id}",
                Boolean.class,
                Id
            );
        } catch (Exception ex) {
            return new Respuesta("No se pudo verificar dependencias del título con empleados.", false, null);
        }

        if(Boolean.TRUE.equals(inUse)) {
            return new Respuesta("No se puede eliminar el título porque tiene empleados relacionados.", false, null);
        }

        jobTitleDao.deleteById(Id);
        return new Respuesta("Job title eliminado correctamente", true, null);
    }
}