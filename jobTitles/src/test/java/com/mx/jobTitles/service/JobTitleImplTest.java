package com.mx.jobTitles.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import com.mx.jobTitles.dao.JobTitlesDao;
import com.mx.jobTitles.dto.Respuesta;

class JobTitleImplTest {

    @Mock
    private JobTitlesDao jobTitlesDao;

    @Mock
    private RestTemplate restTemplate;

    private JobTitleImpl jobTitleImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jobTitleImpl = new JobTitleImpl(jobTitlesDao, restTemplate);
    }

    @Test
    void eliminarTituloSinRelacionesDebePermitirse() {
        when(jobTitlesDao.existsById(1)).thenReturn(true);
        when(restTemplate.getForObject(anyString(), eq(Boolean.class), anyInt())).thenReturn(false);

        Respuesta respuesta = jobTitleImpl.eliminarTitulo(1);

        assertTrue(respuesta.isSuccess());
        verify(jobTitlesDao).deleteById(1);
    }

    @Test
    void eliminarTituloConEmpleadosRelacionadosDebeRechazarse() {
        when(jobTitlesDao.existsById(9)).thenReturn(true);
        when(restTemplate.getForObject(anyString(), eq(Boolean.class), anyInt())).thenReturn(true);

        Respuesta respuesta = jobTitleImpl.eliminarTitulo(9);

        assertFalse(respuesta.isSuccess());
        assertTrue(respuesta.getMensaje().contains("empleados relacionados"));
        verify(jobTitlesDao, never()).deleteById(9);
    }
}