package com.logistics.backend.dto;

import java.math.BigDecimal;

public class AdminAnalyticsResponse {
    private long totalShipments;
    private long activeDeliveries;
    private BigDecimal estimatedRevenue;

    public AdminAnalyticsResponse(long totalShipments, long activeDeliveries, BigDecimal estimatedRevenue) {
        this.totalShipments = totalShipments;
        this.activeDeliveries = activeDeliveries;
        this.estimatedRevenue = estimatedRevenue;
    }

    public long getTotalShipments() {
        return totalShipments;
    }

    public void setTotalShipments(long totalShipments) {
        this.totalShipments = totalShipments;
    }

    public long getActiveDeliveries() {
        return activeDeliveries;
    }

    public void setActiveDeliveries(long activeDeliveries) {
        this.activeDeliveries = activeDeliveries;
    }

    public BigDecimal getEstimatedRevenue() {
        return estimatedRevenue;
    }

    public void setEstimatedRevenue(BigDecimal estimatedRevenue) {
        this.estimatedRevenue = estimatedRevenue;
    }
}
