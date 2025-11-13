package com.portal.academic.Repository;
import com.portal.academic.Entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByIsUrgentDescPublicationDateDesc();
}
