// Harper WASM — lazy singleton, client-side only.
// Never import this file at module level in SSR code.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let linterInstance: any = null;

export async function getLinter() {
  if (linterInstance) return linterInstance;

  // Dynamic import keeps WASM out of the SSR bundle entirely.
  const { LocalLinter, binary } = await import('harper.js');
  linterInstance = new LocalLinter({ binary });
  await linterInstance.setup();
  return linterInstance;
}

export type HarperIssue = {
  text: string;
  type: string;
  message: string;
  suggestion: string;
  isCorrect: boolean;
  position: number;
};

export async function lintText(text: string): Promise<HarperIssue[]> {
  const linter = await getLinter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lints: any[] = await linter.lint(text);

  return lints.map((lint) => {
    const span = lint.span();
    const suggestions = lint.suggestions() ?? [];
    const firstSuggestion = suggestions[0]?.get_replacement_text() ?? '';
    return {
      text: text.slice(span.start, span.end),
      type: mapLintKind(lint.lint_kind()),
      message: lint.message(),
      suggestion: firstSuggestion,
      isCorrect: false,
      position: span.start,
    };
  });
}

function mapLintKind(kind: string): string {
  const k = (kind ?? '').toLowerCase();
  if (k.includes('spell')) return 'spelling';
  if (k.includes('grammar') || k.includes('agreement')) return 'grammar';
  if (k.includes('style') || k.includes('readability')) return 'style';
  return 'grammar';
}
