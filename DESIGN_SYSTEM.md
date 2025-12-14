# KeMU Design System & Component Library

## Overview
Complete Tailwind CSS design system and React component library for Kenya Methodist University with professional 3D design, glassmorphism, shadows, layering, and animations.

## Files Created

### 1. Configuration Files
- **`tailwind.config.js`** - Full Tailwind configuration with custom colors, shadows, animations, and keyframes
- **`globals.css`** - Global utility classes and component styles
- **`index.html`** - Updated with extended Tailwind config for CDN usage

### 2. Component Library (`/components`)

#### Core Components
1. **StatCard.tsx** - Statistics display card with icon, value, and label
2. **ProgramCard.tsx** - Academic program card with hover effects
3. **NewsCard.tsx** - News article card with image and metadata
4. **EventCard.tsx** - Event display card with date and venue
5. **GlassSection.tsx** - Glass container for grouping content
6. **PageHeader.tsx** - Page header with gradient background
7. **GoldButton.tsx** - 3D gold CTA button with glow effects
8. **InputField.tsx** - Form input with 3D styling and focus states
9. **DashboardCard.tsx** - Admin dashboard module cards
10. **GlassModal.tsx** - Modal dialog with glass effect

#### Export File
- **`components/index.ts`** - Barrel export for all components

## Design Tokens

### Colors
- `kemu-purple`: #871054
- `kemu-gold`: #a0672e
- `kemu-blue`: #2e3192
- `kemu-purple10`: #f3e7ee
- `kemu-purple30`: #dbb7cb

### Shadows
- `soft-3d`: 0 8px 20px rgba(0,0,0,0.15)
- `deep-3d`: 0 12px 28px rgba(0,0,0,0.22)
- `glow-gold`: 0 0 10px rgba(160,103,46,0.8)
- `glow-purple`: 0 0 10px rgba(135,16,84,0.8)

### Animations
- `fade-up`: Fade in with upward motion
- `fade-in`: Simple fade in
- `slide-left`: Slide in from right
- `slide-right`: Slide in from left
- `subtle-bounce`: Gentle bounce effect
- `soft-pulse`: Opacity pulse
- `floating`: Slow vertical float

### Utility Classes
- `.glass-card` - Glass effect card
- `.glass-nav` - Glass navigation bar
- `.nav-link` - Navigation link styling
- `.stat-card` - Statistics card
- `.program-card` - Program card
- `.gold-btn` - Gold button
- `.outline-btn` - Outline button
- `.page-container` - Page container
- `.section-title` - Section title

## Usage Examples

### Using Components
```tsx
import { StatCard, ProgramCard, GoldButton } from './components';
import { Users } from 'lucide-react';

// Stat Card
<StatCard 
  icon={Users} 
  value="32K+" 
  label="Alumni Worldwide" 
/>

// Program Card
<ProgramCard
  title="Bachelor of Science in Computer Science"
  slug="bsc-computer-science"
  faculty="School of Computing"
  duration="4 Years"
  degreeType="Undergraduate"
/>

// Gold Button
<GoldButton onClick={handleClick} icon={ArrowRight}>
  Apply Now
</GoldButton>
```

### Using Utility Classes
```tsx
<div className="glass-card">
  <h2 className="section-title">Our Programs</h2>
  {/* Content */}
</div>
```

## Features

✅ Professional 3D design with layered shadows
✅ Glassmorphism effects with backdrop blur
✅ Smooth hover animations and transitions
✅ KeMU brand colors throughout
✅ Responsive and mobile-friendly
✅ Accessible with proper ARIA labels
✅ TypeScript support
✅ Clean, maintainable code

## Next Steps

1. Import components where needed in your pages
2. Replace existing cards/buttons with new components
3. Use utility classes for consistent styling
4. Customize animations and effects as needed

