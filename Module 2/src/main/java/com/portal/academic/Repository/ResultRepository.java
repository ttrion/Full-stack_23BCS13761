package com.portal.academic.Repository;

import com.portal.academic.Entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    
    List<Result> findByStudentUidOrderBySemesterDesc(String studentUid);
}
