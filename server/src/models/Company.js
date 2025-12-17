// D:\manpower-ms\server\models\Company.js

const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    // The unique name of the manpower company (tenant identifier)
    name: {
        type: String,
        required: [true, 'Please provide a company name'],
        unique: true,
        trim: true,
    },
    // The ID of the primary administrator for this company
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Tracking when the company was created
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Company', CompanySchema);