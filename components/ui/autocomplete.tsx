"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AutocompleteProps<T> = {
	inputValue: string;
	onInputValueChange: (value: string) => void;
	items: Array<T>;
	getKey: (item: T) => string;
	getLabel: (item: T) => string;
	onSelect: (item: T) => void;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
	listClassName?: string;
	emptyMessage?: string;
	disabled?: boolean;
	renderItem?: (
		item: T,
		state: { selected: boolean; highlighted: boolean },
	) => React.ReactNode;
};

export function Autocomplete<T>(props: AutocompleteProps<T>) {
	const {
		inputValue,
		onInputValueChange,
		items,
		getKey,
		getLabel,
		onSelect,
		placeholder,
		className,
		inputClassName,
		listClassName,
		emptyMessage = "No results",
		disabled,
		renderItem,
	} = props;

	const [open, setOpen] = React.useState(false);
	const [highlightedIndex, setHighlightedIndex] = React.useState(0);
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const listRef = React.useRef<HTMLDivElement | null>(null);
	const listId = React.useId();

	React.useEffect(() => {
		// Reset highlight when items change
		setHighlightedIndex(0);
	}, [items]);

	const hasItems = items.length > 0;
	const shouldOpen = open && (hasItems || inputValue.trim() !== "");

	const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (!shouldOpen) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightedIndex((i) => (i + 1) % Math.max(items.length, 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightedIndex(
				(i) => (i - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1),
			);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const item = items[highlightedIndex];
			if (item) {
				onSelect(item);
				setOpen(false);
			}
		} else if (e.key === "Escape") {
			setOpen(false);
			inputRef.current?.blur();
		}
	};

	const onInputFocus: React.FocusEventHandler<HTMLInputElement> = () => {
		setOpen(true);
	};

	const onInputBlur: React.FocusEventHandler<HTMLInputElement> = () => {
		// Delay closing to allow click selection
		requestAnimationFrame(() => {
			if (!listRef.current?.contains(document.activeElement)) {
				setOpen(false);
			}
		});
	};

	return (
		<div className={cn("w-full", className)}>
			<input
				ref={inputRef}
				value={inputValue}
				onChange={(e) => onInputValueChange(e.target.value)}
				onFocus={onInputFocus}
				onBlur={onInputBlur}
				onKeyDown={handleKeyDown}
				disabled={disabled}
				className={cn(
					"w-full rounded-md border border-slate-800 bg-slate-950 p-2 outline-none",
					inputClassName,
				)}
				placeholder={placeholder}
				aria-autocomplete="list"
				aria-expanded={shouldOpen}
				aria-controls={shouldOpen ? listId : undefined}
				role="combobox"
			/>
			<div
				ref={listRef}
				id={listId}
				className={cn(
					"mt-2 max-h-40 overflow-auto rounded-md border border-slate-800 bg-slate-900",
					shouldOpen ? "block" : "hidden",
					listClassName,
				)}
				role="listbox"
				tabIndex={-1}
			>
				{!hasItems ? (
					<div className="p-2 text-sm opacity-60">{emptyMessage}</div>
				) : (
					items.map((item, idx) => {
						const key = getKey(item);
						const label = getLabel(item);
						const highlighted = idx === highlightedIndex;
						return (
							<button
								type="button"
								key={key}
								role="option"
								aria-selected={highlighted}
								className={cn(
									"w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:outline-none",
									highlighted && "bg-slate-800",
								)}
								onMouseEnter={() => setHighlightedIndex(idx)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => {
									onSelect(item);
									setOpen(false);
									inputRef.current?.focus();
								}}
							>
								{renderItem ? (
									renderItem(item, { selected: highlighted, highlighted })
								) : (
									<span>{label}</span>
								)}
							</button>
						);
					})
				)}
			</div>
		</div>
	);
}

export default Autocomplete;
