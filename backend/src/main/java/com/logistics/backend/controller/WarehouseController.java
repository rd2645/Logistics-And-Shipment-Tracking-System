package com.logistics.backend.controller;

import com.logistics.backend.dto.UpdateStatusRequest;
import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.Warehouse;
import com.logistics.backend.service.ShipmentService;
import com.logistics.backend.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/warehouse")
@PreAuthorize("hasRole('WAREHOUSE_MANAGER')")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    @Autowired
    private ShipmentService shipmentService;

    @GetMapping("/shipments")
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(warehouseService.getAllShipments());
    }

    @GetMapping("/list")
    public ResponseEntity<List<Warehouse>> getWarehouses() {
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }

    @PutMapping("/shipments/{id}/accept/{warehouseId}")
    public ResponseEntity<Shipment> acceptShipment(@PathVariable Long id, @PathVariable Long warehouseId) {
        return ResponseEntity.ok(warehouseService.acceptShipment(id, warehouseId));
    }

    @PutMapping("/shipments/{id}/status")
    public ResponseEntity<Shipment> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, request.getStatus(), request.getLocation()));
    }
}
