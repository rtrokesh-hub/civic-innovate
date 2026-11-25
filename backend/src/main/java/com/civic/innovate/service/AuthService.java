package com.civic.innovate.service;

import com.civic.innovate.dto.AuthResponse;
import com.civic.innovate.dto.LoginRequest;
import com.civic.innovate.dto.RegisterRequest;
import com.civic.innovate.dto.UserDto;
import com.civic.innovate.entity.College;
import com.civic.innovate.entity.Role;
import com.civic.innovate.entity.User;
import com.civic.innovate.repository.CollegeRepository;
import com.civic.innovate.repository.UserRepository;
import com.civic.innovate.security.JwtTokenProvider;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    @Value("${app.seed-demo-data:false}")
    private boolean seedDemoData;

    public AuthService(UserRepository userRepository,
                       CollegeRepository collegeRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostConstruct
    public void seedInitialData() {
        if (!seedDemoData) {
            return;
        }
        if (collegeRepository.count() == 0) {
            College c1 = new College("Bengaluru Institute of Technology", "BIT-BLR", "Bengaluru", "Karnataka", "admin@bit.edu");
            College c2 = new College("National Institute of Engineering", "NIE-MYS", "Mysuru", "Karnataka", "info@nie.ac.in");
            College c3 = new College("Indian Institute of Science & Technology", "IIST-BLR", "Bengaluru", "Karnataka", "dean@iist.ac.in");
            collegeRepository.saveAll(List.of(c1, c2, c3));
        }

        if (!userRepository.existsByEmail("admin@civic.gov")) {
            User official = new User("admin@civic.gov", passwordEncoder.encode("GovAdmin123!"), "Director Rajesh Sharma", Role.ROLE_GOV_OFFICIAL);
            official.setCity("Bengaluru");
            official.setPhone("+919876543210");
            userRepository.save(official);
        }

        if (!userRepository.existsByEmail("citizen@civic.org")) {
            User citizen = new User("citizen@civic.org", passwordEncoder.encode("Citizen123!"), "Aarav Patel", Role.ROLE_CITIZEN);
            citizen.setCity("Bengaluru");
            citizen.setPhone("+919876543211");
            userRepository.save(citizen);
        }

        College bitCollege = collegeRepository.findAll().stream().findFirst().orElse(null);

        if (!userRepository.existsByEmail("student@bit.edu")) {
            User student = new User("student@bit.edu", passwordEncoder.encode("Student123!"), "Kavya S. Narang", Role.ROLE_STUDENT);
            student.setCollege(bitCollege);
            student.setDepartment("CIVIL");
            student.setCity("Bengaluru");
            student.setPhone("+919988776655");
            userRepository.save(student);
        }

        if (!userRepository.existsByEmail("admin@bit.edu")) {
            User collegeAdmin = new User("admin@bit.edu", passwordEncoder.encode("CollegeAdmin123!"), "Prof. S. R. Varma", Role.ROLE_COLLEGE_ADMIN);
            collegeAdmin.setCollege(bitCollege);
            collegeAdmin.setDepartment("CIVIL");
            collegeAdmin.setCity("Bengaluru");
            collegeAdmin.setPhone("+919988776656");
            userRepository.save(collegeAdmin);
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {

    if (req.getRole() != Role.ROLE_CITIZEN
            && req.getRole() != Role.ROLE_STUDENT) {
        throw new IllegalArgumentException(
                "Only Citizen and Student accounts can be self-registered"
        );
    }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }

        User user = new User(
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getFullName(),
                req.getRole()
        );
        user.setPhone(req.getPhone());
        user.setDepartment(req.getDepartment());
        user.setCity(req.getCity());

        if (req.getCollegeId() != null) {
            Optional<College> college = collegeRepository.findById(req.getCollegeId());
            college.ifPresent(user::setCollege);
        }

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser);
        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user);
        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(User principal) {
        return UserDto.fromEntity(principal);
    }

    @Transactional(readOnly = true)
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }
}
