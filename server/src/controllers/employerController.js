const Employer = require('../models/Employers');
const { StatusCodes } = require('http-status-codes');

exports.getEmployers = async (req, res) => {
  try {
    if (!req.user || !req.user.companyId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: "Company ID is missing from your session."
      });
    }

    // Updated: Added .populate() to get the name of the creator
    const employers = await Employer.find({ companyId: req.user.companyId })
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      success: true,
      count: employers.length,
      data: employers,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
};

// createEmployer remains largely the same, but ensure it returns data
// that can be handled by the frontend immediately
exports.createEmployer = async (req, res) => {
  try {
    const { employerName, country, contact, address, notes } = req.body;

    const newEmployer = await Employer.create({
      employerName,
      country,
      contact,
      address,
      notes,
      createdBy: req.user.userId,
      companyId: req.user.companyId
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: newEmployer,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: error.message,
    });
  }
};