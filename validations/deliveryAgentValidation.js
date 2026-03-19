const { z } = require('zod');

const preprocessRequiredString = (fieldName) =>
  z.preprocess(
    (val) => val ?? '',
    z.string({
      required_error: `${fieldName} is required`,
      invalid_type_error: `${fieldName} must be a string`
    }).min(1, `${fieldName} is required`)
  );

const deliveryAgentSchema = z.object({
  name: preprocessRequiredString('Name'),
  email: z.preprocess(
    (val) => val ?? '',
    z.string({required_error:"email is required"}).email('Invalid email')
  ),
  phone: z.preprocess(
    (val) => (val ? val : ''),
    z.string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number must be a string'
    }).regex(/^\d{10,}$/, 'Phone number must be at least 10 digits')
  ),
  password: z.preprocess(
    (val) => val ?? '',
    z.string().min(6, 'Password must be at least 6 characters')
  ),
  status: z.enum(['active', 'inactive']).optional(),
  vehicle_type: z.enum(['bike', 'car', 'van', 'truck', 'other']).optional(),
  vehicle_number: preprocessRequiredString('Vehicle Number'),
});

const deliveryAgentUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().regex(/^\d{10,}$/, 'Phone number must be at least 10 digits').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  status: z.enum(['active', 'inactive']).optional(),
  vehicle_type: z.enum(['bike', 'car', 'van', 'truck', 'other']).optional(),
  vehicle_number: z.string().optional(),
});

module.exports = { deliveryAgentSchema, deliveryAgentUpdateSchema };
