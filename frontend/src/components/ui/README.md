# UI Components Library

This directory contains reusable UI components built with **shadcn/ui** and custom implementations.

## 📦 Installation Guide

### Step 1: Initialize shadcn/ui (if not done)

```bash
npx shadcn@latest init
```

This will create `components.json` in the project root.

### Step 2: Install Required shadcn/ui Components

Run these commands to install all required components:

```bash
# Group 1: General
npx shadcn@latest add button

# Group 2: Forms
npx shadcn@latest add input textarea select checkbox radio-group switch calendar popover

# Group 3: Display
npx shadcn@latest add table card avatar badge tooltip

# Group 4: Feedback
npx shadcn@latest add dialog sheet sonner

# Group 5: Navigation
npx shadcn@latest add breadcrumb pagination tabs dropdown-menu
```

**Or install all at once:**

```bash
npx shadcn@latest add button input textarea select checkbox radio-group switch calendar popover table card avatar badge tooltip dialog sheet sonner breadcrumb pagination tabs dropdown-menu
```

## 🎨 Custom Components

### Typography
A flexible typography system with variants for headings, paragraphs, and text styles.

```tsx
import { Typography } from "@/components/ui";

<Typography variant="h1">Heading 1</Typography>
<Typography variant="p" weight="medium">Paragraph text</Typography>
<Typography variant="muted" align="center">Muted text</Typography>
```

**Variants:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `lead`, `large`, `small`, `muted`, `blockquote`, `code`, `list`

### IconWrapper
Consistent icon sizing and styling wrapper.

```tsx
import { IconWrapper } from "@/components/ui";
import { User } from "lucide-react";

<IconWrapper icon={User} size="lg" label="User icon" />
```

**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

### Spinner
Loading spinner component with size and variant options.

```tsx
import { Spinner } from "@/components/ui";

<Spinner size="md" variant="default" label="Loading..." />
```

**Sizes:** `sm`, `md`, `lg`, `xl`  
**Variants:** `default`, `muted`, `destructive`, `success`

### FileUploader
Drag-and-drop file upload component with validation.

```tsx
import { FileUploader } from "@/components/ui";

<FileUploader
  onFilesSelected={(files) => console.log(files)}
  accept="image/*"
  multiple
  maxFiles={5}
  maxSize={5 * 1024 * 1024} // 5MB
  label="Upload images"
  description="PNG, JPG up to 5MB"
/>
```

**Features:**
- Drag and drop support
- File validation (size, count)
- File preview with remove option
- Multiple file support
- Customizable styling

### DatePicker
Date picker component wrapping shadcn Calendar and Popover.

**Note:** Requires `calendar` and `popover` components to be installed first.

```tsx
import { DatePicker } from "@/components/ui";

<DatePicker
  date={selectedDate}
  onDateChange={(date) => setSelectedDate(date)}
  placeholder="Select a date"
  fromDate={new Date()} // Minimum date
  toDate={futureDate} // Maximum date
/>
```

## 📚 Usage Examples

### Complete Form Example

```tsx
import { Input, Textarea, Select, Checkbox, DatePicker, FileUploader, Button } from "@/components/ui";

function MyForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Name" />
      <Textarea placeholder="Description" />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
      <DatePicker placeholder="Select date" />
      <FileUploader onFilesSelected={(files) => console.log(files)} />
      <Checkbox id="terms" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Table with Spinner

```tsx
import { Table, Spinner } from "@/components/ui";

function DataTable({ isLoading, data }) {
  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## 🔧 Component Dependencies

Some custom components depend on shadcn/ui components:

- **DatePicker** → Requires: `button`, `calendar`, `popover`
- **FileUploader** → Requires: `button`

Make sure to install these dependencies before using the custom components.

## 📝 Notes

- All components follow shadcn/ui patterns (using `cn`, `cva`, `forwardRef`)
- Components accept `className` prop for custom styling
- TypeScript types are fully exported
- Components are accessible (ARIA labels, keyboard navigation)

