<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<RULE>
# DESIGN_SYSTEM: Antigravity UI Conventions

All new components, pages, and features MUST strictly follow this design system to ensure consistency with the current premium dashboard experience.

## 1. Colors & Typography
- **Primary Palette (Emerald)**: Use `primary-50` to `primary-900`. Default primary is `primary-500` (#10B981).
- **Semantic Colors**: `success` (green), `warning` (amber), `danger` (red).
- **Layout Colors**: `slate-50` to `slate-900` for backgrounds, cards, borders, and texts.
- **Typography**: Inter font is default. Use the `@utility text-gradient` for highlighted or premium titles.

## 2. Glassmorphism & Cards
- **Base Style**: Main cards must use the `glass-card` utility class with `border-0`.
  - `glass-card` already provides: `bg-white/65`, `backdrop-blur-20px`, white border 80%, and a subtle shadow.
- **Radii**: Use heavily rounded corners. `rounded-2xl` for large cards/buttons, `rounded-xl` for icon containers.
- **Backgrounds**: For hero/premium elements, use gradients (e.g., `bg-gradient-to-br from-primary-500 to-primary-600`) with glow shadows.

## 3. Hover Effects & Micro-interactions
- **Cards/Buttons**: Always include a lift-up effect and shadow increase: `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`.
- **Group Interactivity**: Use `group` on parent containers and `group-hover:scale-110 transition-transform` on child icons to make the interface feel alive.
- **Background Opacity Changes**: For subtle background charts or decorative elements, increase opacity on hover (e.g., `opacity-20 group-hover:opacity-40 transition-opacity duration-300`).

## 4. Animations (Framer Motion)
- Use `framer-motion` for all page and list entrances.
- **Containers**: Use `staggerChildren: 0.1` to cascade elements in.
- **Items**: Enter from bottom with spring: `{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }`.

## 5. Shadows
- Rely on defined premium shadows: `--shadow-premium`, `--shadow-premium-hover`, `--shadow-primary-glow` (for important cards).

**CRITICAL**: Avoid generic flat designs. Always incorporate depth (shadows, blur), interactivity (transforms on hover), and the Emerald/Slate color scheme.
</RULE>
