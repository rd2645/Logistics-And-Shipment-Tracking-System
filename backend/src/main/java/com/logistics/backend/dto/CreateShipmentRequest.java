package com.logistics.backend.dto;

import java.math.BigDecimal;

public class CreateShipmentRequest {
    private String senderName;
    private String receiverName;
    private String pickupAddress;
    private String deliveryAddress;
    private BigDecimal weight;
    private String shipmentType;
    private String paymentMethod; // "ONLINE" or "COD"

    // Getters and Setters
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public String getShipmentType() { return shipmentType; }
    public void setShipmentType(String shipmentType) { this.shipmentType = shipmentType; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
