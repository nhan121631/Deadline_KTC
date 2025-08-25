package com.example.backend_deadline.dtos;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import com.example.backend_deadline.enums.Gender;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeUpdateRequestDto {
    @Length(min = 4, message = "Full name must be at least 4 characters long")
    @Length(max = 160, message = "Full name must be at most 160 characters long")
    @NotBlank(message = "Full name is required")
    private String fullName;
    @Length(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String password;
}
