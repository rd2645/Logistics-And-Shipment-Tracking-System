package com.logistics.backend.dto;

public class AssignAgentRequest {
    private Long shipmentId;
    private Long agentId;

    public Long getShipmentId() { return shipmentId; }
    public void setShipmentId(Long shipmentId) { this.shipmentId = shipmentId; }

    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
}
