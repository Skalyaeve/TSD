// ------------------------------------------------------------------------ //
// --------ELEMENTS-------------------------------------------------------- //
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: widthChangeByPxProps) => ({
	initial: {
		width: initialWidth,
		opacity: initialOpacity
	},
	animate: {
		width: finalWidth,
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
		width: initialWidth,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyWidthChangeByPxProps) => ({
	initial: {
		width: initialWidth,
		opacity: initialOpacity
	},
	animate: {
		width: [initialWidth, maxWidth, finalWidth],
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
		width: [finalWidth, maxWidth, initialWidth],
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: heightChangeByPercentProps) => ({
	initial: {
		height: `${initialHeight}% `,
		opacity: initialOpacity
	},
	animate: {
		height: `${finalHeight}% `,
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
		height: `${initialHeight}% `,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: heightChangeByPxProps) => ({
	initial: {
		height: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		height: finalHeight,
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
		height: initialHeight,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyHeightChangeByPercentProps) => ({
	initial: {
		height: `${initialHeight}% `,
		opacity: initialOpacity
	},
	animate: {
		height: [`${initialHeight}% `, `${maxHeight}% `, `${finalHeight}% `],
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
		height: [`${finalHeight}% `, `${maxHeight}% `, `${initialHeight}% `],
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyHeightChangeByPxProps) => ({
	initial: {
		height: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		height: [initialHeight, maxHeight, finalHeight],
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
		height: [finalHeight, maxHeight, initialHeight],
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: popUpByPercentProps) => ({
	initial: {
		width: `${initialWidth}% `,
		height: `${initialHeight}% `,
		opacity: initialOpacity
	},
	animate: {
		width: `${finalWidth}% `,
		height: `${finalHeight}% `,
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
		width: `${initialWidth}% `,
		height: `${initialHeight}% `,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: popUpByPxProps) => ({
	initial: {
		width: initialWidth,
		height: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		width: finalWidth,
		height: finalHeight,
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
		width: initialWidth,
		height: initialHeight,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyPopUpByPercentProps) => ({
	initial: {
		width: `${initialWidth}% `,
		height: `${initialHeight}% `,
		opacity: initialOpacity
	},
	animate: {
		width: [`${initialWidth}% `, `${maxWidth}% `, `${finalWidth}% `],
		height: [`${initialHeight}% `, `${maxHeight}% `, `${finalHeight}% `],
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
		width: [`${finalWidth}% `, `${maxWidth}% `, `${initialWidth}% `],
		height: [`${finalHeight}% `, `${maxHeight}% `, `${initialHeight}% `],
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyPopUpByPxProps) => ({
	initial: {
		width: initialWidth,
		height: initialHeight,
		opacity: initialOpacity
	},
	animate: {
		width: [initialWidth, maxWidth, finalWidth],
		height: [initialHeight, maxHeight, finalHeight],
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
		width: [finalWidth, maxWidth, initialWidth],
		height: [finalHeight, maxHeight, initialHeight],
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: yMoveProps) => ({
	initial: {
		y: from,
		opacity: initialOpacity
	},
	animate: {
		y: to,
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
		y: from,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyYMoveProps) => ({
	initial: {
		y: from,
		opacity: initialOpacity
	},
	animate: {
		y: [from, extra, to],
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
		y: [to, extra, from],
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: xMoveProps) => ({
	initial: {
		x: from,
		opacity: initialOpacity
	},
	animate: {
		x: to,
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
		x: from,
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
	outDuration = 0.5,
	animateEase = 'easeInOut',
	exitEase = animateEase,
	inDelay = 0,
	outDelay = 0
}: bouncyXMoveProps) => ({
	initial: {
		x: from,
		opacity: initialOpacity
	},
	animate: {
		x: [from, extra, to],
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
		x: [to, extra, from],
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
			...current.exit,
			...accumulator.exit,
			transition: {
				...current.exit.transition,
				...accumulator.exit.transition
			}
		}
	}), {
		initial: {},
		animate: { transition: {} },
		exit: { transition: {} },
	})
)