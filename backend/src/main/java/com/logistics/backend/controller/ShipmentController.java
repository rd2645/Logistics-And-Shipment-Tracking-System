package com.logistics.backend.controller;

import com.logistics.backend.dto.CreateShipmentRequest;
import com.logistics.backend.dto.TrackShipmentResponse;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.service.ShipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    @Autowired
    private ShipmentService shipmentService;

    @PostMapping
    public ResponseEntity<?> createShipment(@RequestBody CreateShipmentRequest request, Authentication authentication) {
        Shipment shipment = shipmentService.createShipment(request, Long.parseLong(authentication.getName()));
        return ResponseEntity.ok(shipment);
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<TrackShipmentResponse> trackShipment(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(shipmentService.trackShipment(trackingNumber));
    }

    @GetMapping("/my-shipments")
    public ResponseEntity<List<Shipment>> getMyShipments(Authentication authentication) {
        return ResponseEntity.ok(shipmentService.getCustomerShipments(Long.parseLong(authentication.getName())));
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<com.logistics.backend.entity.Feedback> rateShipment(@PathVariable Long id, @RequestBody com.logistics.backend.dto.RateRequest request) {
        return ResponseEntity.ok(shipmentService.rateShipment(id, request));
    }
}
