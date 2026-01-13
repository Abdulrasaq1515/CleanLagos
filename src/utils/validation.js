const Joi = require('joi');

// User validation schemas
exports.registerSchema = Joi.object({
  phone: Joi.string().required().pattern(/^[0-9]{10,15}$/),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid('citizen', 'psp', 'recycler', 'lawma_admin', 'system_admin')
});

exports.wasteReportSchema = Joi.object({
  title: Joi.string().required().min(5).max(200),
  description: Joi.string().optional(),
  location: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required(),
  address: Joi.string().optional(),
  category: Joi.string().valid('household', 'industrial', 'construction', 'medical', 'recyclable', 'other').default('household'),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium')
});