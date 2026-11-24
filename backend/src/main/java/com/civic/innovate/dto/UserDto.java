package com.civic.innovate.dto;

import com.civic.innovate.entity.Role;
import com.civic.innovate.entity.User;

import java.util.UUID;

public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private Role role;
    private String phone;
    private UUID collegeId;
    private String collegeName;
    private String department;
    private String city;

    public UserDto() {}

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        if (user.getCollege() != null) {
            dto.setCollegeId(user.getCollege().getId());
            dto.setCollegeName(user.getCollege().getName());
        }
        dto.setDepartment(user.getDepartment());
        dto.setCity(user.getCity());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public UUID getCollegeId() { return collegeId; }
    public void setCollegeId(UUID collegeId) { this.collegeId = collegeId; }
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
