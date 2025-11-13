package com.portal.academic.Controller;

import com.portal.academic.Entity.TimetableEntry;
import com.portal.academic.Repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetables")
public class TimetableController {

    @Autowired
    private TimetableRepository timetableRepository;

    @GetMapping("/student/{uid}")
    public List<TimetableEntry> getStudentTimetable(
            @PathVariable String uid,
            @RequestParam String semester) {
        
        return timetableRepository.findBySemesterAndStudentUidOrSemesterAndStudentUidIsNull(
            semester, 
            uid,      
            semester  
        );
    }
    
    @PostMapping
    public TimetableEntry createTimetableEntry(@RequestBody TimetableEntry entry) {
        return timetableRepository.save(entry);
    }
}
