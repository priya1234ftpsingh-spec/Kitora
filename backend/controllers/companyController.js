import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public / Authenticated
export const getAllCompanies = async (req, res, next) => {
  try {
    const { search = '', industry = '', isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (industry) filter.industry = industry;
    if (search.trim()) filter.name = new RegExp(search.trim(), 'i');

    const companies = await Company.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public / Authenticated
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const drives = await PlacementDrive.find({ company: company._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      company,
      drives,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company (TPO)
// @route   POST /api/companies
// @access  Private (TPO)
export const createCompany = async (req, res, next) => {
  try {
    const { name, logo, description, website, industry, location, contactEmail, contactPhone } = req.body;

    if (!name || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Company name and industry are required',
      });
    }

    const existing = await Company.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A company with this name already exists',
      });
    }

    const company = await Company.create({
      name: name.trim(),
      logo: logo || '',
      description: description || '',
      website: website || '',
      industry: industry.trim(),
      location: location || 'Pan India',
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Company added successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company (TPO)
// @route   PUT /api/companies/:id
// @access  Private (TPO)
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate company (TPO)
// @route   DELETE /api/companies/:id
// @access  Private (TPO)
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check if drives exist
    const driveCount = await PlacementDrive.countDocuments({ company: company._id });
    if (driveCount > 0) {
      // Deactivate rather than delete to maintain relational integrity
      company.isActive = false;
      await company.save();
      return res.status(200).json({
        success: true,
        message: 'Company has associated drives, so it has been deactivated rather than deleted.',
      });
    }

    await Company.findByIdAndDelete(company._id);
    return res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
