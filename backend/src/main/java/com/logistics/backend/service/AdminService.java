package com.logistics.backend.service;

import com.logistics.backend.dto.AssignAgentRequest;
import com.logistics.backend.entity.DeliveryAgent;
import com.logistics.backend.entity.DeliveryAssignment;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.User;
import com.logistics.backend.enums.ShipmentStatus;
import com.logistics.backend.repository.DeliveryAgentRepository;
import com.logistics.backend.repository.DeliveryAssignmentRepository;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    @Autowired
    private DeliveryAssignmentRepository deliveryAssignmentRepository;
    
    @Autowired
    private ShipmentService shipmentService;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public DeliveryAssignment assignDeliveryAgent(AssignAgentRequest request) {
        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
                
        DeliveryAgent agent = deliveryAgentRepository.findById(request.getAgentId())
                .orElseThrow(() -> new RuntimeException("Delivery Agent not found"));

        DeliveryAssignment assignment = new DeliveryAssignment();
        assignment.setShipment(shipment);
        assignment.setDeliveryAgent(agent);
        assignment.setAssignedDate(LocalDateTime.now());
        
        // Update shipment status if needed
        if (shipment.getStatus() == ShipmentStatus.IN_WAREHOUSE || shipment.getStatus() == ShipmentStatus.PENDING) {
            shipmentService.addTrackingUpdate(shipment, ShipmentStatus.OUT_FOR_DELIVERY, "Assigned to Agent: " + agent.getUser().getName());
        }

        return deliveryAssignmentRepository.save(assignment);
    }
}
