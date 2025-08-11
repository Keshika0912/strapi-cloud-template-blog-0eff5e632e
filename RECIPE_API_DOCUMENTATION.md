# Recipe API Documentation

This document provides comprehensive information about the Recipe API endpoints, including authentication, request/response formats, and sample curl commands.

## Base URL
```
http://localhost:1337/api
```

## Authentication
All recipe endpoints are **public** and do not require authentication.

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recipes` | Get all recipes with pagination and filtering |
| GET | `/recipes/:id` | Get a specific recipe by ID |
| POST | `/recipes` | Create a new recipe |
| PUT | `/recipes/:id` | Update an existing recipe |
| DELETE | `/recipes/:id` | Delete a recipe |

## 1. Get All Recipes

### Endpoint
```
GET /api/recipes
```

### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number for pagination | 1 |
| `pageSize` | integer | Number of items per page (max 100) | 25 |
| `sort` | string | Sort field and direction (e.g., `title:asc`, `createdAt:desc`) | `createdAt:desc` |
| `type` | string | Filter by recipe type | - |
| `title` | string | Search recipes by title (case-insensitive) | - |

### Sample Request
```bash
# Get all recipes
curl -X GET "http://localhost:1337/api/recipes"

# Get recipes with pagination
curl -X GET "http://localhost:1337/api/recipes?page=1&pageSize=10"

# Filter by type
curl -X GET "http://localhost:1337/api/recipes?type=Veg"

# Search by title
curl -X GET "http://localhost:1337/api/recipes?title=coffee"

# Sort by title ascending
curl -X GET "http://localhost:1337/api/recipes?sort=title:asc"

# Combined filters
curl -X GET "http://localhost:1337/api/recipes?type=Dessert&page=1&pageSize=5&sort=createdAt:desc"
```

### Sample Response
```json
{
  "data": [
    {
      "id": 1,
      "title": "Chocolate Chip Cookies",
      "type": "Cookies",
      "cover_Image": {
        "id": 1,
        "url": "/uploads/chocolate_cookies.jpg",
        "alternativeText": "Chocolate chip cookies"
      },
      "ingredients_array": [
        {
          "id": 1,
          "ingredient": "Flour",
          "quantity": "2 cups",
          "unit": "cups"
        },
        {
          "id": 2,
          "ingredient": "Chocolate Chips",
          "quantity": "1",
          "unit": "cup"
        }
      ],
      "steps": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "Preheat oven to 350°F (175°C)"
            }
          ]
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "publishedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

## 2. Get Recipe by ID

### Endpoint
```
GET /api/recipes/:id
```

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Recipe ID |

### Sample Request
```bash
curl -X GET "http://localhost:1337/api/recipes/1"
```

### Sample Response
```json
{
  "data": {
    "id": 1,
    "title": "Chocolate Chip Cookies",
    "type": "Cookies",
    "cover_Image": {
      "id": 1,
      "url": "/uploads/chocolate_cookies.jpg",
      "alternativeText": "Chocolate chip cookies"
    },
    "ingredients_array": [
      {
        "id": 1,
        "ingredient": "Flour",
        "quantity": "2 cups",
        "unit": "cups"
      },
      {
        "id": 2,
        "ingredient": "Chocolate Chips",
        "quantity": "1",
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Preheat oven to 350°F (175°C)"
          }
        ]
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "publishedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 3. Create Recipe

### Endpoint
```
POST /api/recipes
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Recipe title (min 3 characters) |
| `type` | string | Yes | Recipe type: `Veg`, `Non-Veg`, `Dessert`, `Cookies`, `Drinks` |
| `ingredients_array` | array | Yes | Array of ingredient objects |
| `steps` | array | Yes | Array of step objects (rich text blocks) |
| `cover_Image` | integer | No | Media ID for cover image |

### Ingredient Object Structure
```json
{
  "ingredient": "Ingredient name",
  "quantity": "Amount",
  "unit": "Unit of measurement"
}
```

### Sample Request
```bash
curl -X POST "http://localhost:1337/api/recipes" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Vanilla Ice Cream",
    "type": "Dessert",
    "ingredients_array": [
      {
        "ingredient": "Heavy Cream",
        "quantity": "2",
        "unit": "cups"
      },
      {
        "ingredient": "Sugar",
        "quantity": "3/4",
        "unit": "cup"
      },
      {
        "ingredient": "Vanilla Extract",
        "quantity": "1",
        "unit": "teaspoon"
      }
    ],
    "steps": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "In a large bowl, whisk together heavy cream and sugar until sugar is dissolved."
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Stir in vanilla extract."
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Pour into ice cream maker and churn according to manufacturer instructions."
          }
        ]
      }
    ]
  }'
```

### Sample Response
```json
{
  "data": {
    "id": 2,
    "title": "Vanilla Ice Cream",
    "type": "Dessert",
    "ingredients_array": [
      {
        "id": 3,
        "ingredient": "Heavy Cream",
        "quantity": "2",
        "unit": "cups"
      },
      {
        "id": 4,
        "ingredient": "Sugar",
        "quantity": "3/4",
        "unit": "cup"
      },
      {
        "id": 5,
        "ingredient": "Vanilla Extract",
        "quantity": "1",
        "unit": "teaspoon"
      }
    ],
    "steps": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "In a large bowl, whisk together heavy cream and sugar until sugar is dissolved."
          }
        ]
      }
    ],
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z",
    "publishedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## 4. Update Recipe

### Endpoint
```
PUT /api/recipes/:id
```

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Recipe ID |

### Request Body
Same structure as create, but all fields are optional.

### Sample Request
```bash
curl -X PUT "http://localhost:1337/api/recipes/2" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Homemade Vanilla Ice Cream",
    "ingredients_array": [
      {
        "ingredient": "Heavy Cream",
        "quantity": "2",
        "unit": "cups"
      },
      {
        "ingredient": "Sugar",
        "quantity": "3/4",
        "unit": "cup"
      },
      {
        "ingredient": "Vanilla Bean",
        "quantity": "1",
        "unit": "bean"
      }
    ]
  }'
```

### Sample Response
```json
{
  "data": {
    "id": 2,
    "title": "Homemade Vanilla Ice Cream",
    "type": "Dessert",
    "ingredients_array": [
      {
        "id": 3,
        "ingredient": "Heavy Cream",
        "quantity": "2",
        "unit": "cups"
      },
      {
        "id": 4,
        "ingredient": "Sugar",
        "quantity": "3/4",
        "unit": "cup"
      },
      {
        "id": 6,
        "ingredient": "Vanilla Bean",
        "quantity": "1",
        "unit": "bean"
      }
    ],
    "steps": [...],
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:15:00.000Z",
    "publishedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## 5. Delete Recipe

### Endpoint
```
DELETE /api/recipes/:id
```

### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Recipe ID |

### Sample Request
```bash
curl -X DELETE "http://localhost:1337/api/recipes/2"
```

### Sample Response
```json
{
  "message": "Recipe deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Missing required fields: title, ingredients_array, steps, type"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Recipe not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Error creating recipe"
  }
}
```

## Recipe Types

Valid recipe types:
- `Veg` - Vegetarian recipes
- `Non-Veg` - Non-vegetarian recipes
- `Dessert` - Dessert recipes
- `Cookies` - Cookie recipes
- `Drinks` - Beverage recipes

## Data Validation Rules

1. **Title**: Required, minimum 3 characters
2. **Type**: Required, must be one of the valid enum values
3. **Ingredients**: Required, must be an array with at least one ingredient
4. **Steps**: Required, must be an array with at least one step
5. **Cover Image**: Optional, must be a valid media ID

## Complete Example Workflow

Here's a complete example of creating, reading, updating, and deleting a recipe:

```bash
# 1. Create a recipe
curl -X POST "http://localhost:1337/api/recipes" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Simple Pasta",
    "type": "Veg",
    "ingredients_array": [
      {
        "ingredient": "Pasta",
        "quantity": "200",
        "unit": "grams"
      },
      {
        "ingredient": "Olive Oil",
        "quantity": "2",
        "unit": "tablespoons"
      }
    ],
    "steps": [
      {
        "type": "paragraph",
        "children": [{"text": "Boil pasta according to package instructions."}]
      },
      {
        "type": "paragraph",
        "children": [{"text": "Drain and toss with olive oil."}]
      }
    ]
  }'

# 2. Get all recipes
curl -X GET "http://localhost:1337/api/recipes"

# 3. Get the specific recipe (assuming it got ID 3)
curl -X GET "http://localhost:1337/api/recipes/3"

# 4. Update the recipe
curl -X PUT "http://localhost:1337/api/recipes/3" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Simple Pasta with Herbs",
    "ingredients_array": [
      {
        "ingredient": "Pasta",
        "quantity": "200",
        "unit": "grams"
      },
      {
        "ingredient": "Olive Oil",
        "quantity": "2",
        "unit": "tablespoons"
      },
      {
        "ingredient": "Fresh Basil",
        "quantity": "1/4",
        "unit": "cup"
      }
    ]
  }'

# 5. Delete the recipe
curl -X DELETE "http://localhost:1337/api/recipes/3"
```

## Notes

- All endpoints are public and don't require authentication
- The API supports pagination for large datasets
- Rich text blocks are used for recipe steps
- Media files (images) can be uploaded separately and referenced by ID
- All timestamps are in ISO 8601 format
- The API automatically handles draft/publish states
