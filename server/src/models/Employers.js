const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  employerName: { 
    type: String, 
    required: [true, 'Please provide employer name'],
    trim: true 
  },
  country: { 
    type: String, 
    required: [true, 'Please provide country'] 
  },
  contact: { 
    type: String, 
    required: [true, 'Please provide contact number'],
    validate: {
      validator: function(v) {
        // This regex allows: + at the start, numbers, spaces, dashes, and parentheses
        return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: { 
    type: String, 
    required: [true, 'Please provide address'] 
  },
  notes: { type: String },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Employer', EmployerSchema);