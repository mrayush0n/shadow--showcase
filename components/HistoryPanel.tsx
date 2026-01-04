
import React from 'react';
import { GlassCard } from './GlassCard';
import { Spinner } from './Spinner';
import { Icon } from './Icon';
import type { Activity } from '../types';

interface HistoryPanelProps {
  title: string;
  isLoading: boolean;
  items: Activity[];
  onItemClick: (item: Activity) => void;
  renderItem: (item: Activity) => React.ReactNode;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  title,
  isLoading,
  items,
  onItemClick,
  renderItem,
}) => {
  return (
    <GlassCard className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Icon name="history" className="text-aurora-500" />
          {title}
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-aurora-100 dark:bg-aurora-900/30 text-aurora-600 dark:text-aurora-400 font-medium">
          {items.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Icon name="inbox" className="text-4xl mb-2 opacity-50" />
            <p className="text-sm">No history yet</p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-aurora-50 dark:hover:bg-aurora-900/20 border border-transparent hover:border-aurora-200 dark:hover:border-aurora-800/50 text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  {renderItem(item)}
                </div>
                <Icon
                  name="chevron_right"
                  className="text-slate-400 group-hover:text-aurora-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </button>
          ))
        )}
      </div>
    </GlassCard>
  );
};
