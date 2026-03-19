const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  vehicle_type: { type: String, enum: ['bike', 'car', 'van', 'truck', 'other'], default: 'bike' },
  vehicle_number: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

deliveryAgentSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('DeliveryAgent', deliveryAgentSchema);
