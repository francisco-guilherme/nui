import { OTPInput, OTPInputContext } from "input-otp";
import type { ReactNode } from "react";
import { useContext } from "react";

import { cn } from "../utils/cn";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      data-slot="input-otp"
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center", className)}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r bg-input text-sm shadow-xs outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/50",
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({
  children,
  ...props
}: React.ComponentProps<"hr"> & { children?: ReactNode }) {
  return children ? (
    <span data-slot="input-otp-separator" {...props}>
      {children}
    </span>
  ) : (
    <hr data-slot="input-otp-separator" {...props} />
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
