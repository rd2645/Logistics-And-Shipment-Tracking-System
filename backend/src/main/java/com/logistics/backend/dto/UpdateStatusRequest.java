package com.logistics.backend.dto;

import com.logistics.backend.enums.ShipmentStatus;

public class UpdateStatusRequest {
    private ShipmentStatus status;
    private String location;

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
