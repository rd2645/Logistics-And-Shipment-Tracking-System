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

        if (warehouse.getCurrentLoad() != null && warehouse.getCapacity() != null) {
            if (warehouse.getCurrentLoad() >= warehouse.getCapacity()) {
                throw new RuntimeException("Warehouse is at full capacity!");
            }
            warehouse.setCurrentLoad(warehouse.getCurrentLoad() + 1);
            warehouseRepository.save(warehouse);
        }

        shipment.setCurrentWarehouse(warehouse);
        shipmentService.addTrackingUpdate(shipment, ShipmentStatus.IN_WAREHOUSE, warehouse.getWarehouseName() + ", " + warehouse.getCity());
        
        return shipmentRepository.save(shipment);
    }

    @jakarta.annotation.PostConstruct
    public void seedWarehouses() {
        if (warehouseRepository.count() == 0) {
            Warehouse w1 = new Warehouse();
            w1.setWarehouseName("Mumbai Central Hub");
            w1.setCity("Mumbai");
            w1.setState("Maharashtra");
            w1.setCapacity(1000);
            w1.setCurrentLoad(450);
            warehouseRepository.save(w1);

            Warehouse w2 = new Warehouse();
            w2.setWarehouseName("Delhi North Depot");
            w2.setCity("New Delhi");
            w2.setState("Delhi");
            w2.setCapacity(800);
            w2.setCurrentLoad(200);
            warehouseRepository.save(w2);

            Warehouse w3 = new Warehouse();
            w3.setWarehouseName("Bangalore Tech Park");
            w3.setCity("Bangalore");
            w3.setState("Karnataka");
            w3.setCapacity(500);
            w3.setCurrentLoad(150);
            warehouseRepository.save(w3);
            
            System.out.println("✅ Seeded 3 default warehouses into the database.");
        }
    }
}
