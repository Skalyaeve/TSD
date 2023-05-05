// --------OPACITY---------------------------------------------------------- //
interface fadeProps {
	initialOpacity?: number
	maxOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
}
export const fade = ({
	initialOpacity = 0,
	maxOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase
}: fadeProps) => ({
	initial: { opacity: initialOpacity },
	animate: {
		opacity: maxOpacity,
		transition: {
			opacity: {
				duration: inDuration,
				ease: animateEase
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		transition: {
			opacity: {
				duration: outDuration,
				ease: exitEase
			}
		}
	}
})

// --------HEIGHT---------------------------------------------------------- //
export const heightGrow = (
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleY: 0, opacity: initialOpacity },
	animate: {
		scaleY: 1,
		opacity: maxOpacity,
		transition: {
			scaleY: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleY: 0,
		opacity: initialOpacity,
		transition: {
			scaleY: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const heightGrowByPercent = (
	height: number = 100,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: `${height}%`,
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: 0,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const heightGrowByPx = (
	height: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: `${height}px`,
		opacity: maxOpacity,
		transition: {
			height: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: 0,
		opacity: initialOpacity,
		transition: {
			height: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------HEIGHT+BOUNCE--------------------------------------------------- //
export const bouncyHeightGrow = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleY: 0, opacity: initialOpacity },
	animate: {
		scaleY: [0, maxScale, 1],
		opacity: maxOpacity,
		transition: {
			scaleY: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleY: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scaleY: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyHeightGrowByPercent = (
	height: number = 100,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: ['0%', `${height + height * extraScale}%`, `${height}%`],
		opacity: maxOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase },
		}
	},
	exit: {
		height: [`${height}%`, `${height + height * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase },
		}
	}
})

export const bouncyHeightGrowByPx = (
	height: number,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { height: 0, opacity: initialOpacity },
	animate: {
		height: ['0px', `${height + height * extraScale}px`, `${height}px`],
		opacity: maxOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		height: [`${height}px`, `${height + height * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------WIDTH----------------------------------------------------------- //
export const widthGrow = (
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleX: 0, opacity: initialOpacity },
	animate: {
		scaleX: 1,
		opacity: maxOpacity,
		transition: {
			scaleX: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleX: 0,
		opacity: initialOpacity,
		transition: {
			scaleX: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const widthGrowByPercent = (
	width: number = 100,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: `${width}%`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const widthGrowByPx = (
	width: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: `${width}px`,
		opacity: maxOpacity,
		transition: {
			width: { duration: inDuration, ease: animateEase },
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: 0,
		opacity: initialOpacity,
		transition: {
			width: { duration: outDuration, ease: exitEase },
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------WIDTH+BOUNCE---------------------------------------------------- //
export const bouncyWidthGrow = (
	maxScale: number = 1.1,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { scaleX: 0, opacity: initialOpacity },
	animate: {
		scaleX: [0, maxScale, 1],
		opacity: maxOpacity,
		transition: {
			scaleX: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		scaleX: [1, maxScale, 0],
		opacity: initialOpacity,
		transition: {
			scaleX: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyWidthGrowByPercent = (
	width: number = 100,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1,
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: ['0%', `${width + width * extraScale}%`, `${width}%`],
		opacity: maxOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: [`${width}%`, `${width + width * extraScale}%`, '0%'],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

export const bouncyWidthGrowByPx = (
	width: number,
	extraScale: number = 0.2,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { width: 0, opacity: initialOpacity },
	animate: {
		width: ['0px', `${width + width * extraScale}px`, `${width}px`],
		opacity: maxOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			},
			opacity: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		width: [`${width}px`, `${width + width * extraScale}px`, '0px'],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			},
			opacity: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------Y-POS----------------------------------------------------------- //
export const comeFromCol = (
	comeFrom: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, y: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		y: 0,
		transition: {
			opacity: { duration: inDuration, ease: animateEase },
			y: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		opacity: initialOpacity,
		y: `${comeFrom}px`,
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			y: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------Y-POS+BOUNCE---------------------------------------------------- //
export const bouncyComeFromCol = (
	comeFrom: number,
	bounce: number = 10,
	maxAt: number = 0.75,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, y: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		y: [`${comeFrom}px`, `-${bounce}px`, '0px'],
		transition: {
			opacity: { duration: inDuration, ease: animateEase },
			y: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		y: ['0px', `-${bounce}px`, `${comeFrom}px`],
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			y: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			}
		}
	}
})

// --------X-POS----------------------------------------------------------- //
export const comeFromRow = (
	comeFrom: number,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, x: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		x: 0,
		transition: {
			opacity: { duration: inDuration, ease: animateEase },
			x: { duration: inDuration, ease: animateEase }
		}
	},
	exit: {
		opacity: initialOpacity,
		x: `${comeFrom}px`,
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			x: { duration: outDuration, ease: exitEase }
		}
	}
})

// --------X-POS+BOUNCE---------------------------------------------------- //
export const bouncyComeFromRow = (
	comeFrom: number,
	maxAt: number = 0.75,
	bounce: number = 10,
	animateEase: string = 'easeInOut',
	exitEase: string = animateEase,
	inDuration: number = 0.5,
	outDuration: number = inDuration,
	initialOpacity: number = 0,
	maxOpacity: number = 1
) => ({
	initial: { opacity: initialOpacity, x: `${comeFrom}px` },
	animate: {
		opacity: maxOpacity,
		x: [`${comeFrom}px`, `-${bounce}px`, '0px'],
		transition: {
			opacity: { duration: inDuration, ease: animateEase },
			x: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		x: ['0px', `-${bounce}px`, `${comeFrom}px`],
		transition: {
			opacity: { duration: outDuration, ease: exitEase },
			x: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase
			}
		}
	}
})