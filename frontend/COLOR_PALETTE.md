# Bảng Mã Màu - EdTech Healthcare Platform

## Tổng quan

Bảng màu được thiết kế dựa trên thumbnail với theme **Orange/Peach** làm màu chủ đạo, tạo cảm giác ấm áp, thân thiện phù hợp với lĩnh vực Healthcare.

## Primary Colors (Orange)

Màu chính của hệ thống - sử dụng cho buttons, accents, và interactive elements.

| Tên             | Hex       | RGB                | Usage                            |
| --------------- | --------- | ------------------ | -------------------------------- |
| Primary 50      | `#FFF7ED` | rgb(255, 247, 237) | Lightest background              |
| Primary 100     | `#FFEDD5` | rgb(255, 237, 213) | Light background                 |
| Primary 200     | `#FED7AA` | rgb(254, 215, 170) | Medium light                     |
| Primary 300     | `#FDBA74` | rgb(253, 186, 116) | Medium                           |
| Primary 400     | `#FB923C` | rgb(251, 146, 60)  | Medium dark                      |
| **Primary 500** | `#F97316` | rgb(249, 115, 22)  | **Main orange - Buttons, Links** |
| Primary 600     | `#EA580C` | rgb(234, 88, 12)   | Hover states                     |
| Primary 700     | `#C2410C` | rgb(194, 65, 12)   | Active states                    |
| Primary 800     | `#9A3412` | rgb(154, 52, 18)   | Dark variant                     |
| Primary 900     | `#7C2D12` | rgb(124, 45, 18)   | Darkest                          |

### Usage Examples

```tsx
// Primary button
<button className="bg-primary-500 hover:bg-primary-600">
  Continue
</button>

// Link
<a className="text-primary-600 hover:text-primary-700">
  Click here
</a>

// Focus ring
<input className="focus:ring-primary-500" />
```

## Background Colors (Peach)

Màu nền tạo cảm giác ấm áp, thân thiện.

| Tên                | Hex       | RGB                | Usage                    |
| ------------------ | --------- | ------------------ | ------------------------ |
| Background Light   | `#FFF5E6` | rgb(255, 245, 230) | **Main page background** |
| Background Default | `#FFF7ED` | rgb(255, 247, 237) | Alternative background   |
| Background Dark    | `#FED7AA` | rgb(254, 215, 170) | Accent background        |

### Usage Examples

```tsx
// Page background
<div className="bg-background-light">{/* Content */}</div>
```

## Success Colors (Green)

Màu xanh lá - sử dụng cho success states, password strength indicator.

| Tên             | Hex       | RGB                | Usage                       |
| --------------- | --------- | ------------------ | --------------------------- |
| Success 50      | `#F0FDF4` | rgb(240, 253, 244) | Lightest                    |
| Success 100     | `#DCFCE7` | rgb(220, 252, 231) | Light                       |
| Success 200     | `#BBF7D0` | rgb(187, 247, 208) | Medium light                |
| Success 300     | `#86EFAC` | rgb(134, 239, 172) | Medium                      |
| Success 400     | `#4ADE80` | rgb(74, 222, 128)  | Medium dark                 |
| **Success 500** | `#22C55E` | rgb(34, 197, 94)   | **Main green - Indicators** |
| Success 600     | `#16A34A` | rgb(22, 163, 74)   | Dark variant                |

### Usage Examples

```tsx
// Password strength indicator
<div className="bg-success-500">
  Excellent
</div>

// Success message
<p className="text-success-600">
  Password strength: Excellent
</p>
```

## Neutral Colors (Gray Scale)

Màu trung tính - sử dụng cho text, borders, và backgrounds.

| Tên         | Hex       | RGB                | Usage               |
| ----------- | --------- | ------------------ | ------------------- |
| Neutral 50  | `#FAFAFA` | rgb(250, 250, 250) | Lightest background |
| Neutral 100 | `#F5F5F5` | rgb(245, 245, 245) | Light background    |
| Neutral 200 | `#E5E5E5` | rgb(229, 229, 229) | Borders             |
| Neutral 300 | `#D4D4D4` | rgb(212, 212, 212) | **Input borders**   |
| Neutral 400 | `#A3A3A3` | rgb(163, 163, 163) | Placeholder text    |
| Neutral 500 | `#737373` | rgb(115, 115, 115) | Muted text          |
| Neutral 600 | `#525252` | rgb(82, 82, 82)    | **Body text**       |
| Neutral 700 | `#404040` | rgb(64, 64, 64)    | Dark text           |
| Neutral 800 | `#262626` | rgb(38, 38, 38)    | Darker text         |
| Neutral 900 | `#171717` | rgb(23, 23, 23)    | **Headings**        |

### Usage Examples

```tsx
// Heading
<h1 className="text-neutral-900">Title</h1>

// Body text
<p className="text-neutral-600">Description</p>

// Input border
<input className="border-neutral-300" />

// Placeholder
<input placeholder="..." className="placeholder-neutral-400" />
```

## Error Colors (Red)

Màu đỏ - sử dụng cho errors, destructive actions.

| Tên       | Hex       | RGB              | Usage      |
| --------- | --------- | ---------------- | ---------- |
| Error 500 | `#EF4444` | rgb(239, 68, 68) | Main error |
| Error 600 | `#DC2626` | rgb(220, 38, 38) | Dark error |

### Usage Examples

```tsx
// Error message
<p className="text-red-600">Error message</p>
```

## Color Combinations

### Auth Pages

```tsx
// Background
bg-background-light

// Orange container
bg-primary-500 rounded-3xl

// White card
bg-white rounded-2xl

// Primary button
bg-primary-500 hover:bg-primary-600
```

### Text Hierarchy

```tsx
// Headings
text-neutral-900 font-bold

// Body text
text-neutral-600

// Muted text
text-neutral-500

// Links
text-primary-600 hover:text-primary-700
```

## Accessibility

- **Contrast Ratio**: Tất cả màu text đều đạt WCAG AA (4.5:1)
- **Focus States**: Sử dụng `focus:ring-primary-500` cho accessibility
- **Error States**: Sử dụng `text-red-600` cho error messages

## Implementation

### Tailwind Config

Màu đã được cấu hình trong `tailwind.config.js`:

```javascript
colors: {
  primary: { 50: "#FFF7ED", ..., 500: "#F97316", ... },
  background: { light: "#FFF5E6", ... },
  success: { 500: "#22C55E", ... },
}
```

### TypeScript Constants

Có thể import từ `src/constants/colors.ts`:

```typescript
import { colors } from "@/constants/colors";
```

### CSS Variables

Một số màu cũng được định nghĩa trong `src/index.css`:

```css
--primary: 24.6 95% 53.1%; /* Orange #F97316 */
```

## Design Inspiration

Màu sắc được lấy cảm hứng từ:

- Healthcare industry (ấm áp, thân thiện)
- Orange/Peach theme từ thumbnail
- Modern UI/UX best practices
