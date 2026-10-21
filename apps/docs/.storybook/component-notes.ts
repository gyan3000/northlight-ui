// Hand-written guidance shown on every component's docs page, keyed by story title.
// Props tables are generated from TypeScript; this covers what types cannot say:
// when to use it, what to avoid, and how it behaves for keyboard and screen-reader users.
// Keep it truthful: every row here is something the component's tests exercise.

export interface ComponentNotes {
  /** One sentence on when to reach for this component. */
  use: string;
  dos: string[];
  donts: string[];
  /** [keys, what happens] */
  keyboard: Array<[string, string]>;
  /** Roles, states and relationships exposed to assistive technology. */
  aria: string[];
}

const NONE: Array<[string, string]> = [["Tab", "Not interactive; not in the Tab order."]];

export const componentNotes: Record<string, ComponentNotes> = {
  // ---------------------------------------------------------------- Actions
  "Actions/Button": {
    use: "Trigger an action: submit, save, delete, open something.",
    dos: ["Use a verb for the label: “Save changes”.", "Use `tone=\"danger\"` for destructive actions.", "Use `asChild` to render a link that looks like a button."],
    donts: ["Don't use a Button to navigate when a link will do.", "Don't put two solid buttons side by side; make the secondary one `outline` or `ghost`.", "Don't rely on the loading spinner alone: the label stays so the button keeps its name."],
    keyboard: [["Tab", "Moves focus to the button."], ["Enter / Space", "Activates it."]],
    aria: ["Native `button` (or your element via `asChild`).", "`loading` sets `aria-busy` and `aria-disabled`, and keeps the button focusable so screen-reader users do not lose their place.", "Icons are `aria-hidden`; the visible label is the name."],
  },
  "Actions/IconButton": {
    use: "An action with no room for a text label, such as a toolbar or table row.",
    dos: ["Always give a clear `label` (“Delete invoice”).", "Pair it with a `Tooltip` so sighted users see the label too."],
    donts: ["Don't use an icon whose meaning is not obvious without a tooltip.", "Don't omit `label`: it is required because there is no visible text."],
    keyboard: [["Tab", "Moves focus to the button."], ["Enter / Space", "Activates it."]],
    aria: ["Native `button` named by `aria-label` from `label`.", "The icon is `aria-hidden`."],
  },

  // ------------------------------------------------------------------ Forms
  "Forms/Input": {
    use: "Collect a single line of text.",
    dos: ["Always pair it with a `Label` or put it in a `FormField`.", "Use the right `type` (`email`, `tel`, `url`) for mobile keyboards and validation."],
    donts: ["Don't use the placeholder as the label: it disappears while typing.", "Don't signal an error by color alone; add error text."],
    keyboard: [["Tab", "Moves focus into and out of the field."], ["Type", "Edits the value."]],
    aria: ["Native `input`, named by its label.", "`invalid` sets `aria-invalid`.", "Inside `FormField`, hint and error text are linked with `aria-describedby`."],
  },
  "Forms/Label": {
    use: "Name a form control.",
    dos: ["Connect it with `htmlFor`, or wrap the control.", "Keep it short and visible."],
    donts: ["Don't hide labels for convenience; use `aria-label` only when there truly is no room.", "Don't use `required` alone: also set `required` on the control."],
    keyboard: NONE,
    aria: ["Native `label`.", "The required asterisk is `aria-hidden`; the control's own `required` is what is announced."],
  },
  "Forms/Checkbox": {
    use: "Let people choose any number of options, or confirm a single statement.",
    dos: ["Use `indeterminate` for a “select all” parent of a partly chosen group.", "Make the label text clickable (it is)."],
    donts: ["Don't use a Checkbox for an immediate on/off setting: use `Switch`.", "Don't use one for mutually exclusive choices: use `Radio`."],
    keyboard: [["Tab", "Moves focus to the checkbox."], ["Space", "Toggles it."]],
    aria: ["Native `input type=checkbox`, so it submits with forms.", "`indeterminate` is exposed as the mixed state.", "`invalid` sets `aria-invalid`."],
  },
  "Forms/Switch": {
    use: "A setting that takes effect immediately, like “Email notifications”.",
    dos: ["Label what it controls, not the action: “Notifications”, not “Turn on”.", "Apply the change right away."],
    donts: ["Don't use a Switch when a Save button is needed first: use `Checkbox`.", "Don't use it for choosing among options."],
    keyboard: [["Tab", "Moves focus to the switch."], ["Space", "Toggles it."]],
    aria: ["Native checkbox with `role=\"switch\"`, announced as an on/off switch.", "`checked` is the on state."],
  },
  "Forms/FormField": {
    use: "Wire a label, a control, hint text and an error message together.",
    dos: ["Wrap `Input`, `Textarea`, `Select` or `Combobox` in it.", "Explain how to fix an error, not just that there is one."],
    donts: ["Don't wrap `Checkbox`, `Switch` or `Radio`: they carry their own label text.", "Don't show an error before the person has had a chance to type."],
    keyboard: NONE,
    aria: ["The label targets the control through `htmlFor`.", "Hint and error text are linked with `aria-describedby`.", "An error sets `aria-invalid` on the control; `required` is passed to it."],
  },
  "Forms/Select": {
    use: "Choose one value from a short, fixed list (roughly 3 to 15 items).",
    dos: ["Use a `placeholder` that describes the choice.", "Use `Combobox` instead when the list is long and searchable."],
    donts: ["Don't use it for two or three options: use `Radio`.", "Don't put actions in it: use `DropdownMenu`."],
    keyboard: [["Enter / Space / ↓", "Opens the list."], ["↑ / ↓", "Moves between options."], ["Type", "Jumps to a matching option."], ["Enter", "Chooses the highlighted option."], ["Esc", "Closes without changing the value."]],
    aria: ["Trigger is a `combobox` with `aria-expanded`.", "The list is a `listbox` of `option`s.", "Hint, error and label come from `FormField`."],
  },
  "Forms/Textarea": {
    use: "Collect longer, multi-line text.",
    dos: ["Label it, like any field.", "Let it resize vertically (it does)."],
    donts: ["Don't use it for short answers: use `Input`.", "Don't truncate what people typed."],
    keyboard: [["Tab", "Moves focus into and out of the field."], ["Enter", "Starts a new line."]],
    aria: ["Native `textarea`, named by its label.", "`invalid` sets `aria-invalid`.", "Inside `FormField`, hint and error text are linked with `aria-describedby`."],
  },
  "Forms/Radio": {
    use: "Choose exactly one option from a small set, all visible at once.",
    dos: ["Name the group with `aria-label`.", "Pre-select the safest default when there is one."],
    donts: ["Don't use it for more than about 6 options: use `Select`.", "Don't use it when several can be chosen: use `Checkbox`."],
    keyboard: [["Tab", "Moves focus into the group (one stop) and out of it."], ["↑ ↓ ← →", "Moves to and selects the previous or next option."], ["Space", "Selects the focused option."]],
    aria: ["`radiogroup` containing `radio`s, with `aria-checked`.", "`invalid` on the group sets `aria-invalid`."],
  },
  "Forms/Slider": {
    use: "Pick a number, or a range, where approximate position matters more than the exact value.",
    dos: ["Give each thumb of a range its own name via `thumbLabels`.", "Show the current value in text nearby if it matters."],
    donts: ["Don't use a Slider when people need to type an exact number.", "Don't use very small steps that make keyboard control tedious."],
    keyboard: [["Tab", "Moves focus to each thumb."], ["← → ↑ ↓", "Change the value by one step."], ["Page Up / Page Down", "Change by ten steps."], ["Home / End", "Jump to the minimum or maximum."]],
    aria: ["Each thumb is a `slider` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.", "Named by `label` or by its entry in `thumbLabels`."],
  },
  "Forms/Combobox": {
    use: "Choose one value from a long list by typing to filter.",
    dos: ["Provide `emptyLabel` so “no results” is announced.", "Keep option labels short and distinct."],
    donts: ["Don't use it for a handful of options: use `Select`.", "Don't expect free text: the value must be one of the options."],
    keyboard: [["↓ / ↑", "Opens the list, then moves the highlight (skipping disabled options)."], ["Type", "Filters the list."], ["Home / End", "Highlight the first or last option."], ["Enter", "Chooses the highlighted option."], ["Esc", "Closes the list (not an enclosing Dialog) and restores the chosen text."], ["Tab", "Leaves the field; unfinished text resets to the chosen value."]],
    aria: ["Input has `role=\"combobox\"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`.", "Focus stays in the field; the highlight is exposed through `aria-activedescendant`.", "The list is a named `listbox`; “no results” is a `status` message."],
  },

  // --------------------------------------------------------------- Feedback
  "Feedback/Spinner": {
    use: "Show that something is loading when the wait is short or unknown.",
    dos: ["Give it a specific `label` (“Loading orders”).", "Use `Skeleton` for content that has a known shape."],
    donts: ["Don't leave a spinner running with no way out; add a timeout or an error state.", "Don't use it without a label."],
    keyboard: NONE,
    aria: ["`role=\"status\"` with the `label` text, announced politely.", "Slows down (does not stop) under reduced motion."],
  },
  "Feedback/Badge": {
    use: "A short status or count next to something else.",
    dos: ["Always include text: “Paid”, “3”.", "Pick the tone that matches the meaning."],
    donts: ["Don't let color be the only signal.", "Don't make it look clickable."],
    keyboard: NONE,
    aria: ["Plain text in a `span`, so it is read in place.", "Tone colors meet 4.5:1 contrast in both styles and themes."],
  },
  "Feedback/Alert": {
    use: "An inline message about the page or a form that stays until the situation changes.",
    dos: ["Use `danger` and `warning` only when attention is needed now.", "Say what happened and what to do next."],
    donts: ["Don't use an Alert for something that disappears on its own: use `Toast`.", "Don't stack many alerts."],
    keyboard: NONE,
    aria: ["`danger` and `warning` use `role=\"alert\"` (announced immediately).", "`info` and `success` use `role=\"status\"` (announced politely).", "The icon is `aria-hidden`; pass `role` to override."],
  },
  "Feedback/Toast": {
    use: "A brief confirmation or notice that does not need an answer.",
    dos: ["Mount `ToastProvider` once near the root.", "Keep messages short and don't hide essential information in them."],
    donts: ["Don't use a toast for errors people must act on: use `Alert`.", "Don't show many at once."],
    keyboard: [["F8", "Moves focus to the notifications region."], ["Tab", "Reaches a toast's close button."], ["Esc", "Dismisses the focused toast."]],
    aria: ["`danger` and `warning` are announced assertively, others politely.", "The notifications region is named (`viewportLabel`).", "Hovering or focusing a toast pauses its timer."],
  },
  "Feedback/Progress": {
    use: "Show how far a task has got, or that one is working with an unknown length.",
    dos: ["Give it a `label` (“Uploading report”).", "Omit `value` when you cannot know the total."],
    donts: ["Don't fake progress.", "Don't use it without a label."],
    keyboard: NONE,
    aria: ["`role=\"progressbar\"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`.", "Without a value it is indeterminate and has no `aria-valuenow`."],
  },
  "Feedback/Skeleton": {
    use: "A placeholder with the shape of content that is loading.",
    dos: ["Match the real layout so nothing jumps when content arrives.", "Mark the loading region `aria-busy=\"true\"`."],
    donts: ["Don't use it for waits under a second.", "Don't expect it to be announced: it is hidden from assistive tech."],
    keyboard: NONE,
    aria: ["`aria-hidden`: decorative.", "The shimmer is replaced by a still placeholder under reduced motion."],
  },

  // ----------------------------------------------------------------- Layout
  "Layout/Card": {
    use: "Group related content on one surface.",
    dos: ["Use a real heading inside for the card's title.", "Use `asChild` to render an `article` or a link."],
    donts: ["Don't nest cards.", "Don't make the whole card clickable and also put links inside it."],
    keyboard: NONE,
    aria: ["A plain container with no role of its own; its meaning comes from its content or from `asChild`."],
  },

  // --------------------------------------------------------------- Overlays
  "Overlays/Dialog": {
    use: "Interrupt to ask for a decision or short input.",
    dos: ["Give it a clear `title` and a `closeLabel`.", "Put the primary action last in the footer."],
    donts: ["Don't open one from another dialog.", "Don't use it for passive information: use `Alert`."],
    keyboard: [["Tab / Shift+Tab", "Cycles through the dialog only; focus is trapped."], ["Esc", "Closes it and returns focus to the trigger."]],
    aria: ["`role=\"dialog\"` named by `title`, described by `description`.", "Background is inert and scroll is locked.", "The corner close button is named by `closeLabel`."],
  },
  "Overlays/Tooltip": {
    use: "A short hint about a control, for example the name of an icon button.",
    dos: ["Keep it to a few words.", "Attach it to something focusable."],
    donts: ["Don't put essential information or links only in a tooltip.", "Don't use it on touch-only interactions."],
    keyboard: [["Tab", "Focusing the trigger shows the tooltip."], ["Esc", "Hides it."]],
    aria: ["`role=\"tooltip\"`, linked to the trigger with `aria-describedby`."],
  },
  "Overlays/DropdownMenu": {
    use: "A list of actions behind one button, such as “More”.",
    dos: ["Use `tone=\"danger\"` for destructive items.", "Group related items with `DropdownMenuSeparator`."],
    donts: ["Don't use it to choose a value: use `Select`.", "Don't hide the most common action in it."],
    keyboard: [["Enter / Space / ↓", "Opens the menu and focuses the first item."], ["↑ / ↓", "Moves between items, skipping disabled ones."], ["Type", "Jumps to a matching item."], ["Enter / Space", "Runs the item and closes the menu."], ["Esc", "Closes and returns focus to the trigger."]],
    aria: ["`role=\"menu\"` with `menuitem` and `menuitemcheckbox` children.", "The trigger exposes `aria-expanded` and `aria-haspopup`."],
  },
  "Overlays/Popover": {
    use: "A floating panel for richer content, such as a small filter form.",
    dos: ["Name it with `aria-label`.", "Keep it small and focused on one task."],
    donts: ["Don't use it for a plain hint: use `Tooltip`.", "Don't use it for a list of actions: use `DropdownMenu`."],
    keyboard: [["Enter / Space", "Opens it and moves focus inside."], ["Esc", "Closes it and returns focus to the trigger."], ["Tab", "Moves through its content."]],
    aria: ["`role=\"dialog\"` (non-modal) named by `aria-label`.", "The trigger exposes `aria-expanded`."],
  },
  "Overlays/Drawer": {
    use: "A panel that slides in for a secondary task, like filters or settings.",
    dos: ["Choose the edge that matches the content: `end` for details, `bottom` on small screens.", "Give it a `title` and `closeLabel`."],
    donts: ["Don't use it for a quick yes/no: use `Dialog`.", "Don't put the primary page content in one."],
    keyboard: [["Tab / Shift+Tab", "Cycles through the drawer only."], ["Esc", "Closes it and returns focus to the trigger."]],
    aria: ["`role=\"dialog\"` named by `title`, described by `description`.", "Background is inert and scroll is locked.", "`start` and `end` follow the text direction."],
  },

  // ------------------------------------------------------------- Navigation
  "Navigation/Tabs": {
    use: "Switch between related panels without leaving the page.",
    dos: ["Give the `TabsList` an `aria-label`.", "Keep tab labels short."],
    donts: ["Don't use tabs for steps that must be done in order.", "Don't use tabs for navigation between pages: use links."],
    keyboard: [["Tab", "Moves into the tab list (one stop), then to the open panel."], ["← →", "Move to and activate the previous or next tab."], ["Home / End", "Jump to the first or last tab."]],
    aria: ["`tablist`, `tab` and `tabpanel` with `aria-selected` and `aria-controls`.", "Disabled tabs are skipped."],
  },
  "Navigation/Accordion": {
    use: "Show and hide sections of content, such as FAQs.",
    dos: ["Use `type=\"single\"` with `collapsible` for FAQs.", "Write headers that describe the content."],
    donts: ["Don't hide content people need to see to complete a task.", "Don't nest accordions."],
    keyboard: [["Tab", "Moves between headers."], ["Enter / Space", "Opens or closes the section."], ["↑ ↓", "Move between headers."], ["Home / End", "Jump to the first or last header."]],
    aria: ["Each header is a button inside a heading (`h3`), with `aria-expanded` and `aria-controls`.", "Closed content is removed from the accessibility tree."],
  },
  "Navigation/Breadcrumb": {
    use: "Show where the current page sits in a hierarchy.",
    dos: ["Give it a `label`.", "Use `BreadcrumbPage` for the current page."],
    donts: ["Don't use it as the only navigation.", "Don't link the current page."],
    keyboard: [["Tab", "Moves through the links."], ["Enter", "Follows a link."]],
    aria: ["A `nav` landmark named by `label`, containing an ordered list.", "The current page has `aria-current=\"page\"`.", "Separators are `aria-hidden`."],
  },
  "Navigation/Pagination": {
    use: "Move between pages of results.",
    dos: ["Provide translated `label`, `previousLabel`, `nextLabel` and `pageLabel`.", "Keep the page in the URL if the list is shareable."],
    donts: ["Don't use it for infinite or unknown-length lists.", "Don't hide the current page."],
    keyboard: [["Tab", "Moves through the buttons."], ["Enter / Space", "Goes to that page."]],
    aria: ["A `nav` landmark named by `label`.", "The current page has `aria-current=\"page\"`.", "Ellipses are `aria-hidden`; previous and next are disabled at the ends."],
  },

  // ----------------------------------------------------------- Data display
  "Data display/Avatar": {
    use: "Show a person or entity as a small round image.",
    dos: ["Give a meaningful `alt` (the person's name).", "Provide initials as `fallback`."],
    donts: ["Don't put text inside the image.", "Don't use `alt` that repeats nearby text; pass `\"\"` to make it decorative."],
    keyboard: NONE,
    aria: ["One `img` named by `alt`, whether the photo or the initials are showing.", "With `alt=\"\"` it is decorative and ignored."],
  },
  "Data display/Table": {
    use: "Compare structured data across rows and columns.",
    dos: ["Use `TableHead` for headers and `scope=\"row\"` for row headers.", "Give the table a `TableCaption` or an accessible name.", "Use `TableSortHead` for sortable columns."],
    donts: ["Don't use a table for layout.", "Don't sort more than one column at a time."],
    keyboard: [["Tab", "Reaches sort buttons. When the table overflows its box, also focuses the scroll area."], ["Enter / Space", "Sorts a column."], ["← →", "Scroll the focused table sideways."]],
    aria: ["Real `table`, `row`, `columnheader`, `rowheader` and `cell` semantics.", "Sorted columns expose `aria-sort`.", "When it overflows, the scroll box becomes a named `region` that can take focus."],
  },

  // ------------------------------------------------------------ Foundations
  "Foundations/Box": {
    use: "A container with spacing, radius and a surface taken from the theme.",
    dos: ["Use `as` for the right element (`section`, `article`).", "Use it instead of ad hoc `div` styles."],
    donts: ["Don't add colors or spacing outside the tokens."],
    keyboard: NONE,
    aria: ["No role of its own; use `as` or `asChild` to give it the right semantics."],
  },
  "Foundations/Stack": {
    use: "Lay children out in a line with consistent spacing.",
    dos: ["Use `direction=\"row\"` with `wrap` for button groups.", "Use `as=\"ul\"` for real lists."],
    donts: ["Don't use margins between children."],
    keyboard: NONE,
    aria: ["No role of its own. Row direction flips automatically in right-to-left layouts."],
  },
  "Foundations/Text": {
    use: "Text with the theme's type scale, weights and tones.",
    dos: ["Choose the element with `as` for meaning (`h2`, `p`), and the look with `size`.", "Use `truncate` only where the full text is available elsewhere."],
    donts: ["Don't pick a heading level for its size.", "Don't use `tone` colors as the only signal."],
    keyboard: NONE,
    aria: ["Renders a `span` by default; `as` sets the semantics."],
  },
  "Foundations/Icon": {
    use: "Size and align an icon, and handle its accessibility.",
    dos: ["Leave it decorative next to visible text.", "Pass `label` when the icon stands alone and carries meaning."],
    donts: ["Don't use an icon alone for something important without a label."],
    keyboard: NONE,
    aria: ["Decorative by default (`aria-hidden`).", "With `label` it is `role=\"img\"` with that name."],
  },
};
