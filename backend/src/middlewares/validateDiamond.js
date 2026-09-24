const REQUIRED_FIELDS = [
  'carat',
  'cut',
  'color',
  'clarity',
  'depth',
  'table',
  'x',
  'y',
  'z'
];

const NUMERIC_FIELDS = ['carat', 'depth', 'table', 'x', 'y', 'z'];
const ALLOWED_VALUES = {
  cut: ['Fair', 'Good', 'Very Good', 'Premium', 'Ideal'],
  color: ['D', 'E', 'F', 'G', 'H', 'I', 'J'],
  clarity: ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF']
};

function validateDiamond(req, res, next) {
  const input = req.body;

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return res.status(400).json({
      message: 'Dữ liệu đầu vào phải là một JSON object',
      request_id: req.requestId
    });
  }

  const inputFields = Object.keys(input);
  const missingFields = REQUIRED_FIELDS.filter((field) => !(field in input));
  const unexpectedFields = inputFields.filter(
    (field) => !REQUIRED_FIELDS.includes(field)
  );

  if (missingFields.length > 0 || unexpectedFields.length > 0) {
    const details = [];
    if (missingFields.length > 0) {
      details.push(`thiếu trường: ${missingFields.join(', ')}`);
    }
    if (unexpectedFields.length > 0) {
      details.push(`trường không hợp lệ: ${unexpectedFields.join(', ')}`);
    }
    return res.status(400).json({
      message: `Dữ liệu đầu vào không hợp lệ (${details.join('; ')})`,
      request_id: req.requestId
    });
  }

  for (const field of NUMERIC_FIELDS) {
    if (
      typeof input[field] !== 'number' ||
      !Number.isFinite(input[field]) ||
      input[field] <= 0
    ) {
      return res.status(400).json({
        message: `${field} phải là số lớn hơn 0`,
        request_id: req.requestId
      });
    }
  }

  for (const [field, allowedValues] of Object.entries(ALLOWED_VALUES)) {
    if (typeof input[field] !== 'string' || !allowedValues.includes(input[field])) {
      return res.status(400).json({
        message: `${field} phải thuộc một trong các giá trị: ${allowedValues.join(', ')}`,
        request_id: req.requestId
      });
    }
  }

  next();
}

module.exports = validateDiamond;
