import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "../display/popover";
import { Button } from "../general/button";
import { Calendar } from "./calendar";

export interface DatePickerProps
  extends Omit<ComponentPropsWithoutRef<"button">, "onChange"> {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      date,
      onDateChange,
      placeholder = "Pick a date",
      disabled = false,
      className,
      fromDate,
      toDate,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedDate: Date | undefined): void => {
      if (selectedDate instanceof Date) {
        onDateChange?.(selectedDate);
        setOpen(false);
      } else {
        onDateChange?.(undefined);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleSelect}
            fromDate={fromDate}
            toDate={toDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
