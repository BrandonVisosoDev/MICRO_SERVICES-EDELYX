package com.mx.jobTitles.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mx.jobTitles.entity.JobTitleEntity;

public interface JobTitlesDao extends JpaRepository<JobTitleEntity, Integer> {

}
