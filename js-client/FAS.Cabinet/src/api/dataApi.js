import {fetchApi, fetchJson} from "./commonApi";

export default {
  login: (data) => {
    return fetchApi('/api/Authentication/SignIn', data, 'Post');
  },

  logout: () => {
    return fetchApi('/api/Authentication/SignOut');
  },

  register: (data) => {
    return fetchApi('/api/Register', data, 'Post');
  },

  activation: (userId) => {
    return fetchApi('/api/Activation/' + userId);
  },

  passwordRestore: (restoreCode) => {
    return fetchApi('/api/passwordRestore/' + restoreCode);
  },

  changePassword: (data) => {
    return fetchApi('/api/user/changePassword/', data, 'Post');
  },

  getCourses: () => {
    return fetchJson('/api/courses');
  },

  getMyCourses: () => {
    return fetchJson('/api/courses/my');
  },

  getMyCertificates: () => {
    return fetchJson('/api/userCertificate');
  },

  postCertificate: (certificate) =>{
    return fetchApi(`/api/userCertificate`, certificate, 'Post');
  },

  getCourse: (name) => {
    return fetchJson('/api/course/' + name);
  },

  getLesson: (course, lesson) => {
    return fetchJson(`/api/course/${course}/lesson/${lesson}`);
  },

  getUserInfo: () => {
    return fetchJson(`/api/user`);
  },

  setUserInfo: (user) => {
    return fetchJson(`/api/user`, user, 'Post');
  },

  completeLesson: (course, questionId, answer) => {
    return fetchJson(`/api/course/${course}/lesson/current`, {questionId: questionId, answerIndex: answer}, 'Post');
  },

  getExam: (course) => {
    return fetchJson(`/api/course/${course}/exam`);
  },

  passExam: (course, answers) => {
    return fetchJson(`/api/course/${course}/exam`, answers, 'Post');
  },

  getCourseCost: (courseId) => {
    return fetchJson(`/api/payment/courseCost/${courseId}`);
  },

  buyCourse: (data) => {
    return fetchJson(`/api/payment/buyCourse`, data, 'Post');
  },

  buyGoods: (data) => {
    return fetchJson(`/api/payment/buyGoods`, data, 'Post');
  },

  getHistory: () => {
    return fetchJson(`/api/purchaseHistory`);
  },

  getGoodsCollection: () => {
    return fetchJson(`/api/goods`);
  },

  getTechSupportMessages: (skip, take) => {
    return fetchJson(`/api/support/messages?skip=${skip}&take=${take}`);
  },

  createTechSupportMessages: (text) => {
    return fetchJson(`/api/support/`, {text}, 'Post');
  },

  createReview: (data) => {
    return fetchJson(`/api/reviews/create`, data, 'Post');
  },

  getCertificatesCost: (courseName) => {
    return fetchJson(`/api/payment/getCertificatesCost/${courseName}`);
  },

  buyCertificates: (data) => {
    return fetchJson(`/api/payment/buyCertificates`, data, 'Post');
  },
}
