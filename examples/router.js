/* eslint-disable import/no-extraneous-dependencies */

import Vue from 'vue';
import Router from 'vue-router';
import pages from './pages';

Vue.use(Router);

const routes = pages.map((page) => {
  const { name } = page;

  return {
    path: `/${name}`,
    name,
    component: page,
  };
});

routes.push({
  path: '*',
  redirect: '/demo-basic',
});

export default new Router({ routes });
