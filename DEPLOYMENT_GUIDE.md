# Strapi Cloud Deployment Guide

This guide will help you deploy the fixed Strapi application to Strapi Cloud.

## 🚀 Pre-Deployment Steps

### 1. Environment Variables Setup

You need to set these environment variables in your Strapi Cloud dashboard:

#### Database Configuration
```
DATABASE_CLIENT=postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

#### App Configuration
```
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://jubilant-purpose-9075947451.strapiapp.com
IS_PROXIED=true
```

#### Security Keys (Generate these!)
```
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=your-admin-jwt-secret
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

#### Database Pool Configuration
```
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_ACQUIRE_TIMEOUT=60000
DATABASE_CREATE_TIMEOUT=30000
DATABASE_DESTROY_TIMEOUT=5000
DATABASE_IDLE_TIMEOUT=30000
DATABASE_REAP_INTERVAL=1000
DATABASE_CREATE_RETRY_INTERVAL=200
DATABASE_CONNECTION_TIMEOUT=60000
DATABASE_DEBUG=false
```

### 2. Generate Security Keys

Run these commands to generate secure keys:

```bash
# Generate APP_KEYS (4 random strings)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📦 Deployment Steps

### 1. Commit and Push Changes

```bash
git add .
git commit -m "Fix Strapi cloud deployment issues and add recipe API support"
git push origin main
```

### 2. Deploy to Strapi Cloud

1. Go to your Strapi Cloud dashboard
2. Connect your GitHub repository
3. Set the environment variables from step 1
4. Deploy the application

### 3. Post-Deployment Setup

After deployment, you need to run the recipe seed script:

1. Go to your Strapi Cloud dashboard
2. Open the terminal/SSH access
3. Run: `npm run seed:recipes`

## 🔧 What Was Fixed

### 1. Database Configuration
- Updated to use PostgreSQL as default
- Added proper SSL configuration for cloud
- Improved connection pooling settings

### 2. Server Configuration
- Added proper CORS handling
- Fixed security middleware configuration
- Added cloud-specific settings

### 3. Permissions Setup
- Created bootstrap script to set up recipe API permissions
- Added public access to recipe endpoints
- Created seed script for initial data

### 4. API Structure
- Fixed recipe content type schema
- Added proper ingredient component structure
- Ensured all endpoints are publicly accessible

## 🧪 Testing After Deployment

### 1. Test Recipe API Endpoints

```bash
# Get all recipes
curl -X GET "https://jubilant-purpose-9075947451.strapiapp.com/api/recipes"

# Get recipes with pagination
curl -X GET "https://jubilant-purpose-9075947451.strapiapp.com/api/recipes?page=1&pageSize=5"

# Filter by type
curl -X GET "https://jubilant-purpose-9075947451.strapiapp.com/api/recipes?type=Veg"

# Search by title
curl -X GET "https://jubilant-purpose-9075947451.strapiapp.com/api/recipes?title=cookie"
```

### 2. Test Recipe Creation

```bash
curl -X POST "https://jubilant-purpose-9075947451.strapiapp.com/api/recipes" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Recipe",
    "type": "Veg",
    "ingredients_array": [
      {
        "name": "Test Ingredient",
        "quantity": "1 cup"
      }
    ],
    "steps": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Test step"
          }
        ]
      }
    ]
  }'
```

## 🚨 Troubleshooting

### If you still get 500 errors:

1. **Check Database Connection**: Ensure PostgreSQL is properly configured
2. **Check Permissions**: Verify the bootstrap script ran successfully
3. **Check Logs**: Look at Strapi Cloud logs for specific error messages
4. **Verify Schema**: Ensure recipe content types are properly created

### Common Issues:

- **Missing Environment Variables**: All required env vars must be set
- **Database SSL Issues**: Ensure SSL is properly configured for cloud
- **Permission Denied**: Run the seed script to set up permissions
- **Content Type Missing**: Verify recipe schema is deployed

## 📱 React Native App Integration

After successful deployment, your React Native app should work with:

- ✅ Filter functionality
- ✅ Search functionality  
- ✅ Load more pagination
- ✅ Real-time API responses
- ✅ No mock data

The API will return real data from your Strapi cloud deployment.

## 🔄 Next Steps

1. Deploy the fixed Strapi application
2. Run the recipe seed script
3. Test the API endpoints
4. Update your React Native app to use the working API
5. Test the complete filter and search functionality

## 📞 Support

If you encounter issues:
1. Check Strapi Cloud logs
2. Verify environment variables
3. Ensure database is accessible
4. Run the seed script
5. Test API endpoints individually
