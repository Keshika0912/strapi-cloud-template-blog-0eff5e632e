'use strict';

module.exports = async ({ strapi }) => {
  try {
    console.log('🚀 Starting Strapi bootstrap...');
    
    // Wait a bit for Strapi to fully initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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

    // Set up ONLY recipe API permissions - focus on what we need
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

    console.log('🎉 Recipe API permissions setup completed!');
    
    // Test if recipe content type is accessible
    try {
      console.log('🧪 Testing recipe content type accessibility...');
      const recipeCount = await strapi.query('api::recipe.recipe').count();
      console.log(`✅ Recipe content type accessible. Current count: ${recipeCount}`);
    } catch (error) {
      console.error('❌ Recipe content type test failed:', error.message);
      console.error('This might be the root cause of the 500 errors');
    }

  } catch (error) {
    console.error('❌ Critical error during bootstrap:', error);
    // Don't throw - let Strapi continue
  }
};
