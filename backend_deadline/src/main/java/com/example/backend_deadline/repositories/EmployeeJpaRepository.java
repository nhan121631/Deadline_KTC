package com.example.backend_deadline.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend_deadline.entites.Employee;

@Repository
public interface EmployeeJpaRepository extends JpaRepository<Employee, Long> {

    Employee findByEmail(String email);

    Page<Employee> findAll(Pageable pageable);

}
