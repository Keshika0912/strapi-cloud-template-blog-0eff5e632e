'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function seedRecipes() {
  let app;
  try {
    console.log('🌱 Starting recipe seed...');
    
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    
    console.log('📚 Setting up recipe permissions...');
    
    // Find the public role
    const publicRole = await app.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.log('❌ Public role not found. Creating it...');
      // Create public role if it doesn't exist
      await app.query('plugin::users-permissions.role').create({
        data: {
          type: 'public',
          name: 'Public',
          description: 'Default role given to unauthenticated user.',
        },
      });
    }

    // Set up recipe API permissions
    const recipePermissions = [
      'api::recipe.recipe.find',
      'api::recipe.recipe.findOne',
      'api::recipe.recipe.create',
      'api::recipe.recipe.update',
      'api::recipe.recipe.delete',
    ];

    for (const permission of recipePermissions) {
      const existingPermission = await app.query('plugin::users-permissions.permission').findOne({
        where: {
          action: permission,
          role: publicRole.id,
        },
      });

      if (!existingPermission) {
        await app.query('plugin::users-permissions.permission').create({
          data: {
            action: permission,
            role: publicRole.id,
          },
        });
        console.log(`✅ Created permission: ${permission}`);
      } else {
        console.log(`ℹ️ Permission already exists: ${permission}`);
      }
    }

    // Create some sample recipes if none exist
    const existingRecipes = await app.query('api::recipe.recipe').findMany();
    
    if (existingRecipes.length === 0) {
      console.log('🍳 Creating sample recipes...');
      
      const sampleRecipes = [
        {
          title: 'Chocolate Chip Cookies',
          type: 'Cookies',
          ingredients_array: [
            {
              ingredient: 'All-purpose flour',
              quantity: '2 1/4',
              unit: 'cups'
            },
            {
              ingredient: 'Butter',
              quantity: '1',
              unit: 'cup'
            },
            {
              ingredient: 'Chocolate chips',
              quantity: '2',
              unit: 'cups'
            }
          ],
          steps: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Preheat oven to 375°F (190°C).'
                }
              ]
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Cream butter and sugar until light and fluffy.'
                }
              ]
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Bake for 9-11 minutes until golden brown.'
                }
              ]
            }
          ],
          publishedAt: new Date()
        },
        {
          title: 'Classic Margherita Pizza',
          type: 'Veg',
          ingredients_array: [
            {
              ingredient: 'Pizza dough',
              quantity: '1',
              unit: 'ball'
            },
            {
              ingredient: 'Fresh mozzarella',
              quantity: '8',
              unit: 'oz'
            },
            {
              ingredient: 'Fresh basil',
              quantity: '1/2',
              unit: 'cup'
            }
          ],
          steps: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Preheat oven to 500°F (260°C).'
                }
              ]
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Stretch dough and add toppings.'
                }
              ]
            },
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Bake for 10-12 minutes until crust is golden.'
                }
              ]
            }
          ],
          publishedAt: new Date()
        }
      ];

      for (const recipe of sampleRecipes) {
        await app.query('api::recipe.recipe').create({
          data: recipe
        });
        console.log(`✅ Created recipe: ${recipe.title}`);
      }
    } else {
      console.log(`ℹ️ Found ${existingRecipes.length} existing recipes`);
    }

    console.log('🎉 Recipe seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during recipe seeding:', error);
    throw error;
  } finally {
    if (app) {
      await app.destroy();
    }
  }
}

// Run the seed function
if (require.main === module) {
  seedRecipes()
    .then(() => {
      console.log('✅ Recipe seeding finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Recipe seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedRecipes };
