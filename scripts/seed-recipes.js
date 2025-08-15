'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function seedRecipes() {
  let app;
  try {
    console.log('🚀 Starting recipe seeding process...');
    
    // Compile and create Strapi instance
    const appContext = await compileStrapi();
    app = await createStrapi(appContext).load();
    
    console.log('✅ Strapi instance loaded successfully');
    
    // Wait for Strapi to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Ensure public role exists
    let publicRole = await app.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.log('⚠️ Public role not found, creating it...');
      publicRole = await app.query('plugin::users-permissions.role').create({
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
      } catch (error) {
        console.error(`❌ Error creating permission ${permission}:`, error.message);
      }
    }

    // Test recipe content type accessibility
    console.log('🧪 Testing recipe content type accessibility...');
    try {
      const recipeCount = await app.query('api::recipe.recipe').count();
      console.log(`✅ Recipe content type accessible. Current count: ${recipeCount}`);
    } catch (error) {
      console.error('❌ Recipe content type test failed:', error.message);
      console.error('This is likely the root cause of the 500 errors');
      throw new Error('Recipe content type not accessible: ' + error.message);
    }

    // Check if recipes already exist
    const existingRecipes = await app.query('api::recipe.recipe').findMany();
    
    if (existingRecipes.length === 0) {
      console.log('🍳 Creating sample recipes...');
      
      const sampleRecipes = [
        {
          title: 'Chocolate Chip Cookies',
          type: 'Cookies',
          description: 'Classic homemade chocolate chip cookies',
          cooking_time: 25,
          difficulty: 'Easy',
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
            },
            {
              ingredient: 'Eggs',
              quantity: '2',
              unit: 'large'
            },
            {
              ingredient: 'Vanilla extract',
              quantity: '2',
              unit: 'teaspoons'
            }
          ],
          steps: [
            {
              __component: 'shared.rich-text',
              body: 'Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.'
            },
            {
              __component: 'shared.rich-text',
              body: 'In a large bowl, cream together butter and sugar until light and fluffy.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Beat in eggs one at a time, then stir in vanilla.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Gradually blend in flour mixture, then stir in chocolate chips.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Drop by rounded tablespoons onto prepared baking sheets.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Bake for 9 to 11 minutes or until golden brown. Cool on baking sheets for 2 minutes.'
            }
          ],
          publishedAt: new Date()
        },
        {
          title: 'Margherita Pizza',
          type: 'Non-Veg',
          description: 'Traditional Italian pizza with fresh mozzarella and basil',
          cooking_time: 20,
          difficulty: 'Medium',
          ingredients_array: [
            {
              ingredient: 'Pizza dough',
              quantity: '1',
              unit: 'ball'
            },
            {
              ingredient: 'Fresh mozzarella',
              quantity: '8',
              unit: 'ounces'
            },
            {
              ingredient: 'Fresh basil leaves',
              quantity: '1/2',
              unit: 'cup'
            },
            {
              ingredient: 'Tomato sauce',
              quantity: '1/2',
              unit: 'cup'
            },
            {
              ingredient: 'Olive oil',
              quantity: '2',
              unit: 'tablespoons'
            }
          ],
          steps: [
            {
              __component: 'shared.rich-text',
              body: 'Preheat oven to 500°F (260°C) with a pizza stone if available.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Roll out the pizza dough on a floured surface to desired thickness.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Spread tomato sauce evenly over the dough.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Add fresh mozzarella slices and basil leaves.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Drizzle with olive oil and season with salt and pepper.'
            },
            {
              __component: 'shared.rich-text',
              body: 'Bake for 10-12 minutes until crust is golden and cheese is bubbly.'
            }
          ],
          publishedAt: new Date()
        }
      ];

      for (const recipe of sampleRecipes) {
        try {
          await app.query('api::recipe.recipe').create({ data: recipe });
          console.log(`✅ Created recipe: ${recipe.title}`);
        } catch (error) {
          console.error(`❌ Error creating recipe ${recipe.title}:`, error.message);
        }
      }
    } else {
      console.log(`ℹ️ Found ${existingRecipes.length} existing recipes`);
    }

    console.log('🎉 Recipe seeding completed successfully!');
    
    // Final API test
    console.log('🧪 Final API test...');
    try {
      const testRecipes = await app.query('api::recipe.recipe').findMany({
        populate: ['ingredients_array', 'steps']
      });
      console.log(`✅ Final test successful: Found ${testRecipes.length} recipes`);
      
      if (testRecipes.length > 0) {
        const firstRecipe = testRecipes[0];
        console.log(`📝 Sample recipe: ${firstRecipe.title}`);
        console.log(`   - Type: ${firstRecipe.type}`);
        console.log(`   - Ingredients: ${firstRecipe.ingredients_array?.length || 0}`);
        console.log(`   - Steps: ${firstRecipe.steps?.length || 0}`);
      }
    } catch (error) {
      console.error('❌ Final API test failed:', error.message);
      throw error;
    }

  } catch (error) {
    console.error('❌ Error during recipe seeding:', error);
    throw error;
  } finally {
    if (app) {
      console.log('🧹 Cleaning up Strapi instance...');
      await app.destroy();
    }
  }
}

// Run the seeding function
if (require.main === module) {
  seedRecipes()
    .then(() => {
      console.log('🎯 Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = { seedRecipes };
