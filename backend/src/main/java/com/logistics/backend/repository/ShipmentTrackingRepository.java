package com.logistics.backend.repository;

import com.logistics.backend.entity.ShipmentTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentTrackingRepository extends JpaRepository<ShipmentTracking, Long> {
    List<ShipmentTracking> findByShipmentIdOrderByUpdateTimeDesc(Long shipmentId);
}
