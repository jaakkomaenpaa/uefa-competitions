import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { themeToCssVariables } from './utils/styles'
import theme from './theme'

const rootElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootElement)

const cssVariables = themeToCssVariables(theme)
const styleElement = document.createElement('style')
styleElement.textContent = `:root { ${cssVariables} }`
document.head.appendChild(styleElement)

root.render(<App />)
