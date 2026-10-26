import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import './App.css'

const FONT_FAMILIES = [
  { value: 'Impact', label: 'Impact (Classic Meme)' },
  { value: 'Arial Black', label: 'Arial Black' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Bangers', label: 'Bangers' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  { value: 'Luckiest Guy', label: 'Luckiest Guy' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
]

const PRESET_BACKGROUNDS = [
  { id: 'solid-black', type: 'color', value: '#000000', label: 'Чёрный' },
  { id: 'solid-white', type: 'color', value: '#ffffff', label: 'Белый' },
  { id: 'solid-red', type: 'color', value: '#ff0000', label: 'Красный' },
  { id: 'solid-blue', type: 'color', value: '#0066ff', label: 'Синий' },
  { id: 'solid-green', type: 'color', value: '#00aa00', label: 'Зелёный' },
  { id: 'gradient-1', type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', label: 'Фиолетовый градиент' },
  { id: 'gradient-2', type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', label: 'Розовый градиент' },
  { id: 'gradient-3', type: 'gradient', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', label: 'Голубой градиент' },
  { id: 'gradient-4', type: 'gradient', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', label: 'Зелёный градиент' },
  { id: 'gradient-5', type: 'gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', label: 'Тёплый градиент' },
  { id: 'gradient-6', type: 'gradient', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', label: 'Пастельный градиент' },
]

const CANVAS_SIZES = [
  { value: '1:1', label: 'Квадрат (1080x1080)', width: 1080, height: 1080 },
  { value: '16:9', label: 'Горизонтальный (1920x1080)', width: 1920, height: 1080 },
  { value: '9:16', label: 'Вертикальный (1080x1920)', width: 1080, height: 1920 },
  { value: '4:5', label: 'Instagram портрет (1080x1350)', width: 1080, height: 1350 },
  { value: '5:4', label: 'Instagram ландшафт (1350x1080)', width: 1350, height: 1080 },
]

function App() {
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [background, setBackground] = useState({ type: 'color', value: '#000000' })
  const [customImage, setCustomImage] = useState(null)
  const [fontFamily, setFontFamily] = useState('Impact')
  const [fontSize, setFontSize] = useState(80)
  const [fontColor, setFontColor] = useState('#ffffff')
  const [outlineColor, setOutlineColor] = useState('#000000')
  const [outlineWidth, setOutlineWidth] = useState(4)
  const [textAlign, setTextAlign] = useState('center')
  const [lineHeight, setLineHeight] = useState(1.2)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [topTextY, setTopTextY] = useState(10)
  const [bottomTextY, setBottomTextY] = useState(90)
  const [canvasRatio, setCanvasRatio] = useState('1:1')
  const [showSettings, setShowSettings] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  
  const canvasRef = useRef(null)
  const previewRef = useRef(null)

  const currentSize = CANVAS_SIZES.find(s => s.value === canvasRatio) || CANVAS_SIZES[0]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCustomImage(event.target.result)
        setBackground({ type: 'image', value: event.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePresetBackground = (bg) => {
    setBackground({ type: bg.type, value: bg.value })
    setCustomImage(null)
  }

  const getTextStyle = (yPos) => ({
    fontFamily: `'${fontFamily}', sans-serif`,
    fontSize: `${fontSize}px`,
    color: fontColor,
    textAlign,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    textShadow: outlineWidth > 0 
      ? `${outlineWidth}px ${outlineWidth}px 0 ${outlineColor}, -${outlineWidth}px -${outlineWidth}px 0 ${outlineColor}, ${outlineWidth}px -${outlineWidth}px 0 ${outlineColor}, -${outlineWidth}px ${outlineWidth}px 0 ${outlineColor}`
      : 'none',
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: `${yPos}%`,
    transform: 'translateY(-50%)',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    userSelect: 'none',
    pointerEvents: 'none',
  })

  const downloadImage = async () => {
    if (!canvasRef.current) return
    
    setIsExporting(true)
    
    try {
      const canvas = canvasRef.current
      const scale = Math.max(currentSize.width / canvas.offsetWidth, currentSize.height / canvas.offsetHeight)
      
      const blob = await new Promise((resolve) => {
        html2canvas(canvas, {
          scale: scale * 2,
          useCORS: true,
          logging: false,
          backgroundColor: null,
        }).then((result) => {
          result.toBlob(resolve, 'image/png', 1.0)
        })
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meme-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Ошибка при экспорте. Попробуйте ещё раз.')
    } finally {
      setIsExporting(false)
    }
  }

  const copyToClipboard = async () => {
    if (!canvasRef.current) return
    
    try {
      const canvas = canvasRef.current
      const scale = Math.max(currentSize.width / canvas.offsetWidth, currentSize.height / canvas.offsetHeight)
      
      const result = await html2canvas(canvas, {
        scale: scale * 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      })
      
      result.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          alert('Скопировано в буфер обмена!')
        } catch (err) {
          console.error('Clipboard error:', err)
          alert('Не удалось скопировать. Используйте кнопку скачивания.')
        }
      }, 'image/png')
    } catch (error) {
      console.error('Copy error:', error)
      alert('Ошибка при копировании.')
    }
  }

  const resetToDefaults = () => {
    setTopText('')
    setBottomText('')
    setBackground({ type: 'color', value: '#000000' })
    setCustomImage(null)
    setFontFamily('Impact')
    setFontSize(80)
    setFontColor('#ffffff')
    setOutlineColor('#000000')
    setOutlineWidth(4)
    setTextAlign('center')
    setLineHeight(1.2)
    setLetterSpacing(0)
    setTopTextY(10)
    setBottomTextY(90)
    setCanvasRatio('1:1')
  }

  const backgroundStyle = background.type === 'image' 
    ? { backgroundImage: `url(${background.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : background.type === 'gradient'
      ? { background: background.value }
      : { backgroundColor: background.value }

  return (
    <div className="app">
      <header className="header">
        <h1>🎭 Meme Generator</h1>
        <p>Создавай мемы и карточки для соцсетей</p>
      </header>

      <div className="main-container">
        {/* Preview Panel */}
        <div className="preview-panel">
          <div 
            ref={canvasRef}
            className="meme-canvas"
            style={{
              ...backgroundStyle,
              width: currentSize.width / 2,
              height: currentSize.height / 2,
              aspectRatio: currentSize.width / currentSize.height,
            }}
          >
            {topText && (
              <div className="meme-text top-text" style={getTextStyle(topTextY)}>
                {topText}
              </div>
            )}
            {bottomText && (
              <div className="meme-text bottom-text" style={getTextStyle(bottomTextY)}>
                {bottomText}
              </div>
            )}
          </div>
          
          <div className="canvas-controls">
            <label className="ratio-selector">
              <span>Размер:</span>
              <select value={canvasRatio} onChange={(e) => setCanvasRatio(e.target.value)}>
                {CANVAS_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <div className="export-buttons">
            <button 
              className="btn btn-primary" 
              onClick={downloadImage} 
              disabled={isExporting}
            >
              {isExporting ? '⏳ Скачивание...' : '💾 Скачать PNG'}
            </button>
            <button className="btn btn-secondary" onClick={copyToClipboard}>
              📋 В буфер обмена
            </button>
            <button className="btn btn-outline" onClick={resetToDefaults}>
              🔄 Сброс
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="controls-panel">
          <button 
            className="toggle-settings"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? '▲ Скрыть настройки' : '▼ Показать настройки'}
          </button>

          {showSettings && (
            <div className="settings">
              {/* Text Inputs */}
              <section className="setting-group">
                <h3>📝 Текст</h3>
                <div className="input-group">
                  <label>Верхний текст</label>
                  <textarea
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    placeholder="Верхний текст мема..."
                    rows={2}
                  />
                </div>
                <div className="input-group">
                  <label>Нижний текст</label>
                  <textarea
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    placeholder="Нижний текст мема..."
                    rows={2}
                  />
                </div>
              </section>

              {/* Background */}
              <section className="setting-group">
                <h3>🎨 Фон</h3>
                
                <div className="input-group">
                  <label>Загрузить своё изображение</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  {customImage && (
                    <div className="custom-image-preview">
                      <img src={customImage} alt="Custom background" />
                      <button type="button" onClick={() => { setCustomImage(null); setBackground({ type: 'color', value: '#000000' }) }}>Удалить</button>
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label>Готовые фоны</label>
                  <div className="preset-backgrounds">
                    {PRESET_BACKGROUNDS.map(bg => (
                      <button
                        key={bg.id}
                        className={`preset-bg ${background.value === bg.value ? 'active' : ''}`}
                        onClick={() => handlePresetBackground(bg)}
                        style={bg.type === 'color' ? { backgroundColor: bg.value } : bg.type === 'gradient' ? { background: bg.value } : {}}
                        title={bg.label}
                      >
                        {bg.type === 'image' && '🖼️'}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Font Settings */}
              <section className="setting-group">
                <h3>🔤 Шрифт</h3>
                <div className="input-group">
                  <label>Шрифт</label>
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                
                <div className="slider-group">
                  <label>Размер: {fontSize}px</label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                </div>

                <div className="color-row">
                  <div className="input-group">
                    <label>Цвет текста</label>
                    <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>Цвет обводки</label>
                    <input type="color" value={outlineColor} onChange={(e) => setOutlineColor(e.target.value)} />
                  </div>
                </div>

                <div className="slider-group">
                  <label>Толщина обводки: {outlineWidth}px</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={outlineWidth}
                    onChange={(e) => setOutlineWidth(Number(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <label>Выравнивание</label>
                  <select value={textAlign} onChange={(e) => setTextAlign(e.target.value)}>
                    <option value="left">По левому краю</option>
                    <option value="center">По центру</option>
                    <option value="right">По правому краю</option>
                  </select>
                </div>

                <div className="slider-group">
                  <label>Межстрочный интервал: {lineHeight}</label>
                  <input
                    type="range"
                    min="0.8"
                    max="2"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                  />
                </div>

                <div className="slider-group">
                  <label>Межбуквенный интервал: {letterSpacing}px</label>
                  <input
                    type="range"
                    min="-2"
                    max="10"
                    value={letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  />
                </div>
              </section>

              {/* Position Settings */}
              <section className="setting-group">
                <h3>📍 Позиция текста</h3>
                <div className="slider-group">
                  <label>Верхний текст (Y): {topTextY}%</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={topTextY}
                    onChange={(e) => setTopTextY(Number(e.target.value))}
                  />
                </div>
                <div className="slider-group">
                  <label>Нижний текст (Y): {bottomTextY}%</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={bottomTextY}
                    onChange={(e) => setBottomTextY(Number(e.target.value))}
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>Сделано с ❤️ на React + Vite | <a href="https://github.com" target="_blank" rel="noopener">GitHub</a></p>
      </footer>

      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Luckiest+Guy&family=Permanent+Marker&display=swap" rel="stylesheet" />
    </div>
  )
}

export default App