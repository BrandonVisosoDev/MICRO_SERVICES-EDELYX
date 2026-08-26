package com.mx.employees.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import com.mx.employees.dao.EmployeeDao;
import com.mx.employees.dto.Respuesta;
import com.mx.employees.entity.EmpleadoEntity;

class EmployeesImplTest {

    @Mock
    private EmployeeDao employeeDao;

    @Mock
    private RestTemplate restTemplate;

    private EmployeesImpl employeesImpl;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        employeesImpl = new EmployeesImpl(employeeDao, restTemplate);
    }

    @Test
    void eliminarEmpleadoSinRelacionesDebePermitirse() {
        EmpleadoEntity empleado = new EmpleadoEntity();
        empleado.setEmployeeId(1);
        empleado.setDepartmentId(null);
        empleado.setJobTitleId(null);

        when(employeeDao.findById(1)).thenReturn(Optional.of(empleado));

        Respuesta respuesta = employeesImpl.eliminarEmpleado(1);

        assertTrue(respuesta.isSuccess());
        verify(employeeDao).deleteById(1);
    }

    @Test
    void eliminarEmpleadoConRelacionesActivasDebeRechazarse() {
        EmpleadoEntity empleado = new EmpleadoEntity();
        empleado.setEmployeeId(2);
        empleado.setDepartmentId(5);
        empleado.setJobTitleId(7);

        when(employeeDao.findById(2)).thenReturn(Optional.of(empleado));
        when(restTemplate.getForObject(anyString(), eq(Map.class), eq(5)))
            .thenReturn(Map.of("departmentName", "Administracion"));
        when(restTemplate.getForObject(anyString(), eq(Map.class), eq(7)))
            .thenReturn(Map.of("jobTitle", "Lic.Administrativos"));

        Respuesta respuesta = employeesImpl.eliminarEmpleado(2);

        assertFalse(respuesta.isSuccess());
        assertTrue(respuesta.getMensaje().contains("departamento"));
        verify(employeeDao, never()).deleteById(2);
    }
}
