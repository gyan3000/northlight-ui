import { Controls, Description, Primary, Stories, Subtitle, Title, useOf } from "@storybook/addon-docs/blocks";
import type { ReactNode } from "react";
import { componentNotes } from "./component-notes";

const box: React.CSSProperties = {
  border: "1px solid rgba(128,128,128,0.35)",
  borderRadius: 8,
  padding: "12px 16px",
};

// Notes use `backticks` for code; render those spans as <code> without any HTML injection.
function inlineCode(text: string): ReactNode[] {
  return text.split(/`([^`]+)`/g).map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part));
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>
      {items.map((item) => (
        <li key={item}>{inlineCode(item)}</li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBlock: 32 }}>
      <h2 style={{ marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

/**
 * The docs page every component gets. The props table and examples come from
 * the code; "Usage" and "Accessibility" come from component-notes.ts.
 */
export function DocsPage() {
  const meta = useOf("meta", ["meta"]);
  const notes = componentNotes[meta.preparedMeta.title];

  return (
    <>
      <Title />
      <Subtitle>{notes?.use}</Subtitle>
      <Description />
      <Primary />
      <Controls />

      {notes && (
        <>
          <Section title="Usage">
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div style={box}>
                <h3 style={{ marginTop: 0 }}>✅ Do</h3>
                <List items={notes.dos} />
              </div>
              <div style={box}>
                <h3 style={{ marginTop: 0 }}>🚫 Don’t</h3>
                <List items={notes.donts} />
              </div>
            </div>
          </Section>

          <Section title="Accessibility">
            <h3>Keyboard</h3>
            <table style={{ borderCollapse: "collapse", inlineSize: "100%", marginBottom: 20 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "start", padding: 8, borderBottom: "1px solid rgba(128,128,128,0.35)" }}>Keys</th>
                  <th style={{ textAlign: "start", padding: 8, borderBottom: "1px solid rgba(128,128,128,0.35)" }}>What happens</th>
                </tr>
              </thead>
              <tbody>
                {notes.keyboard.map(([keys, action]) => (
                  <tr key={keys}>
                    <td style={{ padding: 8, whiteSpace: "nowrap", verticalAlign: "top", borderBottom: "1px solid rgba(128,128,128,0.2)" }}>
                      <kbd>{keys}</kbd>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid rgba(128,128,128,0.2)" }}>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Roles, states and relationships</h3>
            <List items={notes.aria} />
          </Section>
        </>
      )}

      <Stories includePrimary={false} />
    </>
  );
}
