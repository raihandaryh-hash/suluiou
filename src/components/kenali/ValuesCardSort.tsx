import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";

const ALL_VALUES = [
  "Ilmu",
  "Keluarga",
  "Dakwah",
  "Mandiri finansial",
  "Manfaat untuk umat",
  "Ketenangan",
  "Kreativitas",
  "Keberanian",
  "Kejujuran",
  "Keadilan",
  "Kepemimpinan",
  "Keberlanjutan",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface RowProps {
  id: string;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}

function Row({ id, index, total, onMove }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-3 shadow-sm"
    >
      <button
        type="button"
        aria-label="Geser"
        className="cursor-grab touch-none text-muted-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </button>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {index + 1}
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{id}</span>
      <button
        type="button"
        aria-label="Naik"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
      >
        <ArrowUp size={16} />
      </button>
      <button
        type="button"
        aria-label="Turun"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
      >
        <ArrowDown size={16} />
      </button>
    </li>
  );
}

interface Props {
  initial?: string[] | null;
  onChange: (sorted: string[]) => void;
}

export default function ValuesCardSort({ initial, onChange }: Props) {
  const [items, setItems] = useState<string[]>(() => {
    if (initial && initial.length === ALL_VALUES.length) return initial;
    return shuffle(ALL_VALUES);
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => onChange(items), 1000);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [items, onChange]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    if (oldIndex < 0 || newIndex < 0) return;
    setItems(arrayMove(items, oldIndex, newIndex));
  }

  function moveByIndex(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    setItems(arrayMove(items, from, to));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ol className="space-y-2">
          {items.map((id, i) => (
            <Row key={id} id={id} index={i} total={items.length} onMove={moveByIndex} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

export { ALL_VALUES };
