import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface DragDropProps {
	id: number;
	text: string;
	moveItem: (draggedId: number, droppedId: number) => void;
}

interface Item {
	id: number;
}

const DragDrop: React.FC<DragDropProps> = ({ id, text, moveItem }) => {
	const [, drag] = useDrag<Item, void, unknown>({
		type: 'CHAT_ROOM_ITEM',
		item: { id }
	});
	const [, drop] = useDrop<Item, void, unknown>({
		accept: 'CHAT_ROOM_ITEM',
		drop: (item) => moveItem(item.id, id)
	});

	return (
		<div ref={(node) => drag(drop(node))}>
			{text}
		</div>
	);
};
export default DragDrop;
