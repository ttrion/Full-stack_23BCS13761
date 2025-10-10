import React, { useState, useRef } from 'react';

const SVG_NS = 'http://www.w3.org/2000/svg';

const App = () => {
    const [elements, setElements] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
    const [color, setColor] = useState('blue');
    const svgRef = useRef(null);

    const getCoordinates = (e) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const svgRect = svgRef.current.getBoundingClientRect();
        return {
            x: e.clientX - svgRect.left,
            y: e.clientY - svgRect.top,
        };
    };

    const handleMouseDown = (e) => {
        const { x, y } = getCoordinates(e);
        setStartPoint({ x, y });
        setDrawing(true);
        setElements(prev => [...prev, {
            type: 'circle',
            cx: x, cy: y, r: 0,
            fill: color, id: Date.now()
        }]);
    };

    const handleMouseMove = (e) => {
        if (!drawing) return;
        const { x, y } = getCoordinates(e);
        const lastElementIndex = elements.length - 1;
        const radius = Math.sqrt((x - startPoint.x) ** 2 + (y - startPoint.y) ** 2);
        
        setElements(prev => {
            const newElements = [...prev];
            if (newElements.length > 0) {
                newElements[lastElementIndex] = {
                    ...newElements[lastElementIndex],
                    r: radius,
                };
            }
            return newElements;
        });
    };

    const handleMouseUp = () => {
        setDrawing(false);
    };

    const handleUndo = () => {
        setElements(prev => prev.slice(0, -1));
    };

    return (
        <div style={{ margin: '20px' }}>
            <h1>Interactive SVG Drawing Tool</h1>
            <div style={{ marginBottom: '10px' }}>
                <label>
                    Select Color:
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ marginLeft: '10px' }} />
                </label>
                <button onClick={handleUndo} disabled={elements.length === 0} style={{ marginLeft: '20px', padding: '5px 10px' }}>
                    Undo
                </button>
            </div>
            
            <svg
                ref={svgRef}
                width="600"
                height="400"
                style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} 
            >
                {elements.map(el => {
                    if (el.type === 'circle') {
                        return (
                            <circle
                                key={el.id}
                                cx={el.cx}
                                cy={el.cy}
                                r={el.r}
                                fill={el.fill}
                                stroke="black"
                                strokeWidth="1"
                            />
                        );
                    }
                    return null;
                })}
            </svg>
        </div>
    );
};

export default App;