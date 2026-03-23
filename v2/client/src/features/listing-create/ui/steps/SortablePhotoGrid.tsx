import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, AlertCircle } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import styles from './SortablePhotoGrid.module.css';

interface Photo {
  id: string;
  url: string;
  thumbnail?: string;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

interface SortablePhotoCardProps {
  photo: Photo;
  index: number;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  getImageUrl: (url: string) => string;
}

const SortablePhotoCard = ({ photo, index, onRemove, onRetry, getImageUrl }: SortablePhotoCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id, disabled: photo.status !== 'success' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isMain = index === 0 && photo.status === 'success';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.photoCard} ${isDragging ? styles.dragging : ''}`}
    >
      <img
        src={getImageUrl(photo.thumbnail || photo.url)}
        alt=""
        className={styles.image}
      />

      {/* Uploading State Spinner */}
      {photo.status === 'uploading' && (
        <div className={styles.overlay}>
           <div className={styles.spinner} />
        </div>
      )}

      {/* Badge */}
      {isMain && (
        <div className={styles.badge}>
          Обложка
        </div>
      )}
      
      {/* Drag Handle */}
      {photo.status === 'success' && (
        <div
          {...attributes}
          {...listeners}
          className={styles.dragHandle}
        >
          <GripVertical size={18} />
        </div>
      )}

      {/* Error State Overlay */}
      {photo.status === 'error' && (
        <div className={styles.overlay} style={{ backgroundColor: 'rgba(254, 242, 242, 0.95)', backdropFilter: 'none' }}>
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626', textAlign: 'center', padding: '0 8px' }}>
            {photo.error || 'Ошибка'}
          </p>
          {onRetry && (
            <button
              onClick={() => onRetry(photo.id)}
              style={{ marginTop: '8px', padding: '4px 12px', borderRadius: '8px', backgroundColor: '#EF4444', color: 'white', fontSize: '11px', fontWeight: 700 }}
            >
              ПОВТОРИТЬ
            </button>
          )}
        </div>
      )}

      {/* Delete Button */}
      {photo.status !== 'uploading' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(photo.id);
          }}
          className={styles.deleteBtn}
        >
          <X size={16} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

interface SortablePhotoGridProps {
  photos: Photo[];
  onReorder: (photos: Photo[]) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  getImageUrl: (url: string) => string;
  children?: React.ReactNode;
}

export const SortablePhotoGrid = ({ photos, onReorder, onRemove, onRetry, getImageUrl, children }: SortablePhotoGridProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id);
      const newIndex = photos.findIndex((p) => p.id === over.id);
      onReorder(arrayMove(photos, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <SortablePhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              onRemove={onRemove}
              onRetry={onRetry}
              getImageUrl={getImageUrl}
            />
          ))}
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
};
