const axios = require('axios');

const BASE_URL = 'http://localhost:1337/api';

// Test data
const testRecipe = {
  title: "Test Chocolate Cake",
  type: "Dessert",
  ingredients_array: [
    {
      ingredient: "Flour",
      quantity: "2",
      unit: "cups"
    },
    {
      ingredient: "Cocoa Powder",
      quantity: "1/2",
      unit: "cup"
    },
    {
      ingredient: "Sugar",
      quantity: "1",
      unit: "cup"
    }
  ],
  steps: [
    {
      type: "paragraph",
      children: [
        {
          text: "Preheat oven to 350°F (175°C)."
        }
      ]
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Mix dry ingredients in a bowl."
        }
      ]
    },
    {
      type: "paragraph",
      children: [
        {
          text: "Bake for 25-30 minutes."
        }
      ]
    }
  ]
};

async function testRecipeAPI() {
  console.log('🧪 Testing Recipe API...\n');
  
  try {
    // Test 1: Create Recipe
    console.log('1️⃣ Creating a new recipe...');
    const createResponse = await axios.post(`${BASE_URL}/recipes`, testRecipe);
    console.log('✅ Recipe created successfully!');
    console.log(`   ID: ${createResponse.data.data.id}`);
    console.log(`   Title: ${createResponse.data.data.title}\n`);
    
    const recipeId = createResponse.data.data.id;
    
    // Test 2: Get All Recipes
    console.log('2️⃣ Fetching all recipes...');
    const getAllResponse = await axios.get(`${BASE_URL}/recipes`);
    console.log('✅ Recipes fetched successfully!');
    console.log(`   Total recipes: ${getAllResponse.data.meta.pagination.total}\n`);
    
    // Test 3: Get Recipe by ID
    console.log('3️⃣ Fetching recipe by ID...');
    const getOneResponse = await axios.get(`${BASE_URL}/recipes/${recipeId}`);
    console.log('✅ Recipe fetched successfully!');
    console.log(`   Title: ${getOneResponse.data.data.title}\n`);
    
    // Test 4: Update Recipe
    console.log('4️⃣ Updating recipe...');
    const updateData = {
      title: "Updated Chocolate Cake",
      ingredients_array: [
        ...testRecipe.ingredients_array,
        {
          ingredient: "Vanilla Extract",
          quantity: "1",
          unit: "teaspoon"
        }
      ]
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/recipes/${recipeId}`, updateData);
    console.log('✅ Recipe updated successfully!');
    console.log(`   New title: ${updateResponse.data.data.title}`);
    console.log(`   Ingredients count: ${updateResponse.data.data.ingredients_array.length}\n`);
    
    // Test 5: Filter Recipes by Type
    console.log('5️⃣ Filtering recipes by type...');
    const filterResponse = await axios.get(`${BASE_URL}/recipes?type=Dessert`);
    console.log('✅ Filter applied successfully!');
    console.log(`   Dessert recipes found: ${filterResponse.data.meta.pagination.total}\n`);
    
    // Test 6: Search Recipes by Title
    console.log('6️⃣ Searching recipes by title...');
    const searchResponse = await axios.get(`${BASE_URL}/recipes?title=chocolate`);
    console.log('✅ Search completed successfully!');
    console.log(`   Recipes found: ${searchResponse.data.meta.pagination.total}\n`);
    
    // Test 7: Delete Recipe
    console.log('7️⃣ Deleting recipe...');
    const deleteResponse = await axios.delete(`${BASE_URL}/recipes/${recipeId}`);
    console.log('✅ Recipe deleted successfully!');
    console.log(`   Message: ${deleteResponse.data.message}\n`);
    
    // Test 8: Verify Deletion
    console.log('8️⃣ Verifying deletion...');
    try {
      await axios.get(`${BASE_URL}/recipes/${recipeId}`);
      console.log('❌ Recipe still exists (this should not happen)');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Recipe successfully deleted (404 Not Found)\n');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testRecipeAPI();
}

module.exports = { testRecipeAPI };
