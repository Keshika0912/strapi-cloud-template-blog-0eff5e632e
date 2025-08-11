'use strict';

/**
 * recipe controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recipe.recipe', ({ strapi }) => ({
  // Find all recipes with pagination and filtering
  async find(ctx) {
    try {
      const { query } = ctx;
      
      // Build filters
      const filters = {};
      if (query.type) filters.type = query.type;
      if (query.title) filters.title = { $containsi: query.title };
      
      // Build sort options
      const sort = query.sort || 'createdAt:desc';
      
      // Build pagination
      const page = parseInt(query.page) || 1;
      const pageSize = Math.min(parseInt(query.pageSize) || 25, 100);
      const start = (page - 1) * pageSize;
      
      const results = await strapi.entityService.findMany('api::recipe.recipe', {
        filters,
        sort,
        start,
        limit: pageSize,
        populate: {
          cover_Image: true,
          ingredients_array: true,
          steps: true,
        },
      });
      
      const total = await strapi.entityService.count('api::recipe.recipe', { filters });
      
      return {
        data: results,
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
            total,
          },
        },
      };
    } catch (error) {
      ctx.throw(500, 'Error fetching recipes');
    }
  },

  // Find one recipe by ID
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const recipe = await strapi.entityService.findOne('api::recipe.recipe', id, {
        populate: {
          cover_Image: true,
          ingredients_array: true,
          steps: true,
        },
      });
      
      if (!recipe) {
        return ctx.notFound('Recipe not found');
      }
      
      return { data: recipe };
    } catch (error) {
      ctx.throw(500, 'Error fetching recipe');
    }
  },

  // Create a new recipe
  async create(ctx) {
    try {
      const { body } = ctx.request;
      
      // Validate required fields
      if (!body.title || !body.ingredients_array || !body.steps || !body.type) {
        return ctx.badRequest('Missing required fields: title, ingredients_array, steps, type');
      }
      
      // Validate type enum
      const validTypes = ['Veg', 'Non-Veg', 'Dessert', 'Cookies', 'Drinks'];
      if (!validTypes.includes(body.type)) {
        return ctx.badRequest(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
      }
      
      const recipe = await strapi.entityService.create('api::recipe.recipe', {
        data: body,
        populate: {
          cover_Image: true,
          ingredients_array: true,
          steps: true,
        },
      });
      
      return { data: recipe };
    } catch (error) {
      ctx.throw(500, 'Error creating recipe');
    }
  },

  // Update a recipe
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { body } = ctx.request;
      
      // Check if recipe exists
      const existingRecipe = await strapi.entityService.findOne('api::recipe.recipe', id);
      if (!existingRecipe) {
        return ctx.notFound('Recipe not found');
      }
      
      // Validate type if provided
      if (body.type) {
        const validTypes = ['Veg', 'Non-Veg', 'Dessert', 'Cookies', 'Drinks'];
        if (!validTypes.includes(body.type)) {
          return ctx.badRequest(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
        }
      }
      
      const recipe = await strapi.entityService.update('api::recipe.recipe', id, {
        data: body,
        populate: {
          cover_Image: true,
          ingredients_array: true,
          steps: true,
        },
      });
      
      return { data: recipe };
    } catch (error) {
      ctx.throw(500, 'Error updating recipe');
    }
  },

  // Delete a recipe
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      
      // Check if recipe exists
      const existingRecipe = await strapi.entityService.findOne('api::recipe.recipe', id);
      if (!existingRecipe) {
        return ctx.notFound('Recipe not found');
      }
      
      await strapi.entityService.delete('api::recipe.recipe', id);
      
      return { message: 'Recipe deleted successfully' };
    } catch (error) {
      ctx.throw(500, 'Error deleting recipe');
    }
  },

  // Get recipe statistics
  async stats(ctx) {
    try {
      const totalRecipes = await strapi.entityService.count('api::recipe.recipe');
      
      const typeStats = await strapi.db.connection.raw(`
        SELECT type, COUNT(*) as count 
        FROM recipes 
        GROUP BY type
      `);
      
      return {
        data: {
          total: totalRecipes,
          byType: typeStats.rows || [],
        },
      };
    } catch (error) {
      ctx.throw(500, 'Error fetching recipe statistics');
    }
  },
}));
