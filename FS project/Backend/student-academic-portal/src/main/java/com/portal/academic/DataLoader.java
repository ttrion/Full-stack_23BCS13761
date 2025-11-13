package com.portal.academic;

import com.portal.academic.Entity.Notice;
import com.portal.academic.Entity.Role;
import com.portal.academic.Entity.TimetableEntry;
import com.portal.academic.Entity.User;
import com.portal.academic.Repository.NoticeRepository;
import com.portal.academic.Repository.RoleRepository;
import com.portal.academic.Repository.TimetableRepository;
import com.portal.academic.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TimetableRepository timetableRepository;
    private final NoticeRepository noticeRepository;

    public DataLoader(RoleRepository roleRepository, UserRepository userRepository,
                      PasswordEncoder passwordEncoder, TimetableRepository timetableRepository,
                      NoticeRepository noticeRepository) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.timetableRepository = timetableRepository;
        this.noticeRepository = noticeRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedAdminUser();
        seedTimetableData();
        seedNoticeData();
    }

    private void seedRoles() {
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
            System.out.println("Role ADMIN created.");
        }

        if (roleRepository.findByName("STUDENT").isEmpty()) {
            Role studentRole = new Role();
            studentRole.setName("STUDENT");
            roleRepository.save(studentRole);
            System.out.println("Role STUDENT created.");
        }
    }

    private void seedAdminUser() {
        if (userRepository.findByUid("admin").isEmpty()) {
            User admin = new User();
            admin.setUid("admin");
            admin.setFirstName("Portal");
            admin.setLastName("Administrator");
            admin.setPassword(passwordEncoder.encode("password"));

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Admin Role not found!"));
            
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            Role studentRole = roleRepository.findByName("STUDENT")
                    .orElseThrow(() -> new RuntimeException("Error: Student Role not found!"));
            
            roles.add(studentRole); 
            admin.setRoles(roles);
            
            userRepository.save(admin);
            System.out.println("Default Admin User 'admin' created (Password: password).");
        }
        
        if (userRepository.findByUid("student").isEmpty()) {
            User student = new User();
            student.setUid("student");
            student.setFirstName("Tanay");
            student.setLastName("Student");
            student.setPassword(passwordEncoder.encode("password"));
            
            Role studentRole = roleRepository.findByName("STUDENT")
                    .orElseThrow(() -> new RuntimeException("Error: Student Role not found!"));
            
            student.setRoles(new HashSet<>(Collections.singletonList(studentRole)));
            userRepository.save(student);
            System.out.println("Default Student User 'student' created (Password: password).");
        }
    }
    
    private void seedTimetableData() {
        if (timetableRepository.count() == 0) {
            TimetableEntry general = new TimetableEntry();
            general.setSemester("2024-25-Spring");
            general.setStudentUid(null);
            general.setDayOfWeek("MONDAY");
            general.setStartTime("09:00");
            general.setEndTime("10:30");
            general.setSubject("Introduction to CS");
            general.setRoom("L-101");
            general.setClassType("Lecture");
            timetableRepository.save(general);

            TimetableEntry specific = new TimetableEntry();
            specific.setSemester("2024-25-Spring");
            specific.setStudentUid("student"); 
            specific.setDayOfWeek("MONDAY");
            specific.setStartTime("11:00");
            specific.setEndTime("13:00");
            specific.setSubject("Advanced Algorithms Lab");
            specific.setRoom("C-305");
            specific.setClassType("Lab");
            timetableRepository.save(specific);

            TimetableEntry general2 = new TimetableEntry();
            general2.setSemester("2024-25-Spring");
            general2.setStudentUid(null);
            general2.setDayOfWeek("TUESDAY");
            general2.setStartTime("14:00");
            general2.setEndTime("15:30");
            general2.setSubject("Database Systems");
            general2.setRoom("B-202");
            general2.setClassType("Lecture");
            timetableRepository.save(general2);
            
            System.out.println("Timetable data seeded.");
        }
    }
    
    private void seedNoticeData() {
        if (noticeRepository.count() == 0) {
            Notice urgentNotice = new Notice();
            urgentNotice.setTitle("URGENT: Exam Date Change for DBMS");
            urgentNotice.setContent("The Database Management Systems final exam has been moved to Friday, December 15th at 9:00 AM.");
            urgentNotice.setAuthor("Academic Office");
            urgentNotice.setCategory("EXAM");
            urgentNotice.setUrgent(true);
            urgentNotice.setPublicationDate(LocalDateTime.now());
            noticeRepository.save(urgentNotice);

            Notice generalNotice = new Notice();
            generalNotice.setTitle("Semester Break Announcement");
            generalNotice.setContent("The spring semester break will begin on May 1st and classes will resume on May 15th. Please check your personalized timetables.");
            generalNotice.setAuthor("University Registrar");
            generalNotice.setCategory("GENERAL");
            generalNotice.setUrgent(false);
            generalNotice.setPublicationDate(LocalDateTime.now().minusDays(1));
            noticeRepository.save(generalNotice);
            
            System.out.println("Sample Notice data seeded.");
        }
    }
}