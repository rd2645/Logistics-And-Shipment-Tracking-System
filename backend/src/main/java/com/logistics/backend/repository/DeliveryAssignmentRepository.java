package com.logistics.backend.repository;

import com.logistics.backend.entity.DeliveryAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryAssignmentRepository extends JpaRepository<DeliveryAssignment, Long> {
    List<DeliveryAssignment> findByDeliveryAgentId(Long agentId);
}
