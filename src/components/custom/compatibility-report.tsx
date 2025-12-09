'use client';

import {
  CircleXIcon,
  ArrowLeftIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  getEmbedUrl,
  MAJOR_CLIENTS,
  type MajorClient,
  type CanIEmailFeature,
  getFeatureSupportSummary,
} from '@/lib/caniemail';
import { cn } from '@/lib/utils';

type CompatibilityIssue = {
  feature: CanIEmailFeature;
  property: string;
  severity: 'error' | 'warning' | 'success';
  summary: {
    partial: MajorClient[];
    supported: MajorClient[];
    unknown: MajorClient[];
    unsupported: MajorClient[];
  };
};

type CompatibilityReportProps = {
  isLoading?: boolean;
  issues: CompatibilityIssue[];
};

function SeverityIcon({ severity }: { severity: CompatibilityIssue['severity'] }) {
  switch (severity) {
    case 'error':
      return <CircleXIcon className="size-4 text-red-500" />;

    case 'warning':
      return <CircleAlertIcon className="size-4 text-amber-500" />;

    case 'success':
      return <CircleCheckIcon className="size-4 text-green-500" />;
  }
}

function IssueCard({
  isExpanded,
  issue,
  onToggle,
}: {
  isExpanded: boolean;
  issue: CompatibilityIssue;
  onToggle: () => void;
}) {
  const { feature, severity, summary } = issue;
  const borderColor =
    severity === 'error'
      ? 'border-red-200 dark:border-red-900/50'
      : severity === 'warning'
        ? 'border-amber-200 dark:border-amber-900/50'
        : 'border-green-200 dark:border-green-900/50';

  return (
    <div className={cn('overflow-hidden rounded-lg border', borderColor)}>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <SeverityIcon severity={severity} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-200">{feature.title}</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {summary.unsupported.map((client) => {
                return (
                  <Badge key={client.label} variant="destructive">
                    {client.label}
                  </Badge>
                );
              })}
              {summary.partial.map((client) => {
                return (
                  <Badge variant="warning" key={client.label}>
                    {client.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        <ChevronDownIcon className={`size-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className={cn('border-t', borderColor)}>
          <div className="p-4">
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
              {feature.description || `Support details for ${feature.title}`}
            </p>
            <Link
              target="_blank"
              href={feature.url}
              rel="noopener noreferrer"
              className="mb-4 inline-flex items-center gap-1 text-sm"
            >
              View on caniemail.com
              <ExternalLinkIcon size={12} />
            </Link>
          </div>
          <CanIEmailEmbed featureSlug={feature.slug} />
        </div>
      )}
    </div>
  );
}

function CanIEmailEmbed({ featureSlug }: { featureSlug: string }) {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="relative">
      {isLoading && <Spinner className="absolute top-1/2 left-1/2 size-6 -translate-x-1/2 -translate-y-1/2" />}
      <iframe
        loading="lazy"
        src={getEmbedUrl(featureSlug)}
        className="h-[420px] w-full border-0"
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </div>
  );
}

export function CompatibilityReport({ isLoading, issues }: CompatibilityReportProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'errors' | 'warnings'>('all');

  React.useEffect(() => {
    setExpandedIndex(null);
  }, [issues, filter]);

  const { errors, filteredIssues, successes, warnings } = React.useMemo(() => {
    const errors = issues.filter((i) => {
      return i.severity === 'error';
    });
    const warnings = issues.filter((i) => {
      return i.severity === 'warning';
    });
    const successes = issues.filter((i) => {
      return i.severity === 'success';
    });

    let filtered = issues;

    if (filter === 'errors') {
      filtered = errors;
    } else if (filter === 'warnings') {
      filtered = [...errors, ...warnings];
    }

    filtered = [...filtered].sort((a, b) => {
      const order = { error: 0, success: 2, warning: 1 };

      return order[a.severity] - order[b.severity];
    });

    return { errors, filteredIssues: filtered, successes, warnings };
  }, [issues, filter]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b px-4 py-3">
          <h2>Compatibility Report</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 text-slate-500">
            <Spinner />
            <span>Analyzing compatibility...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2>Compatibility Report</h2>
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            <span>{errors.length} issues</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            <span>{warnings.length} warnings</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
            <span>{successes.length} OK</span>
          </span>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <ArrowLeftIcon size={18} />
            <p>Enter email HTML into the input on the left to analyze compatibility</p>
          </div>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            We&apos;ll check your CSS against {MAJOR_CLIENTS.length} major email clients
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-1 border-b px-4 py-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              onClick={() => {
                return setFilter('all');
              }}
            >
              All ({issues.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'errors' ? 'secondary' : 'ghost'}
              onClick={() => {
                return setFilter('errors');
              }}
            >
              Issues ({errors.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'warnings' ? 'secondary' : 'ghost'}
              onClick={() => {
                return setFilter('warnings');
              }}
            >
              Issues + Warnings ({errors.length + warnings.length})
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {filteredIssues.map((issue, index) => {
                return (
                  <IssueCard
                    issue={issue}
                    key={issue.feature.slug}
                    isExpanded={expandedIndex === index}
                    onToggle={() => {
                      return setExpandedIndex(expandedIndex === index ? null : index);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper to create issues from extracted features and caniemail data
export function createCompatibilityIssues(
  extractedProperties: Set<string>,
  cssPropertyMap: Map<string, CanIEmailFeature>
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  const processedSlugs = new Set<string>();

  for (const property of extractedProperties) {
    // Try to find matching caniemail feature
    const feature = cssPropertyMap.get(property);

    if (!feature) {
      continue;
    }

    // Avoid duplicates (e.g., "background" and "background-color" mapping to same feature)
    if (processedSlugs.has(feature.slug)) {
      continue;
    }

    processedSlugs.add(feature.slug);

    const summary = getFeatureSupportSummary(feature);

    // Determine severity based on support
    let severity: CompatibilityIssue['severity'] = 'success';

    if (summary.unsupported.length > 0) {
      severity = 'error';
    } else if (summary.partial.length > 0) {
      severity = 'warning';
    }

    issues.push({
      feature,
      property,
      severity,
      summary,
    });
  }

  return issues;
}
