package com.logistics.backend.controller;

import com.logistics.backend.dto.UpdateStatusRequest;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.service.DeliveryAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/delivery")
@PreAuthorize("hasRole('DELIVERY_AGENT')")
public class DeliveryAgentController {

    @Autowired
    private DeliveryAgentService deliveryAgentService;

    @GetMapping("/assignments")
    public ResponseEntity<List<Shipment>> getAssignments(Authentication authentication) {
        return ResponseEntity.ok(deliveryAgentService.getAssignedShipments(Long.parseLong(authentication.getName())));
    }

    @PutMapping("/shipments/{id}/status")
    public ResponseEntity<Shipment> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(deliveryAgentService.updateShipmentStatus(id, request.getStatus(), request.getLocation()));
    }
}
