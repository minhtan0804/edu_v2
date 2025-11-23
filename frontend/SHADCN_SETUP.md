# shadcn/ui Component Setup Guide

## Initial Setup

If you haven't initialized shadcn/ui yet, run:

```bash
npx shadcn@latest init
```

This will create `components.json` and set up the necessary configuration.

---

## Group 1: General & Typography

### Button
```bash
npx shadcn@latest add button
```

### Typography (Custom Component)
See: `src/components/ui/typography.tsx`

### IconWrapper (Custom Component)
See: `src/components/ui/icon-wrapper.tsx`

---

## Group 2: Data Entry (Forms)

### Input
```bash
npx shadcn@latest add input
```

### Textarea
```bash
npx shadcn@latest add textarea
```

### Select
```bash
npx shadcn@latest add select
```

### Checkbox
```bash
npx shadcn@latest add checkbox
```

### Radio Group
```bash
npx shadcn@latest add radio-group
```

### Switch
```bash
npx shadcn@latest add switch
```

### Calendar (for DatePicker)
```bash
npx shadcn@latest add calendar
```

### Popover (for DatePicker)
```bash
npx shadcn@latest add popover
```

### DatePicker (Custom Component)
See: `src/components/ui/date-picker.tsx`

### FileUploader (Custom Component)
See: `src/components/ui/file-uploader.tsx`

---

## Group 3: Data Display

### Table
```bash
npx shadcn@latest add table
```

### Card
```bash
npx shadcn@latest add card
```

### Avatar
```bash
npx shadcn@latest add avatar
```

### Badge
```bash
npx shadcn@latest add badge
```

### Tooltip
```bash
npx shadcn@latest add tooltip
```

### Popover
```bash
npx shadcn@latest add popover
```

---

## Group 4: Feedback

### Dialog (Modal)
```bash
npx shadcn@latest add dialog
```

### Sheet (Drawer)
```bash
npx shadcn@latest add sheet
```

### Sonner (Toast - Recommended)
```bash
npx shadcn@latest add sonner
```

### Toast (Alternative)
```bash
npx shadcn@latest add toast
```

### Spinner (Custom Component)
See: `src/components/ui/spinner.tsx`

---

## Group 5: Navigation

### Breadcrumb
```bash
npx shadcn@latest add breadcrumb
```

### Pagination
```bash
npx shadcn@latest add pagination
```

### Tabs
```bash
npx shadcn@latest add tabs
```

### Dropdown Menu
```bash
npx shadcn@latest add dropdown-menu
```

---

## Installation Script (All at once)

Run this to install all shadcn/ui components at once:

```bash
npx shadcn@latest add button input textarea select checkbox radio-group switch calendar popover table card avatar badge tooltip dialog sheet sonner breadcrumb pagination tabs dropdown-menu
```

---

## Custom Components

All custom components are located in `src/components/ui/`:
- `typography.tsx` - Typography system
- `icon-wrapper.tsx` - Icon wrapper component
- `date-picker.tsx` - Date picker wrapper
- `file-uploader.tsx` - File upload with drag & drop
- `spinner.tsx` - Loading spinner

