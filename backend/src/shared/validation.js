const validateReport = (body) => {
  const errors = [];

  if (!body.title || body.title.trim() === '') {
    errors.push('Title is required');
  }

  if (body.title && body.title.length > 150) {
    errors.push('Title must be under 150 characters');
  }

  if (!body.description || body.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!body.latitude) {
    errors.push('Latitude is required');
  }

  if (!body.longitude) {
    errors.push('Longitude is required');
  }

  if (body.latitude && (body.latitude < -90 || body.latitude > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (body.longitude && (body.longitude < -180 || body.longitude > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }

  const validWasteTypes = [
    'plastic',
    'metal',
    'paper',
    'glass',
    'clothes',
    'other',
  ];

  if (body.waste_type && !validWasteTypes.includes(body.waste_type)) {
    errors.push(
      `waste_type must be one of: ${validWasteTypes.join(', ')}`
    );
  }

  return errors;
};

const validateComment = (body) => {
  const errors = [];

  if (!body.content || body.content.trim() === '') {
    errors.push('Comment content is required');
  }

  if (body.content && body.content.length > 500) {
    errors.push('Comment must be under 500 characters');
  }

  return errors;
};

module.exports = { validateReport, validateComment };