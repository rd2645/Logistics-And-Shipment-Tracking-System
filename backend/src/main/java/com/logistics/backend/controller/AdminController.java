package com.logistics.backend.controller;

import com.logistics.backend.dto.AssignAgentRequest;
import com.logistics.backend.entity.DeliveryAssignment;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/shipments")
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(adminService.getAllShipments());
    }

    @PostMapping("/assign-agent")
    public ResponseEntity<DeliveryAssignment> assignAgent(@RequestBody AssignAgentRequest request) {
        return ResponseEntity.ok(adminService.assignDeliveryAgent(request));
    }

    @GetMapping("/analytics")
    public ResponseEntity<com.logistics.backend.dto.AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
