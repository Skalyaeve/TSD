import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'

// --Manage-le-drag-drop----------------------->>
interface DragDropProps extends React.HTMLAttributes<HTMLDivElement> {
	itemId: number
	content: any
	moveItem: (draggedId: number, droppedId: number) => void
}
interface Item {
	id: number
}
export function DragDrop({ itemId, content, moveItem, ...divParams }: DragDropProps) {
	// Valeurs
	const [, drag] = useDrag<Item>({
		type: 'item',
		item: { id: itemId }
	})
	const [, drop] = useDrop<Item>({
		accept: 'item',
		drop: (item) => moveItem(item.id, itemId)
	})

	// Modifieurs

	// Retour
	return (
		<div ref={(node) => drag(drop(node))} {...divParams}>
			{content}
		</div >
	)
}

// --Genere-un-bouton-------------------------->>
interface newBoxProps extends React.HTMLAttributes<HTMLElement> {
	tag: string
	content?: any
	to?: string
}
export function NewBox({ tag, content, to, ...divParams }: newBoxProps) {
	// Valeurs
	const isDiv = () => <div {...divParams}>{content}</div>
	const isLink = () => to ? <Link to={to} {...divParams}>{content}</Link> : <></>

	// Modifieurs
	const render = function () {
		const linksMap: { [key: string]: () => JSX.Element | null } = {
			'div': isDiv,
			'Link': isLink
		}
		return linksMap[tag] ? linksMap[tag]() : linksMap['div']()
	}

	console.log(`New Box:\n${content}`)
	// Retour
	return <>{render()}</>
}