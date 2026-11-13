// Central API Service Client
const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('tnpsc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  if (options.body instanceof FormData) {
    // Let browser handle multipart boundary for FormData
    delete headers['Content-Type'];
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined)
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = (data && data.error) || (data && data.errors && data.errors[0]?.message) || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body }),

  // Group
  getCurrentGroup: () => request('/groups/current'),
  getMembers: (search = '') => request(`/groups/current/members${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getMemberProfile: (userId) => request(`/groups/current/members/${userId}`),
  joinGroup: (body) => request('/groups/join', { method: 'POST', body }),
  updateGroupSettings: (body) => request('/groups/current/settings', { method: 'PUT', body }),

  // Syllabus
  getExams: () => request('/syllabus/exams'),
  getExamSyllabus: (examId = 'default') => request(`/syllabus/exams/${examId}/syllabus`),
  getTopicDetails: (topicId) => request(`/syllabus/topics/${topicId}`),

  // Portions
  getMyPortions: () => request('/portions/me'),
  updateMyPortion: (topicId, body) => request(`/portions/me/${topicId}`, { method: 'PUT', body }),
  getMemberPortions: (userId) => request(`/portions/member/${userId}`),

  // Tests
  validateTestJson: (body) => request('/tests/validate', { method: 'POST', body }),
  createTest: (body, portionPdfFile = null) => {
    if (portionPdfFile) {
      const formData = new FormData();
      formData.append('testData', JSON.stringify(body));
      formData.append('portionPdf', portionPdfFile);
      return request('/tests', { method: 'POST', body: formData });
    }
    return request('/tests', { method: 'POST', body });
  },
  getTests: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/tests${q ? `?${q}` : ''}`);
  },
  getTestById: (testId) => request(`/tests/${testId}`),
  getPortionPdfUrl: (testId) => `/api/tests/${testId}/portion-pdf`,
  publishTest: (testId) => request(`/tests/${testId}/publish`, { method: 'POST' }),
  archiveTest: (testId) => request(`/tests/${testId}/archive`, { method: 'POST' }),
  getMyTests: () => request('/tests/my'),

  // Examination
  startAttempt: (testId) => request(`/exam/tests/${testId}/attempts`, { method: 'POST' }),
  getAttempt: (attemptId) => request(`/exam/attempts/${attemptId}`),
  saveAnswer: (attemptId, questionId, body) => request(`/exam/attempts/${attemptId}/answers/${questionId}`, { method: 'PUT', body }),
  submitAttempt: (attemptId) => request(`/exam/attempts/${attemptId}/submit`, { method: 'POST' }),
  getResult: (attemptId) => request(`/exam/attempts/${attemptId}/result`),

  // Progress & Learning
  getMyProgress: () => request('/progress/me'),
  getBookmarks: () => request('/progress/bookmarks'),
  toggleBookmark: (body) => request('/progress/bookmarks', { method: 'POST', body }),
  getRevisionList: () => request('/progress/revision'),

  // Materials
  getMaterials: (topicId = '') => request(`/materials${topicId ? `?topicId=${topicId}` : ''}`),
  uploadMaterial: (formData) => request('/materials', { method: 'POST', body: formData }),
  deleteMaterial: (materialId) => request(`/materials/${materialId}`, { method: 'DELETE' }),

  // Activity
  getRecentActivity: () => request('/activity')
};

