'use strict';

module.exports = async ({ strapi }) => {
  try {
    console.log('🚀 Starting Strapi bootstrap...');
    
    // Ensure public role exists
    let publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.log('⚠️ Public role not found, creating it...');
      publicRole = await strapi.query('plugin::users-permissions.role').create({
        data: {
          name: 'Public',
          description: 'Default role given to unauthenticated user.',
          type: 'public',
          permissions: {},
        },
      });
      console.log('✅ Created public role');
    } else {
      console.log('✅ Public role found');
    }

    // Set up recipe API permissions
    console.log('🔐 Setting up recipe API permissions...');
    const recipePermissions = [
      'api::recipe.recipe.find',
      'api::recipe.recipe.findOne',
      'api::recipe.recipe.create',
      'api::recipe.recipe.update',
      'api::recipe.recipe.delete',
    ];

    for (const permission of recipePermissions) {
      try {
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission,
            role: publicRole.id,
          },
        });

        if (!existingPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: permission,
              role: publicRole.id,
            },
          });
          console.log(`✅ Created permission: ${permission}`);
        } else {
          console.log(`ℹ️ Permission already exists: ${permission}`);
        }
      } catch (error) {
        console.error(`❌ Error creating permission ${permission}:`, error.message);
      }
    }

    // Set up global content type permissions
    console.log('🌐 Setting up global content type permissions...');
    const globalPermissions = [
      'api::article.article.find',
      'api::article.article.findOne',
      'api::category.category.find',
      'api::category.category.findOne',
      'api::author.author.find',
      'api::author.author.findOne',
      'api::global.global.find',
      'api::global.global.findOne',
      'api::about.about.find',
      'api::about.about.findOne',
    ];

    for (const permission of globalPermissions) {
      try {
        const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
          where: {
            action: permission,
            role: publicRole.id,
          },
        });

        if (!existingPermission) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: permission,
              role: publicRole.id,
            },
          });
          console.log(`✅ Created permission: ${permission}`);
        } else {
          console.log(`ℹ️ Permission already exists: ${permission}`);
        }
      } catch (error) {
        console.error(`❌ Error creating permission ${permission}:`, error.message);
      }
    }

    console.log('🎉 Strapi bootstrap completed successfully!');
  } catch (error) {
    console.error('❌ Critical error during bootstrap:', error);
    // Don't throw - let Strapi continue
  }
};
