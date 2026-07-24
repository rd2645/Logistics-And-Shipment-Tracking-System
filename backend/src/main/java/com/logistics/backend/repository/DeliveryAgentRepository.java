package com.logistics.backend.repository;

import com.logistics.backend.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
    Optional<DeliveryAgent> findByUserId(Long userId);
}
