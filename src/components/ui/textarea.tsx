// import * as React from "react";

// import { cn } from "@/lib/utils";

// export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
//   return (
//     <textarea
//       className={cn(
//         "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         className,
//       )}
//       ref={ref}
//       {...props}
//     />
//   );
// });
// Textarea.displayName = "Textarea";

// export { Textarea };


import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * TextareaProps
 * 
 * We use a type alias instead of an empty interface
 * to avoid the ESLint no-empty-object-type warning.
 */
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea Component
 *
 * - ForwardRef enabled
 * - Fully typed
 * - Accepts all native textarea props
 * - Supports custom className merging
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styling
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          // Focus styles
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled styles
          "disabled:cursor-not-allowed disabled:opacity-50",
          className // Allow custom overrides
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
