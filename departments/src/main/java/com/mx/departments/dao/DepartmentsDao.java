package com.mx.departments.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mx.departments.entity.DepartamentoEntity;

public interface DepartmentsDao extends JpaRepository<DepartamentoEntity, Integer> {

}
