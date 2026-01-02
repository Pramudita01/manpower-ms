const Worker = require('../models/Worker');
const mongoose = require('mongoose');

exports.addWorker = async (req, res) => {
  try {
    const { passportNumber, dob, country, status, currentStage, employerId, jobDemandId, subAgentId, notes } = req.body;

    // 1. Authentication Check
    const creatorId = req.user.userId;
    const companyId = req.user.companyId;

    if (!creatorId || !companyId) {
      return res.status(401).json({ success: false, message: 'Authentication failed.' });
    }

    // 2. Duplicate Check
    const existingWorker = await Worker.findOne({ passportNumber });
    if (existingWorker) {
      return res.status(400).json({ success: false, message: 'Passport number already registered.' });
    }

    // 3. Handle Categorized Documents
    // We expect req.body.documentMetadata to be a stringified array from the frontend
    let documentFiles = [];
    if (req.files && req.files.length > 0) {
      const metadata = req.body.documentMetadata ? JSON.parse(req.body.documentMetadata) : [];
      
      documentFiles = req.files.map((file, index) => ({
        category: metadata[index]?.category || 'other',
        name: metadata[index]?.name || file.originalname,
        fileName: file.originalname,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        fileUrl: file.path, // Path from Multer
        uploadedAt: new Date(),
        status: 'pending'
      }));
    }

    // 4. Detailed Stage Timeline (11 Stages)
    const detailedTimeline = [
      { stage: 'document-collection', status: 'in-progress' },
      { stage: 'document-verification', status: 'pending' },
      { stage: 'interview', status: 'pending' },
      { stage: 'medical-examination', status: 'pending' },
      { stage: 'police-clearance', status: 'pending' },
      { stage: 'training', status: 'pending' },
      { stage: 'visa-application', status: 'pending' },
      { stage: 'visa-approval', status: 'pending' },
      { stage: 'ticket-booking', status: 'pending' },
      { stage: 'pre-departure-orientation', status: 'pending' },
      { stage: 'deployed', status: 'pending' },
    ];

    // 5. Create Worker
    const newWorker = new Worker({
      name: req.body.name,
      dob: dob ? new Date(dob) : null,
      passportNumber,
      contact: req.body.contact,
      address: req.body.address,
      country: country || 'Nepal',
      status: status || 'pending',
      currentStage: currentStage || 'document-collection',
      notes,
      
      // Relationship IDs
      employerId: employerId ? new mongoose.Types.ObjectId(employerId) : null,
      jobDemandId: jobDemandId ? new mongoose.Types.ObjectId(jobDemandId) : null,
      subAgentId: subAgentId ? new mongoose.Types.ObjectId(subAgentId) : null,
      
      // Categorized Data
      documents: documentFiles,
      stageTimeline: detailedTimeline,
      
      // Ownership
      createdBy: new mongoose.Types.ObjectId(creatorId),
      companyId: new mongoose.Types.ObjectId(companyId),
      assignedTo: new mongoose.Types.ObjectId(creatorId)
    });

    await newWorker.save();
    res.status(201).json({ success: true, data: newWorker });

  } catch (error) {
    console.error("Add Worker Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate('employerId', 'name employerName companyName') // Added companyName just in case
      .populate('subAgentId', 'name agentName')
      .populate('jobDemandId', 'title jobTitle')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: workers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.body.dob) updateData.dob = new Date(req.body.dob);

    const updatedWorker = await Worker.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('employerId', 'name employerName companyName');

    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    res.status(200).json({ success: true, data: updatedWorker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// RUN THIS ONCE TO CLEAN UP OLD DATA
exports.fixWorkerData = async (req, res) => {
  try {
    const workers = await Worker.find({});
    let updatedCount = 0;

    for (let worker of workers) {
      // Use findByIdAndUpdate to bypass the full .save() validation if needed
      await Worker.findByIdAndUpdate(worker._id, {
        createdBy: new mongoose.Types.ObjectId(worker.createdBy),
        companyId: new mongoose.Types.ObjectId(worker.companyId),
        assignedTo: worker.assignedTo ? new mongoose.Types.ObjectId(worker.assignedTo) : worker.createdBy
      });
      updatedCount++;
    }

    res.status(200).json({
      success: true,
      msg: `Successfully converted ${updatedCount} workers to ObjectId format.`
    });
  } catch (error) {
    console.error("Fix Data Error:", error);
    res.status(500).json({ error: error.message });
  }
};