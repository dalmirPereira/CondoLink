import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-condoBlue disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-condoBlue text-neutralWhite shadow-sm hover:bg-[#1767bf] focus-visible:ring-condoBlue",
        destructive:
          "bg-alertCoral text-neutralWhite shadow-sm hover:bg-[#d43d3d] focus-visible:ring-alertCoral",
        outline:
          "border border-concreteGray bg-neutralWhite text-deepTealBlue shadow-sm hover:bg-concreteGray hover:text-condoBlue focus-visible:ring-condoBlue",
        secondary:
          "bg-leafGreen text-neutralWhite shadow-sm hover:bg-[#3b8a3f] focus-visible:ring-leafGreen",
        ghost:
          "bg-transparent text-deepTealBlue hover:bg-concreteGray hover:text-condoBlue focus-visible:ring-condoBlue",
        link:
          "text-condoBlue underline-offset-4 hover:underline focus-visible:ring-transparent",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-9 px-4 py-1.5 has-[>svg]:px-3",
        lg: "h-12 px-7 py-3 has-[>svg]:px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
