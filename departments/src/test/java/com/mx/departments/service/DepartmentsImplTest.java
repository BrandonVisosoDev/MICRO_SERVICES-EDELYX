package com.mx.departments.service;

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

import com.mx.departments.dao.DepartmentsDao;
import com.mx.departments.dto.Respuesta;

class DepartmentsImplTest {

    @Mock
    private DepartmentsDao departmentsDao;

    @Mock
    private RestTemplate restTemplate;

    private DepartmentsImpl departmentsImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        departmentsImpl = new DepartmentsImpl(departmentsDao, restTemplate);
    }

    @Test
    void eliminarDepartamentoSinRelacionesDebePermitirse() {
        when(departmentsDao.existsById(1)).thenReturn(true);
        when(restTemplate.getForObject(anyString(), eq(Boolean.class), anyInt())).thenReturn(false);

        Respuesta respuesta = departmentsImpl.eliminarDepartamento(1);

        assertTrue(respuesta.isSuccess());
        verify(departmentsDao).deleteById(1);
    }

    @Test
    void eliminarDepartamentoConEmpleadosRelacionadosDebeRechazarse() {
        when(departmentsDao.existsById(7)).thenReturn(true);
        when(restTemplate.getForObject(anyString(), eq(Boolean.class), anyInt())).thenReturn(true);

        Respuesta respuesta = departmentsImpl.eliminarDepartamento(7);

        assertFalse(respuesta.isSuccess());
        assertTrue(respuesta.getMensaje().contains("empleados relacionados"));
        verify(departmentsDao, never()).deleteById(7);
    }
}