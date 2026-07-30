  package com.logistics.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_name", nullable = false, length = 100)
    private String warehouseName;

    @Column(length = 50)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(nullable = false, columnDefinition = "int default 100")
    private Integer capacity = 100;

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer currentLoad = 0;

    public Warehouse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentLoad() { return currentLoad; }
    public void setCurrentLoad(Integer currentLoad) { this.currentLoad = currentLoad; }
}
