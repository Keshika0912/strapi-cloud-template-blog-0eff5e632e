'use strict';

/**
 * recipe router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::recipe.recipe', {
  config: {
    find: {
      auth: false, // Public access
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false, // Public access
      policies: [],
      middlewares: [],
    },
    create: {
      auth: false, // Public access
      policies: [],
      middlewares: [],
    },
    update: {
      auth: false, // Public access
      policies: [],
      middlewares: [],
    },
    delete: {
      auth: false, // Public access
      policies: [],
      middlewares: [],
    },
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
});
