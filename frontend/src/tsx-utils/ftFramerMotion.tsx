// ------------------------------------------------------------------------ //
// --------Élément-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------OPACITY--------------------------------------------------------- //
interface fadeProps {
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const fade = ({
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: fadeProps) => ({
	initial: { opacity: initialOpacity },
	animate: {
		opacity: finalOpacity,
		transition: {
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		opacity: initialOpacity,
		transition: {
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// ------------------------------------------------------------------------ //
// --------FORM------------------------------------------------------------ //
// ------------------------------------------------------------------------ //

// --------WIDTH----------------------------------------------------------- //
interface widthChangeProps {
	initialWidth?: number
	finalWidth?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const widthChange = ({
	initialWidth = 0,
	finalWidth = 1,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: widthChangeProps) => ({
	initial: {
		scaleX: initialWidth,
		opacity: initialOpacity
	},
	animate: {
		scaleX: finalWidth,
		opacity: finalOpacity,
		transition: {
			scaleX: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		scaleX: initialWidth,
		opacity: initialOpacity,
		transition: {
			scaleX: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface widthChangeByPercentProps {
	initialWidth?: number
	finalWidth?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const widthChangeByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: widthChangeByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}%`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: `${initialWidth}%`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface widthChangeByPxProps {
	initialWidth?: number
	finalWidth: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const widthChangeByPx = ({
	initialWidth = 0,
	finalWidth,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: widthChangeByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}px`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: `${initialWidth}px`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------WIDTH+BOUNCE---------------------------------------------------- //
interface bouncyWidthChangeProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyWidthChange = ({
	initialWidth = 0,
	finalWidth = 1,
	maxWidth = finalWidth * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyWidthChangeProps) => ({
	initial: {
		scaleX: initialWidth,
		opacity: initialOpacity
	},
	animate: {
		scaleX: [initialWidth, maxWidth, finalWidth],
		opacity: finalOpacity,
		transition: {
			scaleX: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		scaleX: [finalWidth, maxWidth, initialWidth],
		opacity: initialOpacity,
		transition: {
			scaleX: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface bouncyWidthChangeByPercentProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyWidthChangeByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	maxWidth = finalWidth * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyWidthChangeByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}%`, `${maxWidth}%`, `${finalWidth}%`],
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: [`${finalWidth}%`, `${maxWidth}%`, `${initialWidth}%`],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface bouncyWidthChangeByPxProps {
	initialWidth?: number
	finalWidth: number
	maxWidth?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyWidthChangeByPx = ({
	initialWidth = 0,
	finalWidth,
	maxWidth = finalWidth * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyWidthChangeByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}px`, `${maxWidth}px`, `${finalWidth}px`],
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: [`${finalWidth}px`, `${maxWidth}px`, `${initialWidth}px`],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------HEIGHT---------------------------------------------------------- //
interface heightChangeProps {
	initialHeight?: number
	finalHeight?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const heightChange = ({
	initialHeight = 0,
	finalHeight = 1,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: heightChangeProps) => ({
	initial: {
		scaleY: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		scaleY: finalHeight,
		opacity: finalOpacity,
		transition: {
			scaleY: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		scaleY: initialHeight,
		opacity: initialOpacity,
		transition: {
			scaleY: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface heightChangeByPercentProps {
	initialHeight?: number
	finalHeight?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const heightChangeByPercent = ({
	initialHeight = 0,
	finalHeight = 100,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: heightChangeByPercentProps) => ({
	initial: {
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		height: `${finalHeight}%`,
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		height: `${initialHeight}%`,
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface heightChangeByPxProps {
	initialHeight?: number
	finalHeight: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const heightChangeByPx = ({
	initialHeight = 0,
	finalHeight,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: heightChangeByPxProps) => ({
	initial: {
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		height: `${finalHeight}px`,
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		height: `${initialHeight}px`,
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------HEIGHT+BOUNCE--------------------------------------------------- //
interface bouncyHeightChangeProps {
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyHeightChange = ({
	initialHeight = 0,
	finalHeight = 1,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyHeightChangeProps) => ({
	initial: {
		scaleY: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		scaleY: [initialHeight, maxHeight, finalHeight],
		opacity: finalOpacity,
		transition: {
			scaleY: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		scaleY: [finalHeight, maxHeight, initialHeight],
		opacity: initialOpacity,
		transition: {
			scaleY: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface bouncyHeightChangeByPercentProps {
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyHeightChangeByPercent = ({
	initialHeight = 0,
	finalHeight = 100,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyHeightChangeByPercentProps) => ({
	initial: {
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		height: [`${initialHeight}%`, `${maxHeight}%`, `${finalHeight}%`],
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		height: [`${finalHeight}%`, `${maxHeight}%`, `${initialHeight}%`],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface bouncyHeightChangeByPxProps {
	initialHeight?: number
	finalHeight: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyHeightChangeByPx = ({
	initialHeight = 0,
	finalHeight,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyHeightChangeByPxProps) => ({
	initial: {
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		height: [`${initialHeight}px`, `${maxHeight}px`, `${finalHeight}px`],
		opacity: finalOpacity,
		transition: {
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		height: [`${finalHeight}px`, `${maxHeight}px`, `${initialHeight}px`],
		opacity: initialOpacity,
		transition: {
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------POP-UP---------------------------------------------------------- //
interface popUpProps {
	initialSize?: number
	finalSize?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const popUp = ({
	initialSize = 0,
	finalSize = 1,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: popUpProps) => ({
	initial: {
		scale: initialSize,
		opacity: initialOpacity
	},
	animate: {
		scale: finalSize,
		opacity: finalOpacity,
		transition: {
			scale: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		scale: initialSize,
		opacity: initialOpacity,
		transition: {
			scale: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface popUpByPercentProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const popUpByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	initialHeight = 0,
	finalHeight = 100,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: popUpByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}%`,
		height: `${finalHeight}%`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			height: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: `${initialWidth}%`,
		height: `${initialHeight}%`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			height: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface popUpByPxProps {
	initialWidth?: number
	finalWidth: number
	initialHeight?: number
	finalHeight: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const popUpByPx = ({
	initialWidth = 0,
	finalWidth,
	initialHeight = 0,
	finalHeight,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: popUpByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}px`,
		height: `${finalHeight}px`,
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			height: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: `${initialWidth}px`,
		height: `${initialHeight}px`,
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			height: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------BOUNCY-POP-UP--------------------------------------------------- //
interface bouncyPopUpProps {
	initialSize?: number
	finalSize?: number
	maxSize?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyPopUp = ({
	initialSize = 0,
	finalSize = 1,
	maxSize = finalSize * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyPopUpProps) => ({
	initial: {
		scale: initialSize,
		opacity: initialOpacity
	},
	animate: {
		scale: [initialSize, maxSize, finalSize],
		opacity: finalOpacity,
		transition: {
			scale: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		scale: [finalSize, maxSize, initialSize],
		opacity: initialOpacity,
		transition: {
			scale: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface bouncyPopUpByPercentProps {
	initialWidth?: number
	finalWidth?: number
	maxWidth?: number
	initialHeight?: number
	finalHeight?: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyPopUpByPercent = ({
	initialWidth = 0,
	finalWidth = 100,
	maxWidth = finalWidth * 1.2,
	initialHeight = 0,
	finalHeight = 100,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyPopUpByPercentProps) => ({
	initial: {
		width: `${initialWidth}%`,
		height: `${initialHeight}%`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}%`, `${maxWidth}%`, `${finalWidth}%`],
		height: [`${initialHeight}%`, `${maxHeight}%`, `${finalHeight}%`],
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: [`${finalWidth}%`, `${maxWidth}%`, `${initialWidth}%`],
		height: [`${finalHeight}%`, `${maxHeight}%`, `${initialHeight}%`],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

interface bouncyPopUpByPxProps {
	initialWidth?: number
	finalWidth: number
	maxWidth?: number
	initialHeight?: number
	finalHeight: number
	maxHeight?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyPopUpByPx = ({
	initialWidth = 0,
	finalWidth,
	maxWidth = finalWidth * 1.2,
	initialHeight = 0,
	finalHeight,
	maxHeight = finalHeight * 1.2,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyPopUpByPxProps) => ({
	initial: {
		width: `${initialWidth}px`,
		height: `${initialHeight}px`,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}px`, `${maxWidth}px`, `${finalWidth}px`],
		height: [`${initialHeight}px`, `${maxHeight}px`, `${finalHeight}px`],
		opacity: finalOpacity,
		transition: {
			width: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			height: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		width: [`${finalWidth}px`, `${maxWidth}px`, `${initialWidth}px`],
		height: [`${finalHeight}px`, `${maxHeight}px`, `${initialHeight}px`],
		opacity: initialOpacity,
		transition: {
			width: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			height: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// ------------------------------------------------------------------------ //
// --------POSITION-------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------Y-MOVE---------------------------------------------------------- //
interface yMoveProps {
	from?: number
	to?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const yMove = ({
	from = -100,
	to = 0,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: yMoveProps) => ({
	initial: {
		y: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		y: `${to}px`,
		opacity: finalOpacity,
		transition: {
			y: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		y: `${from}px`,
		opacity: initialOpacity,
		transition: {
			y: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------Y-MOVE+BOUNCE--------------------------------------------------- //
interface bouncyYMoveProps {
	from?: number
	to?: number
	extra?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyYMove = ({
	from = -100,
	to = 0,
	extra = to + 10,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyYMoveProps) => ({
	initial: {
		y: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		y: [`${from}px`, `${extra}px`, `${to}px`],
		opacity: finalOpacity,
		transition: {
			y: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		y: [`${to}px`, `${extra}px`, `${from}px`],
		opacity: initialOpacity,
		transition: {
			y: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------X-MOVE---------------------------------------------------------- //
interface xMoveProps {
	from?: number
	to?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const xMove = ({
	from = -100,
	to = 0,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: xMoveProps) => ({
	initial: {
		x: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		x: `${to}px`,
		opacity: finalOpacity,
		transition: {
			x: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		x: `${from}px`,
		opacity: initialOpacity,
		transition: {
			x: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// --------X-MOVE+BOUNCE--------------------------------------------------- //
interface bouncyXMoveProps {
	from?: number
	to?: number
	extra?: number
	maxAt?: number
	initialOpacity?: number
	finalOpacity?: number
	inDuration?: number
	outDuration?: number
	animateEase?: string
	exitEase?: string
	inDelay?: number
	outDelay?: number
}
export const bouncyXMove = ({
	from = -100,
	to = 0,
	extra = to + 10,
	maxAt = 0.75,
	initialOpacity = 0,
	finalOpacity = 1,
	inDuration = 0.5,
	outDuration = inDuration,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = inDelay
}: bouncyXMoveProps) => ({
	initial: {
		x: `${from}px`,
		opacity: initialOpacity
	},
	animate: {
		x: [`${from}px`, `${extra}px`, `${to}px`],
		opacity: finalOpacity,
		transition: {
			x: {
				duration: inDuration,
				times: [0, maxAt, 1],
				ease: animateEase,
				delay: inDelay
			},
			opacity: {
				duration: inDuration,
				ease: animateEase,
				delay: inDelay
			}
		}
	},
	exit: {
		x: [`${to}px`, `${extra}px`, `${from}px`],
		opacity: initialOpacity,
		transition: {
			x: {
				duration: outDuration,
				times: [0, 1 - maxAt, 1],
				ease: exitEase,
				delay: outDelay
			},
			opacity: {
				duration: outDuration,
				ease: exitEase,
				delay: outDelay
			}
		}
	}
})

// ------------------------------------------------------------------------ //
// --------MOTION-FUSION--------------------------------------------------- //
// ------------------------------------------------------------------------ //
interface MotionProps {
	initial: any;
	animate: any;
	exit: any;
}
export const mergeMotions = (...motions: MotionProps[]): MotionProps => (
	motions.reduce((current: MotionProps, accumulator: MotionProps) => ({
		initial: {
			...current.initial,
			...accumulator.initial
		},
		animate: {
			...current.animate,
			...accumulator.animate,
			transition: {
				...current.animate.transition,
				...accumulator.animate.transition,
			}
		},
		exit: {
			...accumulator.exit,
			...current.exit,
			transition: {
				...accumulator.exit.transition,
				...current.exit.transition
			}
		}
	}), {
		initial: {},
		animate: { transition: {} },
		exit: { transition: {} },
	})
)