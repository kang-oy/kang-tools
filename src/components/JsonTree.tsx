"use client";

import { useState } from "react";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function JsonNode({
  name,
  value,
  depth = 0,
  defaultExpanded = true,
}: {
  name?: string;
  value: JsonValue;
  depth?: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const indent = depth * 16;

  if (value === null) {
    return (
      <div className="flex items-baseline gap-1 font-mono text-sm" style={{ paddingLeft: indent }}>
        {name != null && <span className="json-key">&quot;{name}&quot;</span>}
        {name != null && <span className="text-[var(--color-muted)]">: </span>}
        <span className="json-null">null</span>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div className="flex items-baseline gap-1 font-mono text-sm" style={{ paddingLeft: indent }}>
        {name != null && <span className="json-key">&quot;{name}&quot;</span>}
        {name != null && <span className="text-[var(--color-muted)]">: </span>}
        <span className="json-boolean">{value ? "true" : "false"}</span>
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div className="flex items-baseline gap-1 font-mono text-sm" style={{ paddingLeft: indent }}>
        {name != null && <span className="json-key">&quot;{name}&quot;</span>}
        {name != null && <span className="text-[var(--color-muted)]">: </span>}
        <span className="json-number">{value}</span>
      </div>
    );
  }

  if (typeof value === "string") {
    return (
      <div className="flex items-baseline gap-1 font-mono text-sm" style={{ paddingLeft: indent }}>
        {name != null && <span className="json-key">&quot;{name}&quot;</span>}
        {name != null && <span className="text-[var(--color-muted)]">: </span>}
        <span className="json-string">&quot;{value}&quot;</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="font-mono text-sm">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 hover:opacity-80"
          style={{ paddingLeft: indent }}
        >
          <span className="text-[var(--color-muted)] select-none w-4">
            {expanded ? "▼" : "▶"}
          </span>
          {name != null && <span className="json-key">&quot;{name}&quot;</span>}
          {name != null && <span className="text-[var(--color-muted)]">: </span>}
          <span className="text-[var(--color-muted)]">
            [{value.length}]
          </span>
        </button>
        {expanded && (
          <div className="border-l border-[var(--color-border)] ml-2 mt-0.5">
            {value.map((item, i) => (
              <JsonNode
                key={i}
                name={String(i)}
                value={item}
                depth={depth + 1}
                defaultExpanded={depth < 2}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const entries = Object.entries(value);
  return (
    <div className="font-mono text-sm">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center gap-1 hover:opacity-80"
        style={{ paddingLeft: indent }}
      >
        <span className="text-[var(--color-muted)] select-none w-4">
          {expanded ? "▼" : "▶"}
        </span>
        {name != null && <span className="json-key">&quot;{name}&quot;</span>}
        {name != null && <span className="text-[var(--color-muted)]">: </span>}
        <span className="text-[var(--color-muted)]">
          {`{ ${entries.length} keys }`}
        </span>
      </button>
      {expanded && (
        <div className="border-l border-[var(--color-border)] ml-2 mt-0.5">
          {entries.map(([k, v]) => (
            <JsonNode
              key={k}
              name={k}
              value={v}
              depth={depth + 1}
              defaultExpanded={depth < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function isJsonValue(v: unknown): v is JsonValue {
  if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    return true;
  if (Array.isArray(v)) return v.every(isJsonValue);
  if (typeof v === "object" && v !== null)
    return Object.values(v).every(isJsonValue);
  return false;
}

export function JsonTree({ data }: { data: unknown }) {
  if (!isJsonValue(data)) return null;
  return (
    <div className="py-2">
      <JsonNode value={data} defaultExpanded={true} />
    </div>
  );
}
