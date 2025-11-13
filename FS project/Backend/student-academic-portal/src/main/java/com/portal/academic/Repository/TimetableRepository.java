package com.portal.academic.Repository;

import com.portal.academic.Entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    
    List<TimetableEntry> findBySemesterAndStudentUidOrSemesterAndStudentUidIsNull(String semester, String studentUid1, String semester2);
}
