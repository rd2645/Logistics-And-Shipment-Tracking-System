package com.logistics.backend.service;

import com.logistics.backend.dto.CreateShipmentRequest;
import com.logistics.backend.dto.TrackShipmentResponse;
import com.logistics.backend.entity.Customer;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.ShipmentTracking;
import com.logistics.backend.enums.ShipmentStatus;
import com.logistics.backend.repository.CustomerRepository;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.repository.ShipmentTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ShipmentTrackingRepository trackingRepository;

    public Shipment createShipment(CreateShipmentRequest request, Long userId) {
        Customer customer = customerRepository.findByUserId(userId).orElseGet(() -> {
            Customer newCustomer = new Customer();
            newCustomer.setUserId(userId);
            newCustomer.setAddress(request.getPickupAddress());
            return customerRepository.save(newCustomer);
        });

        Shipment shipment = new Shipment();
        shipment.setTrackingNumber("TRK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        shipment.setCustomer(customer);
        shipment.setSenderName(request.getSenderName());
        shipment.setReceiverName(request.getReceiverName());
        shipment.setPickupAddress(request.getPickupAddress());
        shipment.setDeliveryAddress(request.getDeliveryAddress());
        shipment.setWeight(request.getWeight());
        shipment.setShipmentType(request.getShipmentType());
        
        shipment.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD");
        shipment.setPaymentStatus(shipment.getPaymentMethod().equals("ONLINE") ? "COMPLETED" : "PENDING");
        
        shipment.setStatus(ShipmentStatus.PENDING);
        shipment.setCreatedAt(LocalDateTime.now());

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Add initial tracking
        addTrackingUpdate(savedShipment, ShipmentStatus.PENDING, "Order Created");

        return savedShipment;
    }

    public TrackShipmentResponse trackShipment(String trackingNumber) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        List<ShipmentTracking> trackingList = trackingRepository.findByShipmentIdOrderByUpdateTimeDesc(shipment.getId());
        String location = trackingList.isEmpty() ? "Unknown" : trackingList.get(0).getLocation();
        LocalDateTime updateTime = trackingList.isEmpty() ? shipment.getCreatedAt() : trackingList.get(0).getUpdateTime();

        return new TrackShipmentResponse(
                shipment.getTrackingNumber(),
                shipment.getStatus().name(),
                location,
                updateTime
        );
    }
    
    public List<Shipment> getCustomerShipments(Long userId) {
        Customer customer = customerRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Customer not found"));
        return shipmentRepository.findByCustomerId(customer.getId());
    }

    @Autowired
    private com.logistics.backend.repository.WarehouseRepository warehouseRepository;

    public Shipment updateShipmentStatus(Long shipmentId, ShipmentStatus status, String location) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        
        if (shipment.getStatus() == ShipmentStatus.IN_WAREHOUSE && status != ShipmentStatus.IN_WAREHOUSE) {
            com.logistics.backend.entity.Warehouse w = shipment.getCurrentWarehouse();
            if (w != null && w.getCurrentLoad() != null && w.getCurrentLoad() > 0) {
                w.setCurrentLoad(w.getCurrentLoad() - 1);
                warehouseRepository.save(w);
            }
        }
        
        addTrackingUpdate(shipment, status, location);
        return shipment;
    }

    public void addTrackingUpdate(Shipment shipment, ShipmentStatus status, String location) {
        ShipmentTracking tracking = new ShipmentTracking();
        tracking.setShipment(shipment);
        tracking.setStatus(status);
        tracking.setLocation(location);
        tracking.setUpdateTime(LocalDateTime.now());
        trackingRepository.save(tracking);
        
        shipment.setStatus(status);
        shipmentRepository.save(shipment);
    }

    @Autowired
    private com.logistics.backend.repository.FeedbackRepository feedbackRepository;
    @Autowired
    private com.logistics.backend.repository.DeliveryAssignmentRepository assignmentRepository;

    public com.logistics.backend.entity.Feedback rateShipment(Long shipmentId, com.logistics.backend.dto.RateRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        
        if (shipment.getStatus() != ShipmentStatus.DELIVERED) {
            throw new RuntimeException("Can only rate delivered shipments.");
        }

        com.logistics.backend.entity.DeliveryAssignment assignment = assignmentRepository.findByShipmentId(shipmentId).orElse(null);

        com.logistics.backend.entity.Feedback feedback = new com.logistics.backend.entity.Feedback();
        feedback.setShipment(shipment);
        if (assignment != null) {
            feedback.setDeliveryAgent(assignment.getDeliveryAgent());
        }
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }
}
