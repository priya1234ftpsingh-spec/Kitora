import Event from '../models/Event.js';
import Student from '../models/Student.js';
import { notifyAllStudents } from '../services/notificationService.js';

// @desc    Get all seminars & workshops
// @route   GET /api/events
// @access  Authenticated
export const getAllEvents = async (req, res, next) => {
  try {
    const { category = '', status = '', search = '' } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search.trim()) filter.title = new RegExp(search.trim(), 'i');

    const events = await Event.find(filter).sort({ date: 1 });

    let studentId = null;
    if (req.user && req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (student) studentId = student._id.toString();
    }

    const enhanced = events.map((ev) => {
      const obj = ev.toObject();
      obj.isRegistered = studentId
        ? (ev.registeredStudents || []).some((id) => id.toString() === studentId)
        : false;
      obj.registeredCount = ev.registeredStudents?.length || 0;
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: enhanced.length,
      events: enhanced,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Authenticated
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event (Student)
// @route   POST /api/events/:id/register
// @access  Private (Student)
export const registerForEvent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.registeredStudents.includes(student._id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this seminar/workshop' });
    }

    event.registeredStudents.push(student._id);
    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for seminar/workshop',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create seminar/workshop (TPO)
// @route   POST /api/events
// @access  Private (TPO)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      speaker,
      date,
      time,
      venue,
      mode,
      meetingLink,
      description,
      objectives,
      registrationInfo,
      instructions,
    } = req.body;

    if (!title || !description || !date || !speaker?.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide event title, speaker name, description and date',
      });
    }

    const event = await Event.create({
      title: title.trim(),
      category: category || 'Workshop',
      speaker: {
        name: speaker.name.trim(),
        designation: speaker.designation || 'Keynote Speaker',
        organization: speaker.organization || 'Industry Partner',
        avatar: speaker.avatar || '',
      },
      date,
      time: time || '02:00 PM - 04:30 PM',
      venue: venue || 'Auditorium Hall B',
      mode: mode || 'On-Campus',
      meetingLink: meetingLink || '',
      description: description.trim(),
      objectives: objectives || [],
      registrationInfo: registrationInfo || 'Open to all BCA and CS students',
      instructions: instructions || 'Carry college ID badge.',
      createdBy: req.user._id,
    });

    // Send broadcast notification
    await notifyAllStudents({
      type: 'Seminar',
      title: `New ${event.category}: ${event.title}`,
      message: `Join ${event.speaker.name} (${event.speaker.organization}) on ${new Date(date).toLocaleDateString()} for "${event.title}".`,
      link: '/student/seminars',
    });

    return res.status(201).json({
      success: true,
      message: 'Seminar / Workshop created successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update seminar/workshop (TPO)
// @route   PUT /api/events/:id
// @access  Private (TPO)
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete seminar/workshop (TPO)
// @route   DELETE /api/events/:id
// @access  Private (TPO)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
