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
        DeliveryAgent agent = agentRepository.findByUserId(userId).orElseGet(() -> {
            DeliveryAgent newAgent = new DeliveryAgent();
            newAgent.setUserId(userId);
            newAgent.setVehicleNumber("DEFAULT-VAN");
            newAgent.setAvailabilityStatus("AVAILABLE");
            return agentRepository.save(newAgent);
        });
        
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

    @jakarta.annotation.PostConstruct
    public void seedDeliveryAgents() {
        if (agentRepository.count() == 0) {
            DeliveryAgent agent1 = new DeliveryAgent();
            agent1.setUserId(2L); // Assume user ID 2 is an agent in .NET
            agent1.setVehicleNumber("MH-04-AB-1234");
            agent1.setAvailabilityStatus("AVAILABLE");
            agentRepository.save(agent1);

            DeliveryAgent agent2 = new DeliveryAgent();
            agent2.setUserId(3L); // Assume user ID 3 is an agent in .NET
            agent2.setVehicleNumber("DL-01-CD-5678");
            agent2.setAvailabilityStatus("AVAILABLE");
            agentRepository.save(agent2);

            System.out.println("✅ Seeded 2 default delivery agents into the database.");
        }
    }
}
