package com.portal.academic.Controller;
import com.portal.academic.Entity.Result;
import com.portal.academic.Repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api/results")
public class ResultController {
    @Autowired
    private ResultRepository resultRepository;
    @GetMapping("/student/{uid}")
    public List<Result> getStudentResults(@PathVariable String uid) {
        return resultRepository.findByStudentUidOrderBySemesterDesc(uid);
    }
}