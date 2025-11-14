package com.portal.academic.Controller;
import com.portal.academic.Entity.Notice;
import com.portal.academic.Repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    @Autowired
    private NoticeRepository noticeRepository;
    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByIsUrgentDescPublicationDateDesc();
    }
    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        notice.setPublicationDate(LocalDateTime.now());
        Notice savedNotice = noticeRepository.save(notice);
        return ResponseEntity.ok(savedNotice);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice noticeDetails) {
        return noticeRepository.findById(id)
                .map(notice -> {
                    notice.setTitle(noticeDetails.getTitle());
                    notice.setContent(noticeDetails.getContent());
                    notice.setAuthor(noticeDetails.getAuthor());
                    notice.setCategory(noticeDetails.getCategory());
                    notice.setUrgent(noticeDetails.isUrgent());
                    Notice updatedNotice = noticeRepository.save(notice);
                    return ResponseEntity.ok(updatedNotice);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        if (noticeRepository.existsById(id)) {
            noticeRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}