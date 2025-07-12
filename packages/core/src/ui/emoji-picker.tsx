import type {
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListEmojiProps,
} from "frimousse";
import { EmojiPicker as BaseEmojiPicker } from "frimousse";
import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

// Simplified type definitions that work with ForwardRef components
type BaseProps<T> = T extends React.ComponentType<infer P>
  ? P & { className?: string }
  : { className?: string };

// Root component
function EmojiPicker({
  className,
  ...props
}: BaseProps<typeof BaseEmojiPicker.Root>) {
  return (
    <BaseEmojiPicker.Root
      className={cn(
        "isolate flex h-80 w-fit flex-col rounded-md border bg-popover shadow-md",
        className
      )}
      data-slot="emoji-picker"
      {...props}
    />
  );
}

// Search component with wrapper
function EmojiPickerSearch({
  className,
  wrapperClassName,
  ...props
}: BaseProps<typeof BaseEmojiPicker.Search> & {
  wrapperClassName?: string;
}) {
  return (
    <div
      className={cn("p-2", wrapperClassName)}
      data-slot="emoji-picker-search-wrapper"
    >
      <BaseEmojiPicker.Search
        className={cn(
          "z-50 flex h-9 w-full min-w-0 rounded-md border bg-input px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/50 md:text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

// Content component
function EmojiPickerContent({
  className,
  ...props
}: BaseProps<typeof BaseEmojiPicker.Viewport>) {
  return (
    <BaseEmojiPicker.Viewport
      className={cn("relative flex-1 outline-hidden", className)}
      data-slot="emoji-picker-content"
      {...props}
    />
  );
}

// Loading component
function EmojiPickerLoading({
  className,
  ...props
}: BaseProps<typeof BaseEmojiPicker.Loading>) {
  return (
    <BaseEmojiPicker.Loading
      className={cn(
        "absolute inset-0 flex items-center justify-center text-muted-foreground text-sm",
        className
      )}
      data-slot="emoji-picker-loading"
      {...props}
    />
  );
}

// Empty component
function EmojiPickerEmpty({
  className,
  ...props
}: BaseProps<typeof BaseEmojiPicker.Empty>) {
  return (
    <BaseEmojiPicker.Empty
      className={cn(
        "absolute inset-0 flex items-center justify-center text-muted-foreground text-sm",
        className
      )}
      data-slot="emoji-picker-empty"
      {...props}
    />
  );
}

// Skin tone selector component
function EmojiPickerSkinToneSelector({
  className,
  ...props
}: BaseProps<typeof BaseEmojiPicker.SkinToneSelector>) {
  return (
    <BaseEmojiPicker.SkinToneSelector
      className={cn(
        "mx-2 mb-1.5 size-8 rounded-md bg-popover text-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      data-slot="emoji-picker-skin-tone-selector"
      {...props}
    />
  );
}

// List sub-components
function EmojiPickerCategoryHeader({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) {
  return (
    <div
      className="bg-popover px-3 pb-1.5 font-medium text-muted-foreground text-xs"
      data-slot="emoji-picker-list-category-header"
      {...props}
    >
      {category.label}
    </div>
  );
}

function EmojiPickerRow({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="scroll-my-1.5 px-1.5"
      data-slot="emoji-picker-list-row"
      {...props}
    >
      {children}
    </div>
  );
}

function EmojiPickerEmoji({ emoji, ...props }: EmojiPickerListEmojiProps) {
  return (
    <button
      className="flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 data-active:bg-accent"
      data-slot="emoji-picker-list-emoji"
      {...props}
    >
      {emoji.emoji}
    </button>
  );
}

// List component
function EmojiPickerList({
  className,
  ...props
}: BaseProps<typeof BaseEmojiPicker.List>) {
  return (
    <BaseEmojiPicker.List
      className={cn("select-none pb-2", className)}
      components={{
        CategoryHeader: EmojiPickerCategoryHeader,
        Row: EmojiPickerRow,
        Emoji: EmojiPickerEmoji,
      }}
      data-slot="emoji-picker-list"
      {...props}
    />
  );
}

export {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerLoading,
  EmojiPickerEmpty,
  EmojiPickerList,
  EmojiPickerSkinToneSelector,
};
