"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Issue = {
  text: string;
  type: string;
  message: string;
  suggestion: string;
  isCorrect: boolean;
  position: number;
};

type Document = {
  id: string;
  title: string;
  content: string;
  word_count: number;
  updated_at: string;
};

function formatUpdated(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

// --- CSS Custom Highlight API helpers ---

function injectHighlightStyles() {
  if (document.getElementById('grammar-highlight-styles')) return;
  const style = document.createElement('style');
  style.id = 'grammar-highlight-styles';
  style.textContent = `
    ::highlight(grammar-spelling) {
      text-decoration-line: underline;
      text-decoration-style: wavy;
      text-decoration-color: #ef4444;
      text-decoration-thickness: 2px;
    }
    ::highlight(grammar-grammar) {
      text-decoration-line: underline;
      text-decoration-style: wavy;
      text-decoration-color: #f59e0b;
      text-decoration-thickness: 2px;
    }
    ::highlight(grammar-style) {
      text-decoration-line: underline;
      text-decoration-style: wavy;
      text-decoration-color: #3b82f6;
      text-decoration-thickness: 2px;
    }
    ::highlight(grammar-nigerian) {
      text-decoration-line: underline;
      text-decoration-style: dotted;
      text-decoration-color: #16a34a;
      text-decoration-thickness: 2px;
    }
    ::highlight(grammar-pidgin) {
      text-decoration-line: underline;
      text-decoration-style: dotted;
      text-decoration-color: #7c3aed;
      text-decoration-thickness: 2px;
    }
  `;
  document.head.appendChild(style);
}

function getTextNodeAtOffset(
  container: Node,
  targetOffset: number
): { node: Text; offset: number } | null {
  let currentOffset = 0;
  function traverse(node: Node): { node: Text; offset: number } | null {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      const length = textNode.length;
      if (currentOffset + length >= targetOffset) {
        return { node: textNode, offset: targetOffset - currentOffset };
      }
      currentOffset += length;
      return null;
    }
    for (const child of Array.from(node.childNodes)) {
      const result = traverse(child);
      if (result) return result;
    }
    return null;
  }
  return traverse(container);
}

const HIGHLIGHT_NAMES = [
  'grammar-spelling',
  'grammar-grammar',
  'grammar-style',
  'grammar-nigerian',
  'grammar-pidgin',
] as const;

function applyHighlights(editor: HTMLDivElement, issues: Issue[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (!w.CSS?.highlights || !w.Highlight) return;
  injectHighlightStyles();
  const cssHL = w.CSS.highlights;

  for (const name of HIGHLIGHT_NAMES) cssHL.delete(name);
  if (issues.length === 0) return;

  const groups: Record<string, Range[]> = {};
  for (const issue of issues) {
    const start = getTextNodeAtOffset(editor, issue.position);
    const end = getTextNodeAtOffset(editor, issue.position + issue.text.length);
    if (!start || !end) continue;
    const range = new Range();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    const key = `grammar-${issue.type}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(range);
  }
  for (const [name, ranges] of Object.entries(groups)) {
    cssHL.set(name, new w.Highlight(...ranges));
  }
}

// ----------------------------------------

function EditorPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const grammarTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentDocIdRef = useRef<string | null>(null);
  const documentTitleRef = useRef("Untitled Document");
  const userPlanRef = useRef("free");
  const checksUsedRef = useRef(0);
  const lastCheckedTextRef = useRef<string>("");

  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState("free");
  const [userEmail, setUserEmail] = useState("");
  const [checksUsed, setChecksUsed] = useState(0);
  const checksLimit = 100;
  const freeDocLimit = 3;
  const freeWordLimit = 1500;
  const [languageMode, setLanguageMode] = useState("nigerian-english");
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [saveStatusColor, setSaveStatusColor] = useState("text-gray-500");
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docContentLoading, setDocContentLoading] = useState(false);
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Modals
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showIssuesSheet, setShowIssuesSheet] = useState(false);
  const [showWordLimitModal, setShowWordLimitModal] = useState(false);
  const [warningChecks, setWarningChecks] = useState(80);
  const [resetDays, setResetDays] = useState(12);

  const isPro = userPlan === "pro";

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam) setLanguageMode(modeParam);

    // Days until month reset
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    setResetDays(
      Math.ceil((nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    // Load plan from Supabase; fall back to localStorage cache
    async function loadUserData() {
      const cachedPlan = localStorage.getItem("userPlan") || "free";
      const cachedChecks = parseInt(localStorage.getItem("checksUsed") || "0");
      setUserPlan(cachedPlan);
      setChecksUsed(cachedChecks);
      checksUsedRef.current = cachedChecks;

      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          const plan = data.plan ?? "free";
          const checks = data.checks_used ?? 0;
          const defaultMode = data.mode ?? "nigerian-english";
          setUserPlan(plan);
          userPlanRef.current = plan;
          setChecksUsed(checks);
          checksUsedRef.current = checks;
          setUserEmail(data.email ?? "");
          if (!modeParam) setLanguageMode(defaultMode);
          localStorage.setItem("userPlan", plan);
          localStorage.setItem("checksUsed", String(checks));

          setDocsLoading(true);
          const docsRes = await fetch("/api/documents");
          if (docsRes.ok) {
            const docs: Document[] = await docsRes.json();
            setDocuments(docs);
            if (docs.length > 0) {
              // Load full content of first document
              const first = await fetch(`/api/documents/${docs[0].id}`);
              if (first.ok) {
                const { content } = await first.json();
                if (editorRef.current) editorRef.current.innerHTML = content;
                const words = (editorRef.current?.textContent || "")
                  .trim()
                  .split(/\s+/)
                  .filter((w) => w.length > 0);
                setWordCount(words.length);
                setReadingTime(Math.ceil(words.length / 250));
              }
              setDocumentTitle(docs[0].title);
              documentTitleRef.current = docs[0].title;
              currentDocIdRef.current = docs[0].id;
              setCurrentDocId(docs[0].id);
            }
          }
          setDocsLoading(false);
        } else {
          // Not logged in — use localStorage only
          // Try to get email from Supabase auth directly (client-side)
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.email) setUserEmail(user.email);
        }
      } catch {
        // Network error — fall through to cached values
      }
    }

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) setShowUserMenu(false);
      if (!target.closest("[data-export-menu]")) setShowExportMenu(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Apply CSS Custom Highlight API underlines whenever issues change
  useEffect(() => {
    if (!editorRef.current) return;
    applyHighlights(editorRef.current, issues);
  }, [issues]);

  // Warn before unload if unsaved
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [unsavedChanges]);

  const checkGrammarWithHarper = useCallback(
    async (text: string, used: number, plan: string) => {
      // Skip counting if the text hasn't changed since the last check
      const textChanged = text !== lastCheckedTextRef.current;
      lastCheckedTextRef.current = text;

      let newUsed = used;

      if (plan === "free" && textChanged) {
        newUsed = used + 1;
        localStorage.setItem("checksUsed", String(newUsed));
        setChecksUsed(newUsed);
        checksUsedRef.current = newUsed;

        if (newUsed === 80) {
          setWarningChecks(newUsed);
          setShowWarningModal(true);
        } else if (newUsed >= 110) {
          setShowLimitModal(true);
          if (editorRef.current) editorRef.current.contentEditable = "false";
          return;
        }

        // Sync check count to Supabase (fire-and-forget)
        fetch("/api/user/checks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checksUsed: newUsed }),
        }).catch(() => {
          /* ignore — not critical */
        });
      }

      if (!text.trim()) {
        setIssues([]);
        return;
      }

      // Standard English → use Harper WASM linter
      if (languageMode === "standard-english") {
        try {
          const { lintText } = await import("@/lib/grammar/harper");
          const harperIssues = await lintText(text);
          setIssues(harperIssues);
        } catch (err) {
          console.error("Harper lint error:", err);
          setIssues([]);
        }
        return;
      }

      // Nigerian English → Harper + Nigerian filter + Nigerian-specific rules
      if (languageMode === "nigerian-english") {
        try {
          const { lintText } = await import("@/lib/grammar/harper");
          const { filterNigerianIssues } = await import("@/lib/grammar/nigerian");
          const harperIssues = await lintText(text);
          const nigerianIssues = filterNigerianIssues(harperIssues, text);
          setIssues(nigerianIssues);
        } catch (err) {
          console.error("Nigerian lint error:", err);
          setIssues([]);
        }
        return;
      }

      // Pidgin → custom rule engine
      if (languageMode === "pidgin") {
        try {
          const { lintPidgin } = await import("@/lib/grammar/pidgin");
          const pidginIssues = lintPidgin(text);
          setIssues(pidginIssues);
        } catch (err) {
          console.error("Pidgin lint error:", err);
          setIssues([]);
        }
        return;
      }

      setIssues([]);
    },
    [languageMode],
  );

  const performAutoSave = useCallback(async () => {
    const content = editorRef.current?.innerHTML || "";
    const text = editorRef.current?.textContent || "";
    if (!content.trim() && !text.trim()) return;

    // Don't auto-save if free user exceeds word limit
    if (userPlanRef.current !== "pro") {
      const wc = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (wc > 1500) return;
    }
    setSaveStatus("Saving...");
    setSaveStatusColor("text-gray-400");
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const wc = words.length;
    const title = documentTitleRef.current;
    const docId = currentDocIdRef.current;

    if (docId) {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, word_count: wc }),
      });
      if (res.ok) {
        setSaveStatus("Saved");
        setSaveStatusColor("text-green-600");
        setUnsavedChanges(false);
        setTimeout(() => setSaveStatusColor("text-gray-500"), 2000);
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === docId
              ? {
                  ...d,
                  title,
                  word_count: wc,
                  updated_at: new Date().toISOString(),
                }
              : d,
          ),
        );
      }
    } else {
      // Free users: check doc limit before creating
      if (userPlanRef.current !== "pro") {
        const currentDocs = await fetch("/api/documents").then(r => r.ok ? r.json() : []);
        if (Array.isArray(currentDocs) && currentDocs.length >= 3) {
          setSaveStatus("Doc limit reached");
          setSaveStatusColor("text-red-500");
          return;
        }
      }
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, word_count: wc }),
      });
      if (res.ok) {
        const doc: Document = await res.json();
        currentDocIdRef.current = doc.id;
        setCurrentDocId(doc.id);
        setDocuments((prev) => [doc, ...prev]);
        setSaveStatus("Saved");
        setSaveStatusColor("text-green-600");
        setUnsavedChanges(false);
        setTimeout(() => setSaveStatusColor("text-gray-500"), 2000);
      }
    }
  }, []);

  const handleEditorInput = useCallback(() => {
    const text = editorRef.current?.textContent || "";
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    setWordCount(words.length);
    setReadingTime(Math.ceil(words.length / 250));

    // Word limit for free users
    if (userPlanRef.current !== "pro" && words.length > freeWordLimit) {
      setSaveStatus(`Over ${freeWordLimit} word limit`);
      setSaveStatusColor("text-red-500");
      setShowWordLimitModal(true);
      return; // Don't auto-save or grammar check over-limit text
    }

    setUnsavedChanges(true);
    setSaveStatus("Unsaved changes");
    setSaveStatusColor("text-yellow-600");

    if (grammarTimeout.current) clearTimeout(grammarTimeout.current);
    grammarTimeout.current = setTimeout(() => {
      checkGrammarWithHarper(text, checksUsedRef.current, userPlanRef.current);
    }, 1000);

    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    const delay = userPlanRef.current === "pro" ? 2000 : 4000;
    autoSaveTimeout.current = setTimeout(performAutoSave, delay);
  }, [checkGrammarWithHarper, performAutoSave]);

  const applySuggestion = useCallback((issue: Issue) => {
    const editor = editorRef.current;
    if (!editor) return;

    const text = editor.textContent || "";
    // Verify the text at the expected position still matches
    const actual = text.slice(issue.position, issue.position + issue.text.length);
    if (actual !== issue.text) return; // stale — skip silently

    const replacement = issue.suggestion || "";

    // Use Range API to replace only the matched span — preserves line breaks / DOM structure
    let start = getTextNodeAtOffset(editor, issue.position);
    const end = getTextNodeAtOffset(editor, issue.position + issue.text.length);
    if (!start || !end) return;

    // If start resolved to the very end of a text node, advance to the next text node.
    // This happens at paragraph boundaries (e.g. first char of paragraph 2).
    if (start.offset === start.node.length) {
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
      walker.currentNode = start.node;
      const next = walker.nextNode() as Text | null;
      if (next) start = { node: next, offset: 0 };
    }

    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    range.deleteContents();
    if (replacement) range.insertNode(document.createTextNode(replacement));

    const newText = editor.textContent || "";

    // Optimistically remove this issue and shift positions for remaining issues
    const delta = replacement.length - issue.text.length;
    setIssues(prev =>
      prev
        .filter(i => i !== issue)
        .map(i =>
          i.position > issue.position
            ? { ...i, position: i.position + delta }
            : i,
        ),
    );

    // Helper to sync word count, save status, auto-save, and re-lint
    const syncAfterEdit = (txt: string) => {
      const words = txt.trim().split(/\s+/).filter(w => w.length > 0);
      setWordCount(words.length);
      setReadingTime(Math.ceil(words.length / 250));
      setUnsavedChanges(true);
      setSaveStatus("Unsaved changes");
      setSaveStatusColor("text-yellow-600");
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
      const delay = userPlanRef.current === "pro" ? 2000 : 4000;
      autoSaveTimeout.current = setTimeout(performAutoSave, delay);
      if (grammarTimeout.current) clearTimeout(grammarTimeout.current);
      grammarTimeout.current = setTimeout(() => {
        checkGrammarWithHarper(txt, checksUsedRef.current, userPlanRef.current);
      }, 1000);
    };

    syncAfterEdit(newText);

    // Show undo toast — capture what we need to reverse the fix
    const undoPosition = issue.position;
    const undoOriginal = issue.text;
    const undoReplacement = replacement;
    const removedIssue = issue;

    toast(`Fixed: "${issue.text}" → "${replacement}"`, {
      action: {
        label: "Undo",
        onClick: () => {
          const ed = editorRef.current;
          if (!ed) return;
          const currentText = ed.textContent || "";
          // Verify the replacement is still at the expected position
          const actual = currentText.slice(undoPosition, undoPosition + undoReplacement.length);
          if (actual !== undoReplacement) return;

          let uStart = getTextNodeAtOffset(ed, undoPosition);
          const uEnd = getTextNodeAtOffset(ed, undoPosition + undoReplacement.length);
          if (!uStart || !uEnd) return;
          if (uStart.offset === uStart.node.length) {
            const walker = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
            walker.currentNode = uStart.node;
            const next = walker.nextNode() as Text | null;
            if (next) uStart = { node: next, offset: 0 };
          }
          const uRange = document.createRange();
          uRange.setStart(uStart.node, uStart.offset);
          uRange.setEnd(uEnd.node, uEnd.offset);
          uRange.deleteContents();
          if (undoOriginal) uRange.insertNode(document.createTextNode(undoOriginal));

          // Restore the issue back into the list
          setIssues(prev => {
            const restored = prev.map(i =>
              i.position > undoPosition
                ? { ...i, position: i.position - delta }
                : i,
            );
            restored.push(removedIssue);
            restored.sort((a, b) => a.position - b.position);
            return restored;
          });

          syncAfterEdit(ed.textContent || "");
        },
      },
      duration: 5000,
    });
  }, [checkGrammarWithHarper, performAutoSave]);

  const scrollToIssue = useCallback((issue: Issue) => {
    const editor = editorRef.current;
    if (!editor) return;
    const start = getTextNodeAtOffset(editor, issue.position);
    const end = getTextNodeAtOffset(editor, issue.position + issue.text.length);
    if (!start || !end) return;
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    const rect = range.getBoundingClientRect();
    const scrollContainer = editor.closest('.overflow-y-auto');
    if (!scrollContainer) return;
    const containerRect = scrollContainer.getBoundingClientRect();
    // Scroll so the issue text is roughly centered vertically
    const scrollTop = scrollContainer.scrollTop + rect.top - containerRect.top - containerRect.height / 3;
    scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });

    // Flash a brief selection highlight so the user sees where it is
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
      setTimeout(() => sel.removeAllRanges(), 1500);
    }
  }, []);

  const handleLanguageModeChange = (mode: string) => {
    setLanguageMode(mode);
  };

  // Re-run grammar check whenever the language mode changes
  useEffect(() => {
    const text = editorRef.current?.textContent || "";
    if (!text.trim()) return;
    checkGrammarWithHarper(text, checksUsed, userPlan);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageMode]);

  const handleSave = useCallback(async () => {
    if (userPlanRef.current !== "pro") {
      const text = editorRef.current?.textContent || "";
      const wc = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (wc > freeWordLimit) {
        setShowWordLimitModal(true);
        return;
      }
    }
    // Cancel any pending auto-save so we don't save twice
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
      autoSaveTimeout.current = null;
    }
    await performAutoSave();
    toast.success("Document saved!");
  }, [performAutoSave]);

  // Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  const handleDeleteDoc = async () => {
    if (!deleteDocId) return;
    setDeletingDocId(deleteDocId);
    const res = await fetch(`/api/documents/${deleteDocId}`, { method: 'DELETE' });
    if (res.ok) {
      setDocuments(prev => prev.filter(d => d.id !== deleteDocId));
      // If the deleted doc was open, clear the editor
      if (currentDocIdRef.current === deleteDocId) {
        if (editorRef.current) editorRef.current.innerHTML = '';
        const newTitle = 'Untitled Document';
        setDocumentTitle(newTitle);
        documentTitleRef.current = newTitle;
        currentDocIdRef.current = null;
        setCurrentDocId(null);
        setWordCount(0);
        setReadingTime(0);
        setIssues([]);
        setSaveStatus('Saved');
        setSaveStatusColor('text-gray-500');
      }
      toast.success('Document deleted.');
    } else {
      toast.error('Failed to delete document.');
    }
    setDeletingDocId(null);
    setDeleteDocId(null);
  };

  const exportAsTxt = () => {
    const text = editorRef.current?.innerText || "";
    if (!text.trim()) {
      toast.error("Nothing to export");
      return;
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentTitleRef.current}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsPdf = async () => {
    const text = editorRef.current?.innerText || "";
    if (!text.trim()) {
      toast.error("Nothing to export");
      return;
    }
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const title = documentTitleRef.current;
    const margin = 15;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFontSize(16);
    doc.text(title, margin, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, maxWidth);
    let y = 35;
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 7;
    }
    doc.save(`${title}.pdf`);
    setShowExportMenu(false);
  };

  const exportAsDocx = async () => {
    const text = editorRef.current?.innerText || "";
    if (!text.trim()) {
      toast.error("Nothing to export");
      return;
    }
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const title = documentTitleRef.current;
    const paragraphs = text
      .split("\n")
      .map((line) => new Paragraph({ children: [new TextRun(line)] }));
    const doc = new Document({
      sections: [{ properties: {}, children: paragraphs }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const startProTrial = async () => {
    setIsUpgrading(true);
    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle: "pro_monthly" }),
      });
      const data = await res.json();
      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error(
          data.message || "Could not initialize payment. Please try again.",
        );
        setIsUpgrading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsUpgrading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("userPlan");
    localStorage.removeItem("checksUsed");
    window.location.href = "/";
  };

  const getIssueColors = (type: string) => {
    switch (type) {
      case "spelling":
        return { border: "border-red-200 bg-red-50", text: "text-red-600" };
      case "grammar":
        return {
          border: "border-yellow-200 bg-yellow-50",
          text: "text-yellow-600",
        };
      case "style":
        return { border: "border-blue-200 bg-blue-50", text: "text-blue-600" };
      case "nigerian":
        return { border: "border-green-200 bg-green-50", text: "text-green-700" };
      case "pidgin":
        return { border: "border-purple-200 bg-purple-50", text: "text-purple-600" };
      default:
        return {
          border: "border-purple-200 bg-purple-50",
          text: "text-purple-600",
        };
    }
  };

  const errorIssues = issues.filter((i) => !i.isCorrect);
  const usagePercent = Math.min((checksUsed / checksLimit) * 100, 100);
  const usageBarColor =
    usagePercent >= 80
      ? "bg-red-500"
      : usagePercent >= 50
        ? "bg-yellow-500"
        : "bg-primary";

  return (
    <div className="bg-gray-50 text-gray-900 font-sans h-screen overflow-hidden flex flex-col">
      {/* TOP NAVBAR */}
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shrink-0 z-50">
        <div className="flex items-center justify-between w-full">
          {/* Left: Logo + Doc Title */}
          <div className="flex items-center gap-6">
            <Link href="/" className="">
              <Image
                src={"/logo/logo_black.svg"}
                alt="Logo"
                width={50}
                height={50}
                className="w-40"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => {
                  setDocumentTitle(e.target.value);
                  documentTitleRef.current = e.target.value;
                  if (autoSaveTimeout.current)
                    clearTimeout(autoSaveTimeout.current);
                  const saveDelay = userPlanRef.current === "pro" ? 2000 : 4000;
                  autoSaveTimeout.current = setTimeout(performAutoSave, saveDelay);
                }}
                className="text-lg font-semibold border-none focus:outline-none focus:bg-gray-50 px-2 py-1 rounded w-48"
              />
              <span className={`text-xs ${saveStatusColor}`}>{saveStatus}</span>
            </div>
          </div>

          {/* Right: Mode Selector + User Menu */}
          <div className="flex items-center gap-4">
            {/* Language Mode Selector */}
            <select
              value={languageMode}
              onChange={(e) => handleLanguageModeChange(e.target.value)}
              className="hidden md:block px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold text-sm focus:border-primary focus:outline-none cursor-pointer"
            >
              <option value="nigerian-english">🇳🇬 Nigerian English</option>
              <option value="standard-english">🇬🇧 Standard English</option>
              <option value="pidgin">🗣 Pidgin</option>
            </select>

            {/* User Menu Dropdown */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 cursor-pointer rounded-lg transition"
                data-user-menu
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  U
                </div>
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b">
                    <div className="font-semibold truncate">
                      {userEmail || "Guest"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {userPlan === "pro" ? "Pro Plan" : "Free Plan"}
                    </div>
                  </div>

                  <button className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 transition">
                    <div className="font-medium">My Documents</div>
                    <div className="text-xs text-gray-500">
                      View saved documents
                    </div>
                  </button>

                  <Link
                    href="/settings"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                  >
                    <div className="font-medium">Settings</div>
                    <div className="text-xs text-gray-500">
                      Preferences &amp; account
                    </div>
                  </Link>

                  {!isPro && (
                    <>
                      <div className="border-t my-2" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowUpgradeModal(true);
                        }}
                        className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 text-primary font-semibold transition"
                      >
                        Upgrade to Pro →
                      </button>
                    </>
                  )}

                  <div className="border-t my-2" />

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-50 text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN EDITOR CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Documents */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-gray-200 overflow-hidden shrink-0 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-10"}`}
        >
            <div className="p-3 border-b flex items-center justify-between shrink-0">
              {sidebarOpen && (
                <h2 className="font-bold text-lg truncate">My Documents</h2>
              )}
              <div
                className={`flex items-center gap-1 ${sidebarOpen ? "" : "w-full justify-center"}`}
              >
                {sidebarOpen && (
                  <button
                    onClick={() => {
                      if (!isPro && documents.length >= freeDocLimit) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      if (editorRef.current) editorRef.current.innerHTML = "";
                      const newTitle = "Untitled Document";
                      setDocumentTitle(newTitle);
                      documentTitleRef.current = newTitle;
                      currentDocIdRef.current = null;
                      setCurrentDocId(null);
                      setIssues([]);
                      setWordCount(0);
                      setReadingTime(0);
                      setUnsavedChanges(false);
                      setSaveStatus("Saved");
                      setSaveStatusColor("text-gray-500");
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                    title="New document"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                  title={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
                >
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform duration-300"
                    style={{
                      transform: sidebarOpen
                        ? "rotate(0deg)"
                        : "rotate(180deg)",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {sidebarOpen && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {docsLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                    <div
                      className="spinner"
                      style={{ width: 28, height: 28 }}
                    />
                    <p className="text-sm">Loading documents…</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm">No documents yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={async () => {
                          setDocContentLoading(true);
                          setLoadingDocId(doc.id);
                          const res = await fetch(`/api/documents/${doc.id}`);
                          if (res.ok) {
                            const { content } = await res.json();
                            if (editorRef.current)
                              editorRef.current.innerHTML = content || "";
                            const words = (editorRef.current?.textContent || "")
                              .trim()
                              .split(/\s+/)
                              .filter((w) => w.length > 0);
                            setWordCount(words.length);
                            setReadingTime(Math.ceil(words.length / 250));
                          }
                          setDocumentTitle(doc.title);
                          documentTitleRef.current = doc.title;
                          currentDocIdRef.current = doc.id;
                          setCurrentDocId(doc.id);
                          setIssues([]);
                          setUnsavedChanges(false);
                          setSaveStatus("Saved");
                          setSaveStatusColor("text-gray-500");
                          setDocContentLoading(false);
                          setLoadingDocId(null);
                        }}
                        className={`group p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition ${currentDocId === doc.id ? "border-primary bg-green-50" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-sm truncate flex-1">
                            {doc.title}
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {loadingDocId === doc.id && (
                              <div className="spinner" style={{ width: 14, height: 14 }} />
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteDocId(doc.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded cursor-pointer transition text-red-500"
                              title="Delete document"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.word_count} words •{" "}
                          {formatUpdated(doc.updated_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {sidebarOpen && !docsLoading && (
              <div className="p-3 border-t shrink-0">
                {(() => {
                  const docLimit = isPro ? 100 : freeDocLimit;
                  const atLimit = documents.length >= docLimit;
                  const nearLimit = isPro ? documents.length >= 90 : documents.length >= freeDocLimit - 1;
                  return (
                    <>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>{documents.length} / {docLimit} documents</span>
                        {atLimit ? (
                          <span className="text-red-500 font-semibold">Limit reached</span>
                        ) : nearLimit ? (
                          <span className="text-yellow-600 font-semibold">Almost full</span>
                        ) : null}
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${atLimit ? "bg-red-500" : nearLimit ? "bg-yellow-500" : "bg-primary"}`}
                          style={{
                            width: `${Math.min((documents.length / docLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      {!isPro && atLimit && (
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="mt-2 text-xs text-primary font-semibold cursor-pointer hover:underline"
                        >
                          Upgrade for unlimited →
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {!sidebarOpen && <div className="flex-1" />}

            {!sidebarOpen && !docsLoading && (() => {
              const docLimit = isPro ? 100 : freeDocLimit;
              const atLimit = documents.length >= docLimit;
              const nearLimit = isPro ? documents.length >= 90 : documents.length >= freeDocLimit - 1;
              return (
                <div
                  className="flex items-center justify-center py-3 border-t shrink-0"
                  title={`${documents.length} of ${docLimit} documents`}
                >
                  <svg width="34" height="34" viewBox="0 0 34 34">
                    <circle cx="17" cy="17" r="13" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle
                      cx="17" cy="17" r="13" fill="none"
                      stroke={atLimit ? "#ef4444" : nearLimit ? "#eab308" : "#008751"}
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 13}`}
                      strokeDashoffset={`${2 * Math.PI * 13 * (1 - documents.length / docLimit)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 17 17)"
                    />
                    <text x="17" y="17" textAnchor="middle" dominantBaseline="central" fontSize={atLimit ? "7" : "9"} fontWeight="600" fill="#374151">
                      {documents.length}
                    </text>
                  </svg>
                </div>
              );
            })()}
          </aside>

        {/* CENTER: EDITOR */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            {/* Left: Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={!isPro && wordCount > freeWordLimit ? "text-red-500 font-semibold" : "text-gray-600"}>
                  {wordCount} {!isPro ? `/ ${freeWordLimit.toLocaleString()}` : ""} {wordCount !== 1 ? "words" : "word"}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">{readingTime} min read</span>
              </div>

              {/* Issues count — tappable on mobile to open sheet */}
              <button
                className="flex items-center gap-2 md:cursor-default"
                onClick={() => { if (window.innerWidth < 768) setShowIssuesSheet(true); }}
              >
                {errorIssues.length === 0 ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600">No issues</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-600 font-semibold">
                      {errorIssues.length} {errorIssues.length !== 1 ? "issues" : "issue"}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile language mode */}
              <select
                value={languageMode}
                onChange={(e) => handleLanguageModeChange(e.target.value)}
                className="md:hidden px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="nigerian-english">🇳🇬 NG</option>
                <option value="standard-english">🇬🇧 EN</option>
                <option value="pidgin">🗣 Pidgin</option>
              </select>

              {/* Export (Pro only) */}
              <div className="relative hidden md:block" data-export-menu>
                <button
                  onClick={
                    isPro
                      ? () => setShowExportMenu(!showExportMenu)
                      : () => setShowUpgradeModal(true)
                  }
                  className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition text-sm font-semibold ${!isPro ? "opacity-50 cursor-not-allowed" : ""}`}
                  data-export-menu
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showExportMenu && isPro && (
                  <div
                    className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                    data-export-menu
                  >
                    <button
                      onClick={exportAsTxt}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition"
                      data-export-menu
                    >
                      <div className="font-semibold">TXT</div>
                      <div className="text-xs text-gray-500">
                        Plain text file
                      </div>
                    </button>
                    <button
                      onClick={exportAsPdf}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition"
                      data-export-menu
                    >
                      <div className="font-semibold">PDF</div>
                      <div className="text-xs text-gray-500">
                        Portable document
                      </div>
                    </button>
                    <button
                      onClick={exportAsDocx}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition"
                      data-export-menu
                    >
                      <div className="font-semibold">DOCX</div>
                      <div className="text-xs text-gray-500">Word document</div>
                    </button>
                  </div>
                )}
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primaryHover transition text-sm font-semibold"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden flex">
            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {docContentLoading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                  <div className="spinner" style={{ width: 36, height: 36 }} />
                </div>
              )}
              <div className="max-w-4xl mx-auto px-6 py-8">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  onInput={handleEditorInput}
                  className="focus:outline-none min-h-125 font-serif text-base leading-relaxed"
                  style={{
                    fontFamily: "Georgia, serif",
                    lineHeight: "1.8",
                    fontSize: "16px",
                  }}
                  data-placeholder="Start writing..."
                />
              </div>
            </div>

            {/* RIGHT PANEL: Issues */}
            <aside className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-hidden shrink-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg">Issues</h2>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  {issues.length === 0 ? (
                    <div className="text-center py-12">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-gray-600 font-semibold">
                        Looking good!
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        No grammar issues found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {issues.map((issue, index) => {
                        const colors = getIssueColors(issue.type);
                        return (
                          <div
                            key={index}
                            onClick={() => scrollToIssue(issue)}
                            className={`border-2 ${colors.border} rounded-lg p-4 cursor-pointer hover:shadow-md transition`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div
                                className={`font-semibold ${colors.text} text-sm uppercase`}
                              >
                                {issue.type}
                              </div>
                              {issue.isCorrect && (
                                <svg
                                  className="w-5 h-5 text-green-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <p className="text-gray-700 font-mono text-sm mb-2">
                              &quot;{issue.text}&quot;
                            </p>
                            <p className="text-sm text-gray-600">
                              {issue.message}
                            </p>
                            {!issue.isCorrect && issue.suggestion && (
                              <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">
                                    Suggestion:
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {issue.suggestion}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); applySuggestion(issue); }}
                                  className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primaryHover transition cursor-pointer"
                                >
                                  Fix
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Bottom Bar: Usage (Free plan, desktop only) */}
          {!isPro && (
            <div className="hidden md:flex bg-white border-t border-gray-200 px-6 py-3 items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-semibold">{checksUsed}</span>
                  <span className="text-gray-600">/ 100 checks this month</span>
                </div>

                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${usageBarColor} transition-all`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-sm text-primary font-semibold cursor-pointer hover:underline"
              >
                Upgrade for unlimited →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM ACTION BAR */}
      <div className="md:hidden shrink-0 bg-white border-t border-gray-200 z-40">
        {/* Free usage bar */}
        {!isPro && (
          <div className="px-4 pt-2.5 pb-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span><span className="font-semibold text-gray-800">{checksUsed}</span> / 100 checks</span>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${usageBarColor} transition-all`} style={{ width: `${usagePercent}%` }} />
              </div>
            </div>
            <button onClick={() => setShowUpgradeModal(true)} className="text-xs text-primary font-semibold cursor-pointer hover:underline shrink-0">
              Upgrade →
            </button>
          </div>
        )}

        <div className="px-4 py-3 flex items-center gap-3">
          {/* Issues button */}
          <button
            onClick={() => setShowIssuesSheet(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition cursor-pointer relative"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Issues
            {errorIssues.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {errorIssues.length > 9 ? '9+' : errorIssues.length}
              </span>
            )}
          </button>

          {/* Doc title + save status */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-gray-800">{documentTitle}</p>
            <p className={`text-xs ${saveStatusColor}`}>{saveStatus}</p>
          </div>

          {/* Export */}
          <div className="relative" data-export-menu>
            <button
              onClick={isPro ? () => setShowExportMenu(!showExportMenu) : () => setShowUpgradeModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition cursor-pointer ${!isPro ? 'opacity-50' : ''}`}
              data-export-menu
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-export-menu>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" data-export-menu />
              </svg>
              Export
            </button>
            {showExportMenu && isPro && (
              <div className="absolute bottom-full right-0 mb-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50" data-export-menu>
                <button onClick={exportAsTxt} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition" data-export-menu>
                  <div className="font-semibold">TXT</div>
                  <div className="text-xs text-gray-500">Plain text file</div>
                </button>
                <button onClick={exportAsPdf} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition" data-export-menu>
                  <div className="font-semibold">PDF</div>
                  <div className="text-xs text-gray-500">Portable document</div>
                </button>
                <button onClick={exportAsDocx} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition" data-export-menu>
                  <div className="font-semibold">DOCX</div>
                  <div className="text-xs text-gray-500">Word document</div>
                </button>
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primaryHover transition text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>
        </div>
      </div>

      {/* MOBILE ISSUES BOTTOM SHEET */}
      {showIssuesSheet && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowIssuesSheet(false)} />
          {/* Sheet */}
          <div className="relative bg-white rounded-t-2xl max-h-[75vh] flex flex-col shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b shrink-0">
              <h3 className="font-bold text-lg">
                Issues {errorIssues.length > 0 && <span className="text-red-500">({errorIssues.length})</span>}
              </h3>
              <button onClick={() => setShowIssuesSheet(false)} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Issues list */}
            <div className="flex-1 overflow-y-auto p-4">
              {issues.length === 0 ? (
                <div className="text-center py-10">
                  <svg className="w-14 h-14 mx-auto mb-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 font-semibold">Looking good!</p>
                  <p className="text-sm text-gray-500 mt-1">No grammar issues found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {issues.map((issue, index) => {
                    const colors = getIssueColors(issue.type);
                    return (
                      <div key={index} onClick={() => { setShowIssuesSheet(false); setTimeout(() => scrollToIssue(issue), 300); }} className={`border-2 ${colors.border} rounded-lg p-4 cursor-pointer`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className={`font-semibold ${colors.text} text-sm uppercase`}>{issue.type}</div>
                          {issue.isCorrect && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-gray-700 font-mono text-sm mb-2">&quot;{issue.text}&quot;</p>
                        <p className="text-sm text-gray-600">{issue.message}</p>
                        {!issue.isCorrect && issue.suggestion && (
                          <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Suggestion:</div>
                              <div className="font-semibold text-gray-900">{issue.suggestion}</div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); applySuggestion(issue); }}
                              className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primaryHover transition cursor-pointer"
                            >
                              Fix
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Upgrade to Pro</h2>
                  <p className="text-gray-600">
                    Unlock unlimited checks and premium features
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 cursor-pointer hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-linear-to-br from-green-50 to-white border-2 border-primary rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Pro Plan</div>
                    <div className="text-3xl font-bold text-primary">
                      ₦1,500
                      <span className="text-lg text-gray-600">/month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  {
                    title: "Unlimited Grammar Checks",
                    desc: "No monthly limits",
                  },
                  {
                    title: "Document Storage (100 docs)",
                    desc: "Auto-save, search, access anywhere",
                  },
                  {
                    title: "Advanced Pidgin Support",
                    desc: "Style suggestions and corrections",
                  },
                  { title: "Export Documents", desc: "PDF, DOCX, TXT formats" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-green-600 shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={startProTrial}
                disabled={isUpgrading}
                className="w-full bg-primary text-white py-4 cursor-pointer rounded-lg text-lg font-bold hover:bg-primaryHover transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpgrading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {isUpgrading ? "Redirecting to payment…" : "Upgrade to Pro — ₦1,500/month"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING MODAL (80 checks) */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Running Low on Checks</h3>
              <p className="text-gray-600">
                You&apos;ve used <strong>{warningChecks}</strong> of 100 free
                checks this month.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-900 font-semibold mb-2">
                Upgrade to Pro and get:
              </p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Unlimited checks</li>
                <li>• Document storage</li>
                <li>• Advanced features</li>
                <li>• Only ₦1,500/month</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarningModal(false)}
                className="flex-1 border border-gray-300 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition font-semibold"
              >
                Continue Free
              </button>
              <button
                onClick={() => {
                  setShowWarningModal(false);
                  setShowUpgradeModal(true);
                }}
                className="flex-1 bg-primary text-white px-4 py-3 rounded-lg cursor-pointer hover:bg-primaryHover transition font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HARD LIMIT MODAL (110 checks) */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Monthly Limit Reached</h3>
              <p className="text-gray-600">
                You&apos;ve used all 110 checks this month (100 + 10 bonus).
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">
                Your limit resets in:
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {resetDays} days
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  setShowUpgradeModal(true);
                }}
                className="w-full bg-primary text-white py-4 rounded-lg text- cursor-pointer font-bold hover:bg-primaryHover transition"
              >
                Upgrade to Pro - Unlimited Checks
              </button>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full border border-gray-300 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition font-semibold"
              >
                Wait Until Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word Limit Modal (Free users) */}
      {showWordLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Word Limit Reached</h3>
              <p className="text-gray-600">
                Free documents are limited to {freeWordLimit.toLocaleString()} words.
                You&apos;re currently at <span className="font-semibold">{wordCount.toLocaleString()}</span> words.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Upgrade to Pro for unlimited word counts, up to 100 documents, and more.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowWordLimitModal(false);
                  setShowUpgradeModal(true);
                }}
                className="w-full bg-primary text-white py-4 rounded-lg cursor-pointer font-bold hover:bg-primaryHover transition"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowWordLimitModal(false)}
                className="w-full border border-gray-300 py-3 rounded-lg cursor-pointer hover:bg-gray-50 transition font-semibold"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Confirmation Modal */}
      {deleteDocId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Delete Document?</h3>
            <p className="text-gray-600 text-sm mb-6">
              <span className="font-semibold text-gray-800">&ldquo;{documents.find(d => d.id === deleteDocId)?.title || 'Untitled Document'}&rdquo;</span> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteDocId(null)}
                disabled={deletingDocId === deleteDocId}
                className="flex-1 border border-gray-300 px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoc}
                disabled={deletingDocId === deleteDocId}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm cursor-pointer hover:bg-red-700 transition disabled:opacity-50"
              >
                {deletingDocId === deleteDocId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorPageInner />
    </Suspense>
  );
}
