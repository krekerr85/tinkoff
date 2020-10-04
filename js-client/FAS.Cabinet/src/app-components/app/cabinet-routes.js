import courses from '../courses';
import myCourses from '../my-courses';
import support from '../support';
import course from '../course';
import courseLesson from '../course-lesson';
import courseExam from '../course-exam';
import notFound from '../not-found';
import userProfile from '../user-profile';
import userActivation from '../login/user-activation';
import userPasswordRestore from '../login/user-password-restore';
import myCertificates from '../my-certificates';
import purchaseHistory from '../purchase-history';
import goodsCollection from '../goods-collection';

/** Меню в кабинете*/
export const toolboxItems = [{
  url: '/cabinet/myCourses',
  name: 'myCourses',
  icon: 'icon-dollar',
  label: 'Мои курсы',
  component: myCourses,
}, {
  url: '/cabinet/courses',
  name: 'courses',
  icon: 'icon-graduation-cap',
  label: 'Все курсы',
  component: courses,
}, {
  url: '/cabinet/myCertificates',
  name: 'myCertificates',
  icon: 'icon-list-alt',
  label: 'Сертификаты',
  component: myCertificates,
}, {
  url: '/cabinet/shop',
  name: 'shop',
  icon: 'icon-shopping-basket',
  label: 'Магазин',
  component: goodsCollection,
},{
  url: '/cabinet/support',
  name: 'support',
  icon: 'icon-comment',
  label: 'Техподдержка',
  component: support,
}];

/** Пути, на которые можно перейти с самого кабинета*/
export const cabinetRoutes = [...toolboxItems.map(t => ({
  path: t.url,
  name: t.name,
  component: t.component
})), {
  path: '/cabinet',
  name: 'default',
  component: toolboxItems[0].component
}, {
  path: '*',
  name: 'not-found',
  component: notFound
}];

const otherRoutes = [{
  path: '/cabinet/course/:name',
  name: 'single-course',
  component: course
},{
  path: '/cabinet/course/:courseName/lesson/:lessonIndex',
  name: 'single-lesson',
  component: courseLesson
},{
  path: '/cabinet/profile',
  name: 'user-profile',
  component: userProfile
},{
  path: '/cabinet/course/:courseName/exam',
  name: 'course-exam',
  component: courseExam
},{
  path: '/cabinet/activation/:userId',
  name: 'user-activation',
  component: userActivation
},{
  path: '/cabinet/passwordRestore/:restoreCode',
  name: 'user-password-restore',
  component: userPasswordRestore
},{
  path: '/cabinet/history/',
  name: 'purchase-history',
  component: purchaseHistory
}];

/** Все пути кабинета (в том числе вложенные)*/
export default [...cabinetRoutes, ...otherRoutes];
