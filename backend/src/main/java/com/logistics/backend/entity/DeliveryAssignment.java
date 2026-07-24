package com.logistics.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_assignments")
public class DeliveryAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shipment_id", nullable = false)
    private Shipment shipment;

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = false)
    private DeliveryAgent deliveryAgent;

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;

    public DeliveryAssignment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Shipment getShipment() { return shipment; }
    public void setShipment(Shipment shipment) { this.shipment = shipment; }

    public DeliveryAgent getDeliveryAgent() { return deliveryAgent; }
    public void setDeliveryAgent(DeliveryAgent deliveryAgent) { this.deliveryAgent = deliveryAgent; }

    public LocalDateTime getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDateTime assignedDate) { this.assignedDate = assignedDate; }
}
