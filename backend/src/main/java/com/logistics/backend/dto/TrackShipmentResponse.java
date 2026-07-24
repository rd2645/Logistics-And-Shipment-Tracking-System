package com.logistics.backend.dto;

import java.time.LocalDateTime;

public class TrackShipmentResponse {
    private String trackingNumber;
    private String currentStatus;
    private String currentLocation;
    private LocalDateTime lastUpdate;

    public TrackShipmentResponse(String trackingNumber, String currentStatus, String currentLocation, LocalDateTime lastUpdate) {
        this.trackingNumber = trackingNumber;
        this.currentStatus = currentStatus;
        this.currentLocation = currentLocation;
        this.lastUpdate = lastUpdate;
    }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public String getCurrentLocation() { return currentLocation; }
    public void setCurrentLocation(String currentLocation) { this.currentLocation = currentLocation; }

    public LocalDateTime getLastUpdate() { return lastUpdate; }
    public void setLastUpdate(LocalDateTime lastUpdate) { this.lastUpdate = lastUpdate; }
}
