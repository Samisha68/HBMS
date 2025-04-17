declare module "@/components/ui/tabs" {
  import * as React from "react"
  import * as TabsPrimitive from "@radix-ui/react-tabs"

  export const Tabs: typeof TabsPrimitive.Root
  export const TabsList: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>
  export const TabsTrigger: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>
  export const TabsContent: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>
}

declare module "@/components/ui/dialog" {
  import * as React from "react"
  import * as DialogPrimitive from "@radix-ui/react-dialog"

  export const Dialog: typeof DialogPrimitive.Root
  export const DialogTrigger: typeof DialogPrimitive.Trigger
  export const DialogContent: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>
  export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>
  export const DialogTitle: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>
  export const DialogDescription: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>
}

declare module "@/components/ui/select" {
  import * as React from "react"
  import * as SelectPrimitive from "@radix-ui/react-select"

  export const Select: typeof SelectPrimitive.Root
  export const SelectGroup: typeof SelectPrimitive.Group
  export const SelectValue: typeof SelectPrimitive.Value
  export const SelectTrigger: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>
  export const SelectContent: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>
  export const SelectLabel: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>
  export const SelectItem: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>
  export const SelectSeparator: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>>
} 