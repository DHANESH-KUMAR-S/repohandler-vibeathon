import { useState, useRef } from "react";
import { GripVertical, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Feature } from "@/types/project";

interface FeatureListProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
  readOnly?: boolean;
}

const FeatureList = ({ features, onChange, readOnly = false }: FeatureListProps) => {
  const [newFeature, setNewFeature] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const addFeature = () => {
    const text = newFeature.trim();
    if (!text) return;
    onChange([...features, { id: crypto.randomUUID(), text }]);
    setNewFeature("");
  };

  const removeFeature = (id: string) => {
    onChange(features.filter((f) => f.id !== id));
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOver.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const reordered = [...features];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, removed);
    onChange(reordered);
    dragItem.current = null;
    dragOver.current = null;
  };

  return (
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div
          key={feature.id}
          draggable={!readOnly}
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 transition-colors hover:bg-secondary/50"
        >
          {!readOnly && (
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
          )}
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-semibold text-primary">
            {index + 1}
          </span>
          <span className="flex-1 text-sm">{feature.text}</span>
          {!readOnly && (
            <button onClick={() => removeFeature(feature.id)} className="text-muted-foreground hover:text-destructive">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            placeholder="Add a feature…"
            className="text-sm"
          />
          <Button type="button" size="sm" variant="outline" onClick={addFeature} disabled={!newFeature.trim()}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default FeatureList;
