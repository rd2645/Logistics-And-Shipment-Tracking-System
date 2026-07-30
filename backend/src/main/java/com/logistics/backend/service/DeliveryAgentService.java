package com.logistics.backend.service;

import com.logistics.backend.entity.DeliveryAgent;
import com.logistics.backend.entity.DeliveryAssignment;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.enums.ShipmentStatus;
import com.logistics.backend.repository.DeliveryAgentRepository;
import com.logistics.backend.repository.DeliveryAssignmentRepository;
import com.logistics.backend.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryAgentService {

    @Autowired
    private DeliveryAssignmentRepository assignmentRepository;

    @Autowired
    private DeliveryAgentRepository agentRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private ShipmentService shipmentService;

    public List<Shipment> getAssignedShipments(Long userId) {
        DeliveryAgent agent = agentRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Agent not found"));
        
        return assignmentRepository.findByDeliveryAgentId(agent.getId())
                .stream()
                .map(DeliveryAssignment::getShipment)
                .collect(Collectors.toList());
    }

    public Shipment updateShipmentStatus(Long shipmentId, ShipmentStatus status, String location) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        
        shipmentService.addTrackingUpdate(shipment, status, location);
        return shipment;
    }
}
