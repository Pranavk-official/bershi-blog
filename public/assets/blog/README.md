# Placeholder Images

This directory contains placeholder images for blog posts. Replace these with actual images before deployment.

## Image Requirements

### Cover Images
- **Location**: `public/assets/blog/[post-name]/cover.jpg`
- **Recommended Size**: 1300x630px (optimized for social sharing)
- **Format**: JPG, PNG, or WebP
- **Max File Size**: < 500KB for optimal performance

### Author Avatars
- **Location**: `public/assets/blog/authors/[name].jpeg`
- **Recommended Size**: 200x200px (will be displayed at 48x48px)
- **Format**: JPEG, PNG, or WebP
- **Max File Size**: < 100KB

## Current Placeholder Structure

```
public/assets/blog/
├── authors/
│   └── john.jpeg           # Author avatar (needs to be added)
├── nextjs-15/
│   └── cover.jpg           # Post cover image (needs to be added)
├── typescript-patterns/
│   └── cover.jpg           # Post cover image (needs to be added)
└── tailwind-responsive/
    └── cover.jpg           # Post cover image (needs to be added)
```

## How to Add Images

1. **For Cover Images**:
   - Create a new folder in `public/assets/blog/` matching your post slug
   - Add a `cover.jpg` file with the recommended dimensions
   - Update the `coverImage` field in your post's frontmatter

2. **For Author Avatars**:
   - Add your avatar image to `public/assets/blog/authors/`
   - Update the `author.picture` field in your post's frontmatter

## Temporary Solution

Until you add real images, you can:

1. Use placeholder services like:
   - [Unsplash](https://unsplash.com/) for high-quality free photos
   - [Picsum Photos](https://picsum.photos/) for random placeholder images
   - [UI Avatars](https://ui-avatars.com/) for generated avatar images

2. Generate solid color placeholders:
   - Create simple colored rectangles in the correct dimensions
   - Use CSS gradients as temporary backgrounds

3. Use external URLs:
   - You can use external image URLs in frontmatter temporarily
   - Example: `coverImage: "https://via.placeholder.com/1300x630"`

## Example: Using UI Avatars

For author pictures, you can use generated avatars:

```markdown
author:
  name: John Doe
  picture: "https://ui-avatars.com/api/?name=John+Doe&size=200"
```

## Image Optimization

Next.js automatically optimizes images when using the `<Image>` component:
- Automatic WebP conversion when supported
- Responsive image loading
- Lazy loading by default
- Blur placeholder generation

No additional configuration needed!
