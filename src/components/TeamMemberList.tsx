import { useState, useRef } from "react";
import { GripVertical, X, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TeamMember } from "@/types/project";

interface TeamMemberListProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  readOnly?: boolean;
}

const TeamMemberList = ({ members, onChange, readOnly = false }: TeamMemberListProps) => {
  const [newMember, setNewMember] = useState("");
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);

  const addMember = () => {
    const name = newMember.trim();
    if (!name) return;
    onChange([...members, { id: crypto.randomUUID(), name }]);
    setNewMember("");
  };

  const removeMember = (id: string) => {
    onChange(members.filter((m) => m.id !== id));
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOver.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return;
    const reordered = [...members];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOver.current, 0, removed);
    onChange(reordered);
    dragItem.current = null;
    dragOver.current = null;
  };

  return (
    <div className="space-y-2">
      {members.map((member, index) => (
        <div
          key={member.id}
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
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm">{member.name}</span>
          {!readOnly && (
            <button onClick={() => removeMember(member.id)} className="text-muted-foreground hover:text-destructive">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex gap-2">
          <Input
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
            placeholder="Add users…"
            className="text-sm"
          />
          <Button type="button" size="sm" variant="outline" onClick={addMember} disabled={!newMember.trim()}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamMemberList;
