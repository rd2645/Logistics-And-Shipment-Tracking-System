package com.logistics.backend.service;

import com.logistics.backend.dto.AssignAgentRequest;
import com.logistics.backend.entity.DeliveryAgent;
import com.logistics.backend.entity.DeliveryAssignment;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.Warehouse;
import com.logistics.backend.enums.ShipmentStatus;
import com.logistics.backend.repository.DeliveryAgentRepository;
import com.logistics.backend.repository.DeliveryAssignmentRepository;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    @Autowired
    private DeliveryAssignmentRepository deliveryAssignmentRepository;
    
    @Autowired
    private ShipmentService shipmentService;

    @Autowired
    private WarehouseRepository warehouseRepository;

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public DeliveryAssignment assignDeliveryAgent(AssignAgentRequest request) {
        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
                
        DeliveryAgent agent = deliveryAgentRepository.findByUserId(request.getAgentId())
                .orElseGet(() -> {
                    DeliveryAgent newAgent = new DeliveryAgent();
                    newAgent.setUserId(request.getAgentId());
                    newAgent.setVehicleNumber("UNASSIGNED-VAN");
                    newAgent.setAvailabilityStatus("AVAILABLE");
                    return deliveryAgentRepository.save(newAgent);
                });

        DeliveryAssignment assignment = new DeliveryAssignment();
        assignment.setShipment(shipment);
        assignment.setDeliveryAgent(agent);
        assignment.setAssignedDate(LocalDateTime.now());
        
        // Update shipment status if needed
        if (shipment.getStatus() == ShipmentStatus.IN_WAREHOUSE || shipment.getStatus() == ShipmentStatus.PENDING) {
            shipmentService.addTrackingUpdate(shipment, ShipmentStatus.OUT_FOR_DELIVERY, "Assigned to Agent (User ID: " + agent.getUserId() + ")");
        }

        return deliveryAssignmentRepository.save(assignment);
    }

    public com.logistics.backend.dto.AdminAnalyticsResponse getAnalytics() {
        long totalShipments = shipmentRepository.count();
        long activeDeliveries = shipmentRepository.countByStatusIn(
                List.of(ShipmentStatus.IN_TRANSIT, ShipmentStatus.OUT_FOR_DELIVERY)
        );
        // Mock revenue: $15 base + ($5 * totalShipments)
        java.math.BigDecimal revenue = new java.math.BigDecimal(15 + (5 * totalShipments));
        return new com.logistics.backend.dto.AdminAnalyticsResponse(totalShipments, activeDeliveries, revenue);
    }
}
