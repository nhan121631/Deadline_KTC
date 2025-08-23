package com.example.backend_deadline.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend_deadline.dtos.EmployeeCreateRequestDto;
import com.example.backend_deadline.dtos.EmployeeResponseDto;
import com.example.backend_deadline.dtos.EmployeeUpdateRequestDto;
import com.example.backend_deadline.entites.Employee;
import com.example.backend_deadline.repositories.EmployeeJpaRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeJpaRepository employeeRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public EmployeeResponseDto convertToDto(Employee employee) {
        if (employee == null) {
            return null;
        }

        return EmployeeResponseDto.builder()
                .id(employee.getId())
                .fullName(employee.getFullName())
                .email(employee.getEmail())
                .dateOfBirth(employee.getDateOfBirth())
                .gender(employee.getGender())
                .phoneNumber(employee.getPhoneNumber())
                .active(employee.isActive())
                .build();
    }

    private boolean isEmailUnique(String email) {
        return employeeRepository.findByEmail(email) == null;
    }

    public EmployeeResponseDto save(EmployeeCreateRequestDto createRequestDto) {
        if (!isEmailUnique(createRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Employee employee = Employee.builder()
                .fullName(createRequestDto.getFullName())
                .email(createRequestDto.getEmail())
                .dateOfBirth(createRequestDto.getDateOfBirth())
                .gender(createRequestDto.getGender())
                .phoneNumber(createRequestDto.getPhoneNumber())
                .hashedPassword(passwordEncoder.encode(createRequestDto.getPassword()))
                .active(true)
                .build();
        employee = employeeRepository.save(employee);
        return convertToDto(employee);
    }

    public List<EmployeeResponseDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        return convertToDto(employee);
    }

    public EmployeeResponseDto update(Long id, EmployeeUpdateRequestDto requestDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        employee.setFullName(requestDto.getFullName());
        employee.setPhoneNumber(requestDto.getPhoneNumber());
        employee.setDateOfBirth(requestDto.getDateOfBirth());
        employee.setGender(requestDto.getGender());
        employee.setHashedPassword(passwordEncoder.encode(requestDto.getPassword()));

        employee = employeeRepository.save(employee);
        return convertToDto(employee);
    }

    public EmployeeResponseDto delete(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        employeeRepository.delete(employee);
        return convertToDto(employee);
    }
}