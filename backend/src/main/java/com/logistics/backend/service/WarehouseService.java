package com.logistics.backend.service;

import com.logistics.backend.entity.Shipment;
import com.logistics.backend.entity.Warehouse;
import com.logistics.backend.enums.ShipmentStatus;
import com.logistics.backend.repository.ShipmentRepository;
import com.logistics.backend.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private ShipmentService shipmentService;

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Shipment acceptShipment(Long shipmentId, Long warehouseId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        shipment.setCurrentWarehouse(warehouse);
        shipmentService.addTrackingUpdate(shipment, ShipmentStatus.IN_WAREHOUSE, warehouse.getWarehouseName() + ", " + warehouse.getCity());
        
        return shipmentRepository.save(shipment);
    }
}
