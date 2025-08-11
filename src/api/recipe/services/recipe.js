'use strict';

/**
 * recipe service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recipe.recipe', ({ strapi }) => ({
  // Custom method to search recipes by ingredients
  async searchByIngredients(ingredients) {
    try {
      const recipes = await strapi.entityService.findMany('api::recipe.recipe', {
        filters: {
          ingredients_array: {
            $elemMatch: {
              ingredient: {
                $in: ingredients,
              },
            },
          },
        },
        populate: {
          cover_Image: true,
          ingredients_array: true,
          steps: true,
        },
      });
      
      return recipes;
    } catch (error) {
      throw new Error('Error searching recipes by ingredients');
    }
  },

  // Custom method to get recipes by type with count
  async getByType(type) {
    try {
      const recipes = await strapi.entityService.findMany('api::recipe.recipe', {
        filters: { type },
        populate: {
          cover_Image: true,
          ingredients_array: true,
          steps: true,
        },
      });
      
      const count = await strapi.entityService.count('api::recipe.recipe', {
        filters: { type },
      });
      
      return { recipes, count };
    } catch (error) {
      throw new Error('Error getting recipes by type');
    }
  },

  // Custom method to validate recipe data
  validateRecipeData(data) {
    const errors = [];
    
    if (!data.title || data.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }
    
    if (!data.ingredients_array || !Array.isArray(data.ingredients_array) || data.ingredients_array.length === 0) {
      errors.push('At least one ingredient is required');
    }
    
    if (!data.steps || data.steps.length === 0) {
      errors.push('At least one step is required');
    }
    
    if (!data.type) {
      errors.push('Recipe type is required');
    }
    
    const validTypes = ['Veg', 'Non-Veg', 'Dessert', 'Cookies', 'Drinks'];
    if (data.type && !validTypes.includes(data.type)) {
      errors.push(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
    }
    
    return errors;
  },

  // Custom method to format recipe for response
  formatRecipeResponse(recipe) {
    if (!recipe) return null;
    
    return {
      id: recipe.id,
      title: recipe.title,
      type: recipe.type,
      cover_Image: recipe.cover_Image,
      ingredients_array: recipe.ingredients_array,
      steps: recipe.steps,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      publishedAt: recipe.publishedAt,
    };
  },
}));
