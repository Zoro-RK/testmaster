/**
 * Validates a test JSON payload against schemaVersion "1.0"
 * as defined in plan.md Section 5.3 and 5.4.
 */

function validateTestSchema(data) {
  const errors = [];
  const warnings = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: [{ field: 'root', message: 'Payload must be a valid JSON object.' }],
      warnings: []
    };
  }

  // 1. Schema version
  if (!data.schemaVersion) {
    errors.push({ field: 'schemaVersion', message: 'Missing required "schemaVersion" field.' });
  } else if (data.schemaVersion !== '1.0') {
    errors.push({ 
      field: 'schemaVersion', 
      message: `Unsupported schema version "${data.schemaVersion}". Only version "1.0" is supported.` 
    });
  }

  // 2. Metadata
  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    errors.push({ field: 'title', message: 'Test "title" is required and cannot be empty.' });
  }

  if (!data.questionCount || typeof data.questionCount !== 'number' || data.questionCount <= 0) {
    errors.push({ field: 'questionCount', message: '"questionCount" must be a positive integer.' });
  }

  if (!data.durationMinutes || typeof data.durationMinutes !== 'number' || data.durationMinutes <= 0) {
    errors.push({ field: 'durationMinutes', message: '"durationMinutes" must be a positive integer.' });
  }

  if (!data.language || typeof data.language !== 'string') {
    warnings.push({ field: 'language', message: 'Test "language" not specified. Defaulting to English.' });
  }

  // 3. Questions array
  if (!Array.isArray(data.questions)) {
    errors.push({ field: 'questions', message: '"questions" must be an array of question objects.' });
    return { isValid: errors.length === 0, errors, warnings };
  }

  if (data.questionCount && data.questions.length !== data.questionCount) {
    errors.push({
      field: 'questionCount',
      message: `Declared questionCount (${data.questionCount}) does not match actual questions array count (${data.questions.length}).`
    });
  }

  const seenIds = new Set();
  const seenTexts = new Set();

  data.questions.forEach((q, index) => {
    const qNum = index + 1;
    const prefix = `Question #${qNum}`;

    if (!q || typeof q !== 'object') {
      errors.push({ field: `questions[${index}]`, message: `${prefix} is not a valid object.` });
      return;
    }

    // Question ID
    if (!q.id || typeof q.id !== 'string' || !q.id.trim()) {
      errors.push({ field: `questions[${index}].id`, message: `${prefix} is missing a unique string "id".` });
    } else {
      if (seenIds.has(q.id)) {
        errors.push({ field: `questions[${index}].id`, message: `${prefix} has duplicate ID "${q.id}".` });
      }
      seenIds.add(q.id);
    }

    // Question Text
    if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
      errors.push({ field: `questions[${index}].question`, message: `${prefix} question text cannot be empty.` });
    } else {
      const normalizedText = q.question.trim().toLowerCase();
      if (seenTexts.has(normalizedText)) {
        warnings.push({
          field: `questions[${index}].question`,
          message: `${prefix} has identical or near-duplicate question text as an earlier question.`
        });
      }
      seenTexts.add(normalizedText);
    }

    // Options (exactly 4 with keys A, B, C, D)
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push({
        field: `questions[${index}].options`,
        message: `${prefix} must have exactly 4 options.`
      });
    } else {
      const optionKeys = new Set();
      q.options.forEach((opt, optIndex) => {
        if (!opt || typeof opt !== 'object') {
          errors.push({ field: `questions[${index}].options[${optIndex}]`, message: `${prefix} option ${optIndex + 1} is invalid.` });
          return;
        }
        if (!opt.key || !['A', 'B', 'C', 'D'].includes(opt.key)) {
          errors.push({
            field: `questions[${index}].options[${optIndex}].key`,
            message: `${prefix} option has invalid key "${opt.key}". Must be A, B, C, or D.`
          });
        } else {
          if (optionKeys.has(opt.key)) {
            errors.push({
              field: `questions[${index}].options[${optIndex}].key`,
              message: `${prefix} has duplicate option key "${opt.key}".`
            });
          }
          optionKeys.add(opt.key);
        }

        if (!opt.text || typeof opt.text !== 'string' || !opt.text.trim()) {
          errors.push({
            field: `questions[${index}].options[${optIndex}].text`,
            message: `${prefix} option ${opt.key || optIndex + 1} text cannot be empty.`
          });
        }
      });
    }

    // Correct Answer
    if (!q.correctAnswer || !['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      errors.push({
        field: `questions[${index}].correctAnswer`,
        message: `${prefix} "correctAnswer" must be one of: "A", "B", "C", "D".`
      });
    }

    // Explanation
    if (!q.explanation || typeof q.explanation !== 'string' || !q.explanation.trim()) {
      warnings.push({
        field: `questions[${index}].explanation`,
        message: `${prefix} has no explanation provided. Explanations help study circle members learn.`
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      questionCount: data.questions ? data.questions.length : 0,
      declaredCount: data.questionCount || 0,
      title: data.title || 'Untitled',
      durationMinutes: data.durationMinutes || 0
    }
  };
}

module.exports = {
  validateTestSchema
};

