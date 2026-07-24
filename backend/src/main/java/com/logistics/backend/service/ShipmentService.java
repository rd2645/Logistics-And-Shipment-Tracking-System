package com.logistics.backend.service;

import com.logistics.backend.dto.CreateShipmentRequest;
import com.logistics.backend.dto.TrackShipmentResponse;
import com.logistics.backend.entity.Customer;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.ShipmentTracking;
import com.logistics.backend.entity.User;
import com.logistics.backend.enums.ShipmentStatus;
import com.logistics.backend.repository.CustomerRepository;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.repository.ShipmentTrackingRepository;
import com.logistics.backend.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private ShipmentTrackingRepository trackingRepository;

    public Shipment createShipment(CreateShipmentRequest request, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUserId(user.getId()).orElseGet(() -> {
            Customer newCustomer = new Customer();
            newCustomer.setUser(user);
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
    
    public List<Shipment> getCustomerShipments(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Customer customer = customerRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Customer not found"));
        return shipmentRepository.findByCustomerId(customer.getId());
    }

    public Shipment updateShipmentStatus(Long shipmentId, ShipmentStatus status, String location) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        
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
}
