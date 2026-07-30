package com.logistics.backend.repository;

import com.logistics.backend.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    List<Shipment> findByCustomerId(Long customerId);
    long countByStatusIn(List<com.logistics.backend.enums.ShipmentStatus> statuses);
}
