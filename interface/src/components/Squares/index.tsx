import React, { useRef, useEffect } from 'react'

interface GridOffset {
  x: number
  y: number
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
}

// Generate random offset within distance range
const generateRandomOffset = (minDist: number, maxDist: number): GridOffset => {
  const distance = minDist + Math.random() * (maxDist - minDist)
  const angle = Math.random() * 2 * Math.PI
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance)
  }
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(123, 47, 190, 0.12)',
  squareSize = 40,
  hoverFillColor = 'rgba(168, 85, 247, 0.25)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const numSquaresX = useRef<number>(0)
  const numSquaresY = useRef<number>(0)
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 })
  const hoveredSquareRef = useRef<GridOffset | null>(null)
  const randomOffsetsRef = useRef<GridOffset[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const drawGrid = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize)
          const squareY = y - (gridOffset.current.y % squareSize)

          const gridX = Math.floor((x - startX) / squareSize)
          const gridY = Math.floor((y - startY) / squareSize)

          if (hoveredSquareRef.current) {
            const hx = hoveredSquareRef.current.x
            const hy = hoveredSquareRef.current.y

            const isCursor = gridX === hx && gridY === hy

            const mirrorIndex = randomOffsetsRef.current.findIndex(
              offset => gridX === hx + offset.x && gridY === hy + offset.y
            )

            if (isCursor) {
              ctx.fillStyle = hoverFillColor
              ctx.fillRect(squareX, squareY, squareSize, squareSize)
            } else if (mirrorIndex === 0) {
              ctx.fillStyle = 'rgba(168, 85, 247, 0.20)'
              ctx.fillRect(squareX, squareY, squareSize, squareSize)
            } else if (mirrorIndex === 1) {
              ctx.fillStyle = 'rgba(139, 92, 246, 0.15)'
              ctx.fillRect(squareX, squareY, squareSize, squareSize)
            } else if (mirrorIndex === 2) {
              ctx.fillStyle = 'rgba(192, 132, 252, 0.12)'
              ctx.fillRect(squareX, squareY, squareSize, squareSize)
            } else if (mirrorIndex === 3) {
              ctx.fillStyle = 'rgba(217, 70, 239, 0.08)'
              ctx.fillRect(squareX, squareY, squareSize, squareSize)
            }
          }

          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }

      // Vignette effect matching dark theme
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      )
      gradient.addColorStop(0, 'rgba(15, 10, 26, 0)')
      gradient.addColorStop(0.7, 'rgba(15, 10, 26, 0.3)')
      gradient.addColorStop(1, 'rgba(15, 10, 26, 0.85)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          break
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize
          break
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize
          break
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed * 0.6 + squareSize) % squareSize
          break
        default:
          break
      }

      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize)
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize)

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY }
        
        // Generate 4 mirror squares at varying distances with purple theme
        randomOffsetsRef.current = [
          generateRandomOffset(2, 4),
          generateRandomOffset(4, 6),
          generateRandomOffset(5, 8),
          generateRandomOffset(7, 10),
        ]
      }
    }

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    requestRef.current = requestAnimationFrame(updateAnimation)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize])

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        display: 'block',
        border: 'none',
      }}
    />
  )
}

export default Squares
