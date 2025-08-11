# Recipe API Setup Instructions

This document provides step-by-step instructions to set up and test the Recipe API with public access.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Strapi application running

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install axios for testing the API.

### 2. Start Strapi Development Server

```bash
npm run develop
```

This will start the Strapi server on `http://localhost:1337`.

### 3. Configure Users & Permissions

1. Open your browser and navigate to `http://localhost:1337/admin`
2. Create your first admin user if you haven't already
3. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
4. Click on **Public** role
5. Under **Recipe** permissions, enable all the following:
   - `find` (GET /api/recipes)
   - `findOne` (GET /api/recipes/:id)
   - `create` (POST /api/recipes)
   - `update` (PUT /api/recipes/:id)
   - `delete` (DELETE /api/recipes/:id)
6. Click **Save**

### 4. Test the API

Once Strapi is running and permissions are configured, you can test the API:

```bash
npm run test:api
```

This will run a comprehensive test of all CRUD operations.

## API Endpoints

The Recipe API provides the following endpoints:

- **GET** `/api/recipes` - Get all recipes with pagination and filtering
- **GET** `/api/recipes/:id` - Get a specific recipe by ID
- **POST** `/api/recipes` - Create a new recipe
- **PUT** `/api/recipes/:id` - Update an existing recipe
- **DELETE** `/api/recipes/:id` - Delete a recipe

## Testing with cURL

You can also test the API manually using cURL commands. See the `RECIPE_API_DOCUMENTATION.md` file for complete examples.

### Quick Test

```bash
# Get all recipes
curl -X GET "http://localhost:1337/api/recipes"

# Create a recipe
curl -X POST "http://localhost:1337/api/recipes" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Recipe",
    "type": "Veg",
    "ingredients_array": [
      {
        "ingredient": "Test Ingredient",
        "quantity": "1",
        "unit": "piece"
      }
    ],
    "steps": [
      {
        "type": "paragraph",
        "children": [{"text": "Test step"}]
      }
    ]
  }'
```

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure you've configured the Public role permissions correctly
   - Check that the Recipe content type exists

2. **API Not Found**
   - Verify Strapi is running on the correct port
   - Check that the Recipe API is properly configured

3. **Validation Errors**
   - Ensure all required fields are provided
   - Check that the recipe type is one of the valid enum values

### Debug Mode

To run Strapi in debug mode:

```bash
DEBUG=* npm run develop
```

## File Structure

```
src/api/recipe/
├── content-types/recipe/schema.json    # Recipe data structure
├── controllers/recipe.js               # API logic and validation
├── routes/recipe.js                    # Route configuration
└── services/recipe.js                  # Business logic

config/
├── plugins.js                          # Plugin configuration
└── api.js                             # API configuration

test_recipe_api.js                      # Test script
RECIPE_API_DOCUMENTATION.md             # Complete API documentation
```

## Next Steps

After setting up the basic API:

1. **Add Authentication**: Implement user authentication if needed
2. **Add Rate Limiting**: Protect against abuse
3. **Add Caching**: Improve performance for read operations
4. **Add Image Upload**: Handle recipe cover images
5. **Add Search**: Implement full-text search capabilities

## Support

If you encounter any issues:

1. Check the Strapi logs in the terminal
2. Verify all permissions are set correctly
3. Ensure the Recipe content type exists
4. Check that all required fields are provided in requests
