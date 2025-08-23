package com.example.backend_deadline.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_deadline.dtos.EmployeeCreateRequestDto;
import com.example.backend_deadline.dtos.EmployeeResponseDto;
import com.example.backend_deadline.dtos.EmployeeUpdateRequestDto;
import com.example.backend_deadline.dtos.Paging;
import com.example.backend_deadline.service.EmployeeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public EmployeeResponseDto createEmployee(@RequestBody @Valid EmployeeCreateRequestDto requestDto) {
        return employeeService.save(requestDto);
    }

    @GetMapping
    public Paging<EmployeeResponseDto> getAllEmployees(@RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return employeeService.getAllEmployees(page, size);
    }

    @GetMapping("/{id}")
    public EmployeeResponseDto getEmployeeById(@PathVariable("id") Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public EmployeeResponseDto updateEmployee(@PathVariable("id") Long id,
            @RequestBody @Valid EmployeeUpdateRequestDto requestDto) {
        return employeeService.update(id, requestDto);
    }

    @DeleteMapping("/{id}")
    public EmployeeResponseDto deleteEmployee(@PathVariable("id") Long id) {
        return employeeService.delete(id);
    }
}
