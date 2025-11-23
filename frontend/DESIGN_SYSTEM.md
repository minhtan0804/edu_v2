# Design System - EdTech Healthcare Platform

## Color Palette

### Primary Colors (Orange Theme)

Dựa trên design thumbnail, hệ thống sử dụng orange/peach làm màu chủ đạo.

```typescript
primary: {
  50: "#FFF7ED",   // Lightest
  100: "#FFEDD5",
  200: "#FED7AA",
  300: "#FDBA74",
  400: "#FB923C",
  500: "#F97316",  // Main orange - Sử dụng cho buttons, accents
  600: "#EA580C",
  700: "#C2410C",
  800: "#9A3412",
  900: "#7C2D12",
}
```

**Usage:**

- Buttons: `bg-primary-500`
- Hover states: `hover:bg-primary-600`
- Focus rings: `focus:ring-primary-500`
- Links: `text-primary-600`

### Background Colors (Peach/Light Orange)

```typescript
background: {
  light: "#FFF5E6",   // Light peach - Main page background
  default: "#FFF7ED", // Very light peach
  dark: "#FED7AA",    // Medium peach
}
```

**Usage:**

- Page background: `bg-background-light`
- Cards: `bg-white` (trên orange background)

### Success Colors (Green)

```typescript
success: {
  500: "#22C55E",  // Main green - Password strength indicator
  600: "#16A34A",
}
```

**Usage:**

- Password strength: `bg-success-500`
- Success messages: `text-success-600`

### Neutral Colors

```typescript
neutral: {
  50: "#FAFAFA",
  100: "#F5F5F5",
  200: "#E5E5E5",
  300: "#D4D4D4",
  400: "#A3A3A3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
}
```

**Usage:**

- Text: `text-neutral-900` (headings), `text-neutral-600` (body)
- Borders: `border-neutral-300`
- Inputs: `border-neutral-300`

## Typography

### Headings

- **H1**: `text-3xl font-bold` - Page titles
- **H2**: `text-2xl font-bold` - Section titles
- **H3**: `text-xl font-semibold` - Subsection titles

### Body Text

- **Regular**: `text-sm` hoặc `text-base`
- **Small**: `text-xs` - Labels, captions
- **Colors**:
  - Primary text: `text-neutral-900`
  - Secondary text: `text-neutral-600`
  - Muted text: `text-neutral-500`

## Components

### Buttons

**Primary Button:**

```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-xl transition-colors">
  Continue
</button>
```

**Secondary Button:**

```tsx
<button className="border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors">
  Cancel
</button>
```

### Input Fields

```tsx
<input
  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
  placeholder="Enter text..."
/>
```

### Cards

```tsx
<div className="bg-white rounded-2xl p-8 shadow-lg">{/* Content */}</div>
```

### Background Shape (Orange Container)

```tsx
<div className="bg-primary-500 rounded-3xl p-8 md:p-12 shadow-xl">
  <div className="bg-white rounded-2xl p-8 shadow-lg">{/* Card content */}</div>
</div>
```

## Layout Patterns

### Auth Pages Layout

```tsx
<div className="min-h-screen flex items-center justify-center bg-background-light p-4">
  <div className="w-full max-w-md">
    <div className="bg-primary-500 rounded-3xl p-8 md:p-12 shadow-xl">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        {/* Form content */}
      </div>
    </div>
  </div>
</div>
```

## Spacing

- **Small**: `space-y-2` hoặc `gap-2`
- **Medium**: `space-y-4` hoặc `gap-4`
- **Large**: `space-y-6` hoặc `gap-6`
- **XLarge**: `space-y-8` hoặc `gap-8`

## Border Radius

- **Small**: `rounded-lg` (0.5rem)
- **Medium**: `rounded-xl` (0.75rem) - Inputs, buttons
- **Large**: `rounded-2xl` (1rem) - Cards
- **XLarge**: `rounded-3xl` (1.5rem) - Background shapes

## Shadows

- **Card**: `shadow-lg`
- **Container**: `shadow-xl`
- **Button**: `shadow-md`

## Usage Examples

### Import Colors

```typescript
import { colors } from "@/constants/colors";

// Use in component
<div style={{ backgroundColor: colors.primary[500] }}>
```

### Tailwind Classes

```tsx
// Primary button
<button className="bg-primary-500 hover:bg-primary-600 text-white">

// Background
<div className="bg-background-light">

// Success indicator
<div className="bg-success-500">
```

## Design Tokens Reference

Tất cả màu sắc đã được cấu hình trong:

- `tailwind.config.js` - Tailwind theme
- `src/constants/colors.ts` - TypeScript constants
- `src/index.css` - CSS variables
